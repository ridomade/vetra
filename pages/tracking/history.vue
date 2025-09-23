<!-- File: pages/tracking.vue (Nuxt 3) -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Vehicle Playback (Leaflet)</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Vehicle Playback</h1>
            </div>
            <div class="flex items-center gap-2 text-xs">
                <span class="inline-block w-3 h-3 rounded-full bg-blue-500"></span> Route
                <span class="inline-block w-3 h-3 rounded-full bg-green-500 ml-3"></span> Start
                <span class="inline-block w-3 h-3 rounded-full bg-red-500 ml-3"></span> End
            </div>
        </div>

        <!-- Filters -->
        <div class="card p-3 mb-4">
            <form class="grid grid-cols-1 md:grid-cols-6 gap-3" @submit.prevent="loadRoutes">
                <div class="md:col-span-2">
                    <label class="lbl">From Date</label>
                    <input v-model="filters.from" type="date" class="input" />
                </div>
                <div class="md:col-span-2">
                    <label class="lbl">To Date</label>
                    <input v-model="filters.to" type="date" class="input" />
                </div>
                <div class="md:col-span-1">
                    <label class="lbl">Vehicle</label>
                    <select v-model="filters.vehicle" class="input">
                        <option value="all">All Vehicles</option>
                        <option v-for="v in vehicles" :key="v.id" :value="v.id">
                            {{ v.label }}
                        </option>
                    </select>
                </div>
                <div class="md:col-span-1 flex items-end">
                    <button class="btn-primary w-full" type="submit">Load</button>
                </div>
            </form>
        </div>

        <!-- Map -->
        <client-only>
            <div
                ref="mapEl"
                class="rounded-2xl overflow-hidden border bg-white"
                style="height: 72vh"
            ></div>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useHead } from "#imports";

/** Pusat lokasi: Pt. Bara Mega Quantum */
const SITE = { lat: -3.8447964, lng: 102.3431685 };
const INITIAL_ZOOM = 14;

// ====== FLAGS (PROD vs DUMMY) ======
const USE_DUMMY = true; // set ke false saat pakai data asli
const SNAP_TO_ROADS = true; // true = rute mengikuti jalan via OSRM
const OFFTRACK = {
    // simulasi off-track internal (hanya untuk dummy)
    enabled: USE_DUMMY, // set ke false saat data asli
    pct: 12, // ~12% titik akan menyimpang
    maxMeters: 30, // deviasi maks 30 m
};

// Leaflet via CDN
useHead({
    link: [{ rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" }],
    script: [{ src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", defer: true }],
});

const mapEl = ref<HTMLDivElement | null>(null);
let map: any;
let layerGroup: any;

const vehicles = [
    { id: "truck-a", label: "Truck A" },
    { id: "truck-b", label: "Truck B" },
    { id: "truck-c", label: "Truck C" },
];

/** Waypoints contoh di sekitar SITE (dummy). Ganti ke data backend saat real. */
const tracks: Record<string, Array<{ lat: number; lng: number; ts: string }>> = {
    "truck-a": [
        { lat: SITE.lat - 0.004, lng: SITE.lng - 0.006, ts: "2025-09-21T07:10:00Z" },
        { lat: SITE.lat - 0.001, lng: SITE.lng - 0.001, ts: "2025-09-21T07:45:00Z" },
        { lat: SITE.lat + 0.002, lng: SITE.lng + 0.003, ts: "2025-09-21T08:25:00Z" },
    ],
    "truck-b": [
        { lat: SITE.lat + 0.005, lng: SITE.lng - 0.004, ts: "2025-09-22T03:20:00Z" },
        { lat: SITE.lat + 0.001, lng: SITE.lng + 0.0, ts: "2025-09-22T04:05:00Z" },
        { lat: SITE.lat - 0.003, lng: SITE.lng + 0.004, ts: "2025-09-22T04:50:00Z" },
    ],
    "truck-c": [
        { lat: SITE.lat - 0.002, lng: SITE.lng + 0.006, ts: "2025-09-23T01:00:00Z" },
        { lat: SITE.lat + 0.0, lng: SITE.lng + 0.0, ts: "2025-09-23T01:40:00Z" },
        { lat: SITE.lat + 0.004, lng: SITE.lng - 0.004, ts: "2025-09-23T02:30:00Z" },
    ],
};

const filters = reactive({ from: "", to: "", vehicle: "all" });

function waitForLeaflet(): Promise<void> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).L) return resolve();
        const t = setInterval(() => {
            if ((window as any).L) {
                clearInterval(t);
                resolve();
            }
        }, 30);
    });
}

function colorFor(id: string) {
    const map: Record<string, string> = {
        "truck-a": "#3b82f6",
        "truck-b": "#10b981",
        "truck-c": "#f59e0b",
    };
    return map[id] || "#0ea5e9";
}
function toEndOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
}
function clearLayers() {
    if (layerGroup) layerGroup.clearLayers();
}
function labelFor(id: string) {
    return vehicles.find((v) => v.id === id)?.label || id;
}

// ---------- Simulasi off-track internal (tidak tampil di UI) ----------
function addJitter(lat: number, lng: number, maxMeters: number): [number, number] {
    if (maxMeters <= 0) return [lat, lng];
    const bearing = Math.random() * 2 * Math.PI;
    const dist = Math.random() * maxMeters;
    const metersPerDegLat = 111_320;
    const metersPerDegLng = 111_320 * Math.cos((lat * Math.PI) / 180);
    const dLat = (Math.cos(bearing) * dist) / metersPerDegLat;
    const dLng = (Math.sin(bearing) * dist) / metersPerDegLng;
    return [lat + dLat, lng + dLng];
}
function maybeOffTrack(path: [number, number][]): [number, number][] {
    if (!OFFTRACK.enabled || OFFTRACK.pct <= 0 || OFFTRACK.maxMeters <= 0) return path;
    return path.map(([la, lo]) =>
        Math.random() * 100 < OFFTRACK.pct ? addJitter(la, lo, OFFTRACK.maxMeters) : [la, lo]
    );
}

// ---------- Snap to roads dengan OSRM (tanpa API key) ----------
async function fetchOSRMRoute(points: { lat: number; lng: number }[]): Promise<[number, number][]> {
    if (points.length < 2) return points.map((p) => [p.lat, p.lng]);
    const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`OSRM: ${res.status}`);
        const data = await res.json();
        const coordsLngLat: [number, number][] = data?.routes?.[0]?.geometry?.coordinates || [];
        return coordsLngLat.map(([lng, lat]) => [lat, lng]); // ke [lat,lng]
    } catch {
        // fallback: garis lurus antar waypoints
        return points.map((p) => [p.lat, p.lng]);
    }
}

async function buildPath(raw: Array<{ lat: number; lng: number }>): Promise<[number, number][]> {
    let path = SNAP_TO_ROADS
        ? await fetchOSRMRoute(raw)
        : raw.map((p) => [p.lat, p.lng] as [number, number]);
    // hanya untuk dummy: suntik off-track kecil
    path = maybeOffTrack(path);
    return path;
}

async function loadRoutes() {
    const L: any = (window as any).L;
    clearLayers();

    const from = filters.from ? new Date(`${filters.from}T00:00:00`) : undefined;
    const to = filters.to ? toEndOfDay(new Date(`${filters.to}T00:00:00`)) : undefined;

    const ids = filters.vehicle === "all" ? Object.keys(tracks) : [filters.vehicle];
    const allBounds: any[] = [];

    for (const id of ids) {
        const raw = (tracks[id] || []).filter((p) => {
            const t = new Date(p.ts);
            return (!from || t >= from) && (!to || t <= to);
        });
        if (raw.length < 2) continue;

        const latlngs: [number, number][] = await buildPath(raw);

        const poly = L.polyline(latlngs, { weight: 4, opacity: 0.9, color: colorFor(id) }).addTo(
            layerGroup
        );
        const start = L.circleMarker(latlngs[0], {
            radius: 6,
            color: "#16a34a",
            fillColor: "#16a34a",
            fillOpacity: 1,
        }).addTo(layerGroup);
        const end = L.circleMarker(latlngs[latlngs.length - 1], {
            radius: 6,
            color: "#dc2626",
            fillColor: "#dc2626",
            fillOpacity: 1,
        }).addTo(layerGroup);

        start.bindTooltip(`${labelFor(id)} — Start`);
        end.bindTooltip(`${labelFor(id)} — End`);
        poly.bindPopup(`<strong>${labelFor(id)}</strong><br/>Points: ${latlngs.length}`);

        allBounds.push(poly.getBounds());
    }

    if (allBounds.length) {
        let merged = allBounds[0];
        for (let i = 1; i < allBounds.length; i++) merged = merged.extend(allBounds[i]);
        map.fitBounds(merged.pad(0.2));
    }
}

async function initMap() {
    const L: any = (window as any).L;
    if (!mapEl.value) return;
    map = L.map(mapEl.value, { zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    map.setView([SITE.lat, SITE.lng], INITIAL_ZOOM);
    layerGroup = L.layerGroup().addTo(map);
}

onMounted(async () => {
    await waitForLeaflet();
    await initMap();
    loadRoutes();
});
</script>

<style scoped>
.card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    background: #fff;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.input:focus {
    border-color: #a3a3a3;
    box-shadow: 0 0 0 2px rgba(23, 23, 23, 0.1);
}
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background: #171717;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn-primary:hover {
    background: #262626;
}
.btn-primary:disabled {
    opacity: 0.5;
    pointer-events: none;
}
.lbl {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #404040;
    margin-bottom: 0.25rem;
}
</style>
