<!-- File: pages/tracking-live.vue (Nuxt 3) -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Live Tracking (Leaflet)</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Live Tracking</h1>
            </div>
            <div class="flex items-center gap-2 text-xs">
                <span class="inline-block w-3 h-3 rounded-full bg-blue-500"></span> Trail
                <span class="inline-block w-3 h-3 rounded-full bg-green-500 ml-3"></span> Start
                <span class="inline-block w-3 h-3 rounded-full bg-red-500 ml-3"></span> Current
            </div>
        </div>

        <!-- Controls -->
        <div class="card p-3 mb-4">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                <div class="lg:col-span-4">
                    <label class="lbl">Vehicles</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <label
                            v-for="v in vehicles"
                            :key="v.id"
                            class="inline-flex items-center gap-2 text-sm"
                        >
                            <input
                                type="checkbox"
                                :value="v.id"
                                v-model="selected"
                                class="rounded"
                            />
                            <span>{{ v.label }}</span>
                        </label>
                    </div>
                    <p v-if="!selected.length" class="text-xs text-neutral-500 mt-1">
                        Pilih setidaknya satu kendaraan.
                    </p>
                </div>

                <div class="lg:col-span-2">
                    <label class="lbl">Interval (detik)</label>
                    <select class="input" v-model.number="intervalSec">
                        <option :value="1">1</option>
                        <option :value="2">2</option>
                        <option :value="3">3</option>
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                    </select>
                </div>

                <div class="lg:col-span-3">
                    <label class="lbl">Opsi</label>
                    <div class="flex flex-wrap gap-3 text-sm">
                        <label class="inline-flex items-center gap-2"
                            ><input type="checkbox" v-model="showTrail" class="rounded" /> Show
                            trail</label
                        >
                        <label class="inline-flex items-center gap-2"
                            ><input type="checkbox" v-model="autoFit" class="rounded" />
                            Auto-fit</label
                        >
                        <label class="inline-flex items-center gap-2"
                            ><input type="checkbox" v-model="follow" class="rounded" /> Follow first
                            selected</label
                        >
                    </div>
                </div>

                <div class="lg:col-span-3 flex gap-2">
                    <button
                        class="btn-primary flex-1"
                        :disabled="tracking || !selected.length"
                        @click="start"
                    >
                        Start
                    </button>
                    <button class="btn-subtle flex-1" :disabled="!tracking" @click="stop">
                        Stop
                    </button>
                    <button class="btn-subtle flex-1" @click="clearTrails">Clear trails</button>
                </div>
            </div>
        </div>

        <!-- Status Table -->
        <div class="card p-3 mb-4">
            <div class="overflow-x-auto">
                <table class="min-w-full w-full text-sm">
                    <thead class="bg-neutral-50 text-neutral-700">
                        <tr>
                            <th class="th">Vehicle</th>
                            <th class="th">Lat</th>
                            <th class="th">Lng</th>
                            <th class="th">Speed</th>
                            <th class="th">Updated</th>
                            <th class="th">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="v in vehicles" :key="v.id" class="hover:bg-neutral-50">
                            <td class="td">{{ v.label }}</td>
                            <td class="td">{{ fmtLat(v.id) }}</td>
                            <td class="td">{{ fmtLng(v.id) }}</td>
                            <td class="td">{{ fmtSpeed(v.id) }}</td>
                            <td class="td">{{ fmtUpdated(v.id) }}</td>
                            <td class="td">
                                <span :class="badge(liveOf(v.id))">{{
                                    isOnline(v.id) ? "Online" : "—"
                                }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Map -->
        <client-only>
            <div
                ref="mapEl"
                class="rounded-2xl overflow-hidden border bg-white"
                style="height: 68vh"
            ></div>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useHead } from "#imports";

/** Lokasi pusat: Pt. Bara Mega Quantum */
const SITE = { lat: -3.8447964, lng: 102.3431685 };
const INITIAL_ZOOM = 14;

// Leaflet via CDN
useHead({
    link: [{ rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" }],
    script: [{ src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", defer: true }],
});

const mapEl = ref<HTMLDivElement | null>(null);
let map: any;
let layerGroup: any;
let timer: any;

// Vehicles
const vehicles = [
    { id: "truck-a", label: "Truck A" },
    { id: "truck-b", label: "Truck B" },
    { id: "truck-c", label: "Truck C" },
];
const selected = ref<string[]>(vehicles.map((v) => v.id));

// UI options
const tracking = ref(false);
const intervalSec = ref(3);
const showTrail = ref(true);
const autoFit = ref(true);
const follow = ref(true);
const TAIL_MAX = 100;

// Live state
type LivePoint = { lat: number; lng: number; speed: number; ts: number };
const live = reactive<Partial<Record<string, LivePoint>>>({});
const markers: Record<string, any> = {};
const polylines: Record<string, any> = {};
const paths: Record<string, [number, number][]> = {};
const cursors: Record<string, { i: number }> = {};

// ===== Sample paths di sekitar SITE =====
paths["truck-a"] = [
    [SITE.lat - 0.004, SITE.lng - 0.006],
    [SITE.lat - 0.003, SITE.lng - 0.003],
    [SITE.lat - 0.001, SITE.lng - 0.001],
    [SITE.lat + 0.001, SITE.lng + 0.001],
    [SITE.lat + 0.002, SITE.lng + 0.003],
];
paths["truck-b"] = [
    [SITE.lat + 0.005, SITE.lng - 0.004],
    [SITE.lat + 0.003, SITE.lng - 0.002],
    [SITE.lat + 0.001, SITE.lng + 0.0],
    [SITE.lat - 0.001, SITE.lng + 0.002],
    [SITE.lat - 0.003, SITE.lng + 0.004],
];
paths["truck-c"] = [
    [SITE.lat - 0.002, SITE.lng + 0.006],
    [SITE.lat - 0.001, SITE.lng + 0.003],
    [SITE.lat + 0.0, SITE.lng + 0.0],
    [SITE.lat + 0.002, SITE.lng - 0.002],
    [SITE.lat + 0.004, SITE.lng - 0.004],
];

function liveOf(id: string) {
    return live[id];
}
function isOnline(id: string) {
    return Boolean(live[id]);
}

// Safe formatters
const fmtLat = (id: string): string => {
    const p = liveOf(id);
    return p ? p.lat.toFixed(5) : "-";
};
const fmtLng = (id: string): string => {
    const p = liveOf(id);
    return p ? p.lng.toFixed(5) : "-";
};
const fmtSpeed = (id: string): string => {
    const p = liveOf(id);
    return p && p.speed != null ? `${p.speed} km/h` : "-";
};
const fmtUpdated = (id: string): string => {
    const p = liveOf(id);
    return p?.ts ? timeAgo(p.ts) : "-";
};

function badge(p?: LivePoint) {
    return p
        ? "inline-flex px-2 py-0.5 rounded-full text-xs border bg-green-50 text-green-700 border-green-200"
        : "inline-flex px-2 py-0.5 rounded-full text-xs border bg-neutral-100 text-neutral-600 border-neutral-200";
}

function timeAgo(ts: number) {
    const diff = Math.max(0, Date.now() - ts);
    const s = Math.round(diff / 1000);
    if (s < 60) return s + "s ago";
    const m = Math.round(s / 60);
    return m + "m ago";
}

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

function addOrUpdate(id: string, p: LivePoint) {
    const L: any = (window as any).L;
    const latlng = [p.lat, p.lng];
    live[id] = p;

    // marker
    if (!markers[id]) {
        markers[id] = L.circleMarker(latlng, {
            radius: 6,
            color: "#dc2626",
            fillColor: "#dc2626",
            fillOpacity: 1,
        }).addTo(layerGroup);
        markers[id].bindTooltip(`${labelFor(id)} — live`);
    } else {
        markers[id].setLatLng(latlng);
    }

    // trail
    if (showTrail.value) {
        if (!polylines[id])
            polylines[id] = L.polyline([latlng], {
                color: colorFor(id),
                weight: 4,
                opacity: 0.9,
            }).addTo(layerGroup);
        else polylines[id].addLatLng(latlng);
        const latlngs = polylines[id].getLatLngs();
        if (latlngs.length > TAIL_MAX)
            polylines[id].setLatLngs(latlngs.slice(latlngs.length - TAIL_MAX));
    } else if (polylines[id]) {
        polylines[id].removeFrom(layerGroup);
        delete polylines[id];
    }
}

function labelFor(id: string) {
    return vehicles.find((v) => v.id === id)?.label || id;
}

function fitAll() {
    const L: any = (window as any).L;
    const bounds = L.latLngBounds([]);
    Object.values(markers).forEach((m: any) => bounds.extend(m.getLatLng()));
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.2));
}

// ---- Live data fetching (simulation) ----
async function fetchLivePositions(ids: string[]): Promise<Record<string, LivePoint>> {
    const now = Date.now();
    const out: Record<string, LivePoint> = {};
    ids.forEach((id) => {
        const path = paths[id] || [[SITE.lat, SITE.lng]]; // fallback di SITE
        if (!cursors[id]) cursors[id] = { i: 0 };
        const i = cursors[id].i;
        const nextI = (i + 1) % path.length;
        const [lat1, lng1] = path[i];
        const [lat2, lng2] = path[nextI];
        const step = 0.25 + Math.random() * 0.5;
        const lat = lat1 + (lat2 - lat1) * step;
        const lng = lng1 + (lng2 - lng1) * step;
        cursors[id].i = nextI;
        const speed = 40 + Math.round(Math.random() * 30);
        out[id] = { lat, lng, speed, ts: now };
    });
    return out;
}

// Polling tick
const tick = async (): Promise<void> => {
    if (!selected.value.length) return;
    const data: Record<string, LivePoint> = await fetchLivePositions(selected.value);
    for (const [vehId, point] of Object.entries(data) as [string, LivePoint][])
        addOrUpdate(vehId, point);
    if (autoFit.value) fitAll();
    if (follow.value && selected.value.length) {
        const firstId = selected.value[0];
        const m = firstId ? markers[firstId] : null;
        if (m) map.panTo(m.getLatLng(), { animate: true });
    }
};

function start() {
    if (tracking.value) return;
    tracking.value = true;
    clearTrails();
    tick();
    timer = setInterval(tick, intervalSec.value * 1000);
}

function stop() {
    tracking.value = false;
    if (timer) clearInterval(timer);
}

function clearTrails() {
    if (layerGroup) layerGroup.clearLayers();
    Object.entries(live).forEach(([id, p]) => {
        if (p) addOrUpdate(id, p);
    });
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
});

onBeforeUnmount(() => stop());
</script>

<style scoped>
.card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition: all 0.2s ease-in-out;
}
.input:focus {
    border-color: #9ca3af;
    box-shadow: 0 0 0 2px rgb(23 23 23 / 0.1);
}
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background-color: #171717;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #ffffff;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-primary:hover {
    background-color: #262626;
}
.btn-primary:disabled {
    opacity: 0.5;
}
.btn-subtle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: #fff;
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-subtle:hover {
    background-color: #fafafa;
}
.btn-subtle:disabled {
    opacity: 0.5;
}
.lbl {
    display: block;
    font-size: 0.875rem;
    color: #404040;
    margin-bottom: 0.25rem;
}
.th {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #404040;
    white-space: nowrap;
}
.td {
    padding: 0.5rem 0.75rem;
    vertical-align: middle;
}
</style>
