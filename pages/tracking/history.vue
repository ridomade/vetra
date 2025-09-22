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

// Load Leaflet via CDN to avoid TS typings requirement
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

// Dummy tracks
const tracks: Record<string, Array<{ lat: number; lng: number; ts: string }>> = {
    "truck-a": [
        { lat: -6.9175, lng: 107.6191, ts: "2025-09-21T07:10:00Z" },
        { lat: -6.8, lng: 107.9, ts: "2025-09-21T07:40:00Z" },
        { lat: -6.5, lng: 108.3, ts: "2025-09-21T08:20:00Z" },
        { lat: -6.2, lng: 107.0, ts: "2025-09-21T09:10:00Z" },
        { lat: -6.1745, lng: 106.8227, ts: "2025-09-21T10:00:00Z" },
    ],
    "truck-b": [
        { lat: -7.2575, lng: 112.7521, ts: "2025-09-22T03:20:00Z" },
        { lat: -7.0, lng: 112.2, ts: "2025-09-22T04:00:00Z" },
        { lat: -6.8, lng: 111.7, ts: "2025-09-22T04:45:00Z" },
        { lat: -6.6, lng: 111.0, ts: "2025-09-22T05:30:00Z" },
        { lat: -6.4, lng: 110.4, ts: "2025-09-22T06:15:00Z" },
    ],
    "truck-c": [
        { lat: -6.1214, lng: 106.7741, ts: "2025-09-23T01:00:00Z" },
        { lat: -6.3, lng: 106.3, ts: "2025-09-23T02:00:00Z" },
        { lat: -6.4, lng: 106.0, ts: "2025-09-23T03:00:00Z" },
        { lat: -6.5, lng: 105.9, ts: "2025-09-23T04:00:00Z" },
        { lat: -6.7, lng: 105.7, ts: "2025-09-23T05:00:00Z" },
    ],
};

const filters = reactive({ from: "", to: "", vehicle: "all" });

function waitForLeaflet(): Promise<void> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).L) return resolve();
        const timer = setInterval(() => {
            if ((window as any).L) {
                clearInterval(timer);
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

function loadRoutes() {
    const L: any = (window as any).L;
    clearLayers();
    const from = filters.from ? new Date(`${filters.from}T00:00:00`) : undefined;
    const to = filters.to ? toEndOfDay(new Date(`${filters.to}T00:00:00`)) : undefined;

    const ids = filters.vehicle === "all" ? Object.keys(tracks) : [filters.vehicle];
    const allBounds: any[] = [];

    ids.forEach((id) => {
        const raw = tracks[id] || [];
        const filtered = raw.filter((p) => {
            const t = new Date(p.ts);
            return (!from || t >= from) && (!to || t <= to);
        });
        if (filtered.length < 2) return;

        const latlngs = filtered.map((p) => [p.lat, p.lng]);
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
        poly.bindPopup(`<strong>${labelFor(id)}</strong><br/>Points: ${filtered.length}`);

        allBounds.push(poly.getBounds());
    });

    if (allBounds.length) {
        let merged = allBounds[0];
        for (let i = 1; i < allBounds.length; i++) merged = merged.extend(allBounds[i]);
        map.fitBounds(merged.pad(0.2));
    }
}

function labelFor(id: string) {
    return vehicles.find((v) => v.id === id)?.label || id;
}

async function initMap() {
    const L: any = (window as any).L;
    if (!mapEl.value) return;
    map = L.map(mapEl.value, { zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    map.setView([-6.9175, 107.6191], 6);
    layerGroup = L.layerGroup().addTo(map);
}

onMounted(async () => {
    await waitForLeaflet();
    await initMap();
    loadRoutes();
});
</script>

<style scoped>
/* .card => rounded-2xl border bg-white shadow-sm */
.card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb; /* neutral-200 */
    background-color: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* .input => w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition */
.input {
    width: 100%;
    border-radius: 0.75rem; /* rounded-xl */
    border: 1px solid #e5e7eb; /* neutral-200 */
    background-color: #ffffff;
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    outline: none;
    transition: box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease,
        color 0.2s ease;
}
.input:focus {
    border-color: #a3a3a3; /* neutral-400 */
    box-shadow: 0 0 0 2px rgba(23, 23, 23, 0.1); /* ring-neutral-900/10 */
}

/* .btn-primary => inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50 */
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background-color: #171717; /* neutral-900 */
    padding: 0.5rem 1rem; /* py-2 px-4 */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    font-weight: 500; /* font-medium */
    color: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn-primary:hover {
    background-color: #262626;
} /* neutral-800 */
.btn-primary:disabled {
    opacity: 0.5;
    pointer-events: none;
}

/* .lbl => block text-sm text-neutral-700 mb-1 */
.lbl {
    display: block;
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    color: #404040; /* neutral-700 */
    margin-bottom: 0.25rem; /* mb-1 */
}
</style>
