<template>
    <div class="page">
        <header class="topbar">
            <h1>Fleet Simulator – Leaflet + Nuxt 3</h1>
            <p>Dummy data menampilkan beberapa kendaraan yang bergerak di sekitar Bandung.</p>
        </header>

        <div class="layout">
            <ClientOnly>
                <div id="map" ref="mapRef" class="map"></div>
            </ClientOnly>

            <aside class="panel">
                <div class="controls">
                    <button class="btn" @click="toggleRun">
                        {{ running ? "⏸️ Jeda" : "▶️ Lanjut" }}
                    </button>
                    <button class="btn" @click="randomizeHeadings" :disabled="!running">
                        🔀 Acak Arah
                    </button>
                    <button class="btn" @click="resetPositions">♻️ Reset Posisi</button>
                </div>

                <div class="control">
                    <label for="speed"
                        >Kecepatan simulasi: <b>{{ speedMultiplier.toFixed(1) }}×</b></label
                    >
                    <input
                        id="speed"
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        v-model.number="speedMultiplier"
                    />
                </div>

                <ul class="list">
                    <li v-for="v in vehicles" :key="v.id" class="item">
                        <div class="badge" :style="{ background: v.color }"></div>
                        <div class="meta">
                            <div class="name">{{ v.name }}</div>
                            <div class="sub">
                                {{ v.speedKmh }} km/h · heading {{ Math.round(v.heading) }}°
                            </div>
                            <div class="sub">{{ v.lat.toFixed(5) }}, {{ v.lng.toFixed(5) }}</div>
                        </div>
                        <div class="actions">
                            <button class="mini" @click="focusVehicle(v.id)">🎯 Fokus</button>
                        </div>
                    </li>
                </ul>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import "leaflet/dist/leaflet.css";

// --- State dasar ---
const running = ref(true);
const speedMultiplier = ref(1);
const mapRef = ref(null);

// Dummy kendaraan di sekitar Bandung
const vehicles = ref([
    {
        id: "A",
        name: "Truck A",
        lat: -6.903,
        lng: 107.611,
        heading: 25,
        speedKmh: 28,
        color: "#2563eb",
    },
    {
        id: "B",
        name: "Excavator B",
        lat: -6.915,
        lng: 107.615,
        heading: 110,
        speedKmh: 18,
        color: "#16a34a",
    },
    {
        id: "C",
        name: "Dozer C",
        lat: -6.91,
        lng: 107.63,
        heading: 320,
        speedKmh: 22,
        color: "#ca8a04",
    },
    {
        id: "D",
        name: "Pickup D",
        lat: -6.897,
        lng: 107.622,
        heading: 200,
        speedKmh: 40,
        color: "#ef4444",
    },
    {
        id: "E",
        name: "Loader E",
        lat: -6.907,
        lng: 107.602,
        heading: 70,
        speedKmh: 26,
        color: "#9333ea",
    },
]);

let L; // namespace Leaflet (diinisialisasi saat client)
let map;
let timerId;
const tickMs = 500; // interval update posisi (ms)
const markers = new Map(); // id -> marker
const trails = new Map(); // id -> polyline

// Area simulasi (BBox Bandung kira-kira)
const bbox = {
    minLat: -6.96,
    maxLat: -6.86,
    minLng: 107.55,
    maxLng: 107.68,
};

onMounted(async () => {
    // Import dinamis agar aman untuk SSR
    const leaflet = await import("leaflet");
    L = leaflet;

    // Inisialisasi map
    map = L.map(mapRef.value, { preferCanvas: true, zoomControl: true });
    map.setView([-6.905, 107.613], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
    }).addTo(map);

    // Tambah marker & trail untuk setiap kendaraan
    for (const v of vehicles.value) {
        const marker = L.marker([v.lat, v.lng], { icon: makeArrowIcon(v.color, v.heading) });
        marker.addTo(map);
        markers.set(v.id, marker);

        const trail = L.polyline([[v.lat, v.lng]], {
            weight: 2,
            opacity: 0.7,
            dashArray: "4,4",
            color: v.color,
        });
        trail.addTo(map);
        trails.set(v.id, trail);
    }

    // Mulai loop simulasi
    start();
});

onBeforeUnmount(() => stop());

function start() {
    if (timerId) return;
    timerId = setInterval(tick, tickMs);
}

function stop() {
    clearInterval(timerId);
    timerId = null;
}

function toggleRun() {
    running.value = !running.value;
    if (running.value) {
        start();
    } else {
        stop();
    }
}

function randomizeHeadings() {
    for (const v of vehicles.value) v.heading = Math.random() * 360;
}

function resetPositions() {
    // Reset ke posisi awal sederhana (sedikit geser agar terlihat perubahan)
    const base = [
        [-6.903, 107.611],
        [-6.915, 107.615],
        [-6.91, 107.63],
        [-6.897, 107.622],
        [-6.907, 107.602],
    ];
    vehicles.value.forEach((v, i) => {
        v.lat = base[i][0];
        v.lng = base[i][1];
        v.heading = (i * 73) % 360;
    });
}

function focusVehicle(id) {
    const v = vehicles.value.find((x) => x.id === id);
    if (!v || !map) return;
    map.setView([v.lat, v.lng], Math.max(map.getZoom(), 15), { animate: true });
}

function tick() {
    const hours = (tickMs / 3600000) * speedMultiplier.value;
    for (const v of vehicles.value) {
        advancePosition(v, hours);
        // Update marker
        const m = markers.get(v.id);
        if (m) {
            m.setLatLng([v.lat, v.lng]);
            m.setIcon(makeArrowIcon(v.color, v.heading));
        }
        // Update trail (hanya simpan beberapa titik terakhir)
        const t = trails.get(v.id);
        if (t) {
            const latlngs = t.getLatLngs();
            latlngs.push([v.lat, v.lng]);
            if (latlngs.length > 120) latlngs.shift();
            t.setLatLngs(latlngs);
        }
    }
}

function advancePosition(v, hours) {
    // Konversi ke meter
    const distanceM = v.speedKmh * 1000 * hours;
    const rad = (v.heading * Math.PI) / 180;
    const dNorth = Math.cos(rad) * distanceM;
    const dEast = Math.sin(rad) * distanceM;

    const metersPerDegLat = 111_320;
    const metersPerDegLng = 111_320 * Math.cos((v.lat * Math.PI) / 180);

    // Update koordinat
    v.lat += dNorth / metersPerDegLat;
    v.lng += dEast / metersPerDegLng;

    // Jika keluar area, "pantulkan" arah
    if (v.lat < bbox.minLat || v.lat > bbox.maxLat || v.lng < bbox.minLng || v.lng > bbox.maxLng) {
        v.heading = (v.heading + 180) % 360;
    }
}

function makeArrowIcon(color, deg) {
    // Icon berbasis SVG (divIcon) yang bisa diputar tanpa plugin tambahan
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <g transform="rotate(${deg} 12 12)">
        <path d="M12 2l4 8H8l4-8zM10 13h4v9h-4z" fill="${color}"/>
      </g>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  `;
    return L.divIcon({
        html: svg,
        className: "vehicle-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
}
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #f6f7f9;
}
.topbar {
    padding: 1rem 1.25rem;
    background: #0f172a; /* slate-900 */
    color: white;
}
.topbar h1 {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
}
.topbar p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
}

.layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 0.75rem;
    padding: 0.75rem;
}

.map {
    width: 100%;
    height: calc(100vh - 110px);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.panel {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: calc(100vh - 110px);
}

.controls {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}
.btn {
    background: #111827; /* gray-900 */
    color: white;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    cursor: pointer;
}
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.control {
    display: grid;
    gap: 0.25rem;
}

.list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: auto;
}
.item {
    display: grid;
    grid-template-columns: 14px 1fr auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.4rem;
    border-radius: 8px;
}
.item:hover {
    background: #f3f4f6;
}
.badge {
    width: 14px;
    height: 14px;
    border-radius: 999px;
}
.meta .name {
    font-weight: 600;
    font-size: 0.95rem;
}
.meta .sub {
    font-size: 0.8rem;
    color: #6b7280;
}
.mini {
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    background: #e5e7eb;
    border: none;
    cursor: pointer;
}

.hint {
    font-size: 0.9rem;
    color: #4b5563;
}
.hint summary {
    cursor: pointer;
}

/* Responsif */
@media (max-width: 1024px) {
    .layout {
        grid-template-columns: 1fr;
    }
    .panel {
        height: auto;
    }
    .map {
        height: 60vh;
    }
}
</style>
