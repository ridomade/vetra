<template>
    <div class="page">
        <header class="topbar">
            <h1>Vehicle Live Tracking</h1>
            <p></p>
        </header>

        <div class="layout">
            <ClientOnly>
                <div id="map" ref="mapRef" class="map"></div>
            </ClientOnly>

            <!-- Panel hanya tampilkan daftar kendaraan (tanpa kontrol) -->
            <aside class="panel">
                <ul class="list">
                    <li v-for="v in vehicles" :key="v.id" class="item">
                        <div class="badge" :style="{ background: v.color }"></div>
                        <div class="meta">
                            <div class="name">{{ v.name }}</div>
                            <div class="sub">{{ v.driver }}</div>
                            <div class="sub">
                                {{ v.speedKmh }} km/h · heading {{ Math.round(v.heading) }}°
                            </div>
                            <div class="sub">{{ v.lat.toFixed(5) }}, {{ v.lng.toFixed(5) }}</div>
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

/* Lokasi target */
const SITE = { lat: -3.8447964, lng: 102.3431685 };
const INITIAL_ZOOM = 14;

/* Simulasi berjalan otomatis (tanpa kontrol) */
const mapRef = ref(null);
const vehicles = ref([
    {
        id: "DT-785C",
        name: "Dump Truck CAT 785C",
        driver: "Andi Saputra",
        lat: -3.844, // lokasi fiktif
        lng: 102.3375,
        heading: 30, // arah perjalanan (derajat)
        speedKmh: 25, // kecepatan km/jam
        color: "#2563eb", // biru
    },
    {
        id: "DT-HD7857",
        name: "Dump Truck Komatsu HD785-7",
        driver: "Siti Nurdiana",
        lat: -3.8465,
        lng: 102.345,
        heading: 115,
        speedKmh: 22,
        color: "#16a34a", // hijau
    },
    {
        id: "DT-EH5000",
        name: "Dump Truck Hitachi EH5000AC-3",
        driver: "Budi Santoso",
        lat: -3.8425,
        lng: 102.349,
        heading: 295,
        speedKmh: 30,
        color: "#ca8a04", // kuning
    },
]);

let L; // Leaflet namespace
let map; // Leaflet map instance
let timerId; // interval id
const tickMs = 500; // interval update posisi
const SIM_SPEED = 1; // kecepatan simulasi tetap (tidak bisa diubah)
const markers = new Map(); // id -> marker
const trails = new Map(); // id -> polyline

// Area simulasi (≈ ±6 km)
const BBOX_PAD = 0.06;
const bbox = {
    minLat: SITE.lat - BBOX_PAD,
    maxLat: SITE.lat + BBOX_PAD,
    minLng: SITE.lng - BBOX_PAD,
    maxLng: SITE.lng + BBOX_PAD,
};

onMounted(async () => {
    const leaflet = await import("leaflet");
    L = leaflet.default ?? leaflet;

    // Init map
    map = L.map(mapRef.value, { preferCanvas: true, zoomControl: true });
    map.setView([SITE.lat, SITE.lng], INITIAL_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
    }).addTo(map);

    // Markers & trails
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

    // Mulai simulasi (tanpa kontrol)
    timerId = setInterval(tick, tickMs);
});

onBeforeUnmount(() => {
    clearInterval(timerId);
    timerId = null;
});

function tick() {
    const hours = (tickMs / 3600000) * SIM_SPEED;
    for (const v of vehicles.value) {
        advancePosition(v, hours);

        // Update marker
        const m = markers.get(v.id);
        if (m) {
            m.setLatLng([v.lat, v.lng]);
            m.setIcon(makeArrowIcon(v.color, v.heading));
        }
        // Update jejak
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
    const distanceM = v.speedKmh * 1000 * hours;
    const rad = (v.heading * Math.PI) / 180;
    const dNorth = Math.cos(rad) * distanceM;
    const dEast = Math.sin(rad) * distanceM;

    const metersPerDegLat = 111_320;
    const metersPerDegLng = 111_320 * Math.cos((v.lat * Math.PI) / 180);

    v.lat += dNorth / metersPerDegLat;
    v.lng += dEast / metersPerDegLng;

    // Pantulkan jika keluar area
    if (v.lat < bbox.minLat || v.lat > bbox.maxLat || v.lng < bbox.minLng || v.lng > bbox.maxLng) {
        v.heading = (v.heading + 180) % 360;
    }
}

function makeArrowIcon(color, deg) {
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
    background: #0f172a;
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

/* List kendaraan (read-only) */
.list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: auto;
}
.item {
    display: grid;
    grid-template-columns: 14px 1fr; /* tanpa kolom tombol */
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
