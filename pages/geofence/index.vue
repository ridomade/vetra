<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-3 md:p-4">
        <!-- Toolbar -->
        <div class="card p-2 md:p-3 mb-3">
            <div class="flex flex-col md:flex-row gap-2 md:items-center">
                <label class="lbl !mb-0">Choose Address</label>
                <div class="flex-1 flex gap-2">
                    <input
                        v-model="query"
                        type="text"
                        class="input"
                        placeholder="Enter address"
                        @keyup.enter="geocode"
                    />
                    <button class="btn-subtle" @click="geocode">Search</button>
                    <button class="btn-subtle" @click="locate">Use My Location</button>
                </div>

                <div class="flex gap-2 md:ml-auto">
                    <button
                        class="btn-danger"
                        :disabled="!selectedLayer"
                        @click="deleteSelected"
                        title="Delete selected geofence"
                    >
                        Delete Selected Geofence
                    </button>
                    <button class="btn-primary" :disabled="!hasAnyLayer" @click="save">
                        Save Geofence
                    </button>
                </div>
            </div>
            <p v-if="hint" class="text-xs text-neutral-500 mt-2">{{ hint }}</p>
        </div>

        <!-- Map -->
        <client-only>
            <div ref="mapEl" class="map rounded-xl overflow-hidden border bg-white"></div>
        </client-only>

        <!-- Dump (preview) -->
        <div v-if="preview" class="card p-3 mt-3">
            <div class="flex items-center justify-between mb-2">
                <div class="font-medium text-sm">GeoJSON Preview</div>
                <button class="btn-subtle" @click="preview = ''">Close</button>
            </div>
            <pre class="text-xs overflow-auto max-h-[40vh] whitespace-pre-wrap">{{ preview }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useHead } from "#imports";

/** SITE: PT. Bara Mega Quantum */
const SITE = { lat: -3.8447964, lng: 102.3431685, zoom: 13 };

/* Load Leaflet + Leaflet.draw from CDN (tanpa @types) */
useHead({
    link: [
        { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" },
        { rel: "stylesheet", href: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css" },
    ],
    script: [
        { src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", defer: true },
        { src: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js", defer: true },
    ],
});

const mapEl = ref<HTMLDivElement | null>(null);
let map: any;
let drawnItems: any;
let drawControl: any;
let clickHandler: any;
const selectedLayer = ref<any>(null);
const query = ref("");
const hint = ref("Click the shape to select it, then use “Delete Selected Geofence”.");
const preview = ref("");

const hasAnyLayer = computed(() => !!drawnItems && drawnItems.getLayers().length > 0);

function waitForLeaflet(): Promise<void> {
    return new Promise((resolve) => {
        const tick = setInterval(() => {
            if (
                typeof window !== "undefined" &&
                (window as any).L &&
                (window as any).L?.Control?.Draw
            ) {
                clearInterval(tick);
                resolve();
            }
        }, 30);
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
    map.setView([SITE.lat, SITE.lng], SITE.zoom);

    // group & draw tools
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    drawControl = new L.Control.Draw({
        position: "topleft",
        edit: { featureGroup: drawnItems },
        draw: {
            polygon: { allowIntersection: false, showArea: true },
            rectangle: true,
            circle: true,
            polyline: true,
            marker: true,
            circlemarker: false,
        },
    });
    map.addControl(drawControl);

    map.on("draw:created", (e: any) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        attachSelect(layer);
    });
    map.on("draw:edited", () => {
        // keep selection but nothing special needed
    });
    map.on("draw:deleted", () => {
        selectedLayer.value = null;
    });

    // existing layers selection
    clickHandler = (e: any) => {
        // click background -> deselect
        if (selectedLayer.value) {
            setSelected(selectedLayer.value, false);
            selectedLayer.value = null;
        }
    };
    map.on("click", clickHandler);
}

function attachSelect(layer: any) {
    layer.on("click", (ev: any) => {
        ev.originalEvent?.preventDefault?.();
        ev.originalEvent?.stopPropagation?.();
        if (selectedLayer.value && selectedLayer.value !== layer) {
            setSelected(selectedLayer.value, false);
        }
        selectedLayer.value = layer;
        setSelected(layer, true);
    });
}

function setSelected(layer: any, on = true) {
    // visual selection (works for vector layers)
    if (layer.setStyle) {
        layer.setStyle(on ? { color: "#0ea5e9", weight: 3 } : { color: "#3388ff", weight: 2 });
    }
    if (on && layer.bringToFront) layer.bringToFront();
}

function deleteSelected() {
    if (!selectedLayer.value) return;
    drawnItems.removeLayer(selectedLayer.value);
    selectedLayer.value = null;
}

function save() {
    const L: any = (window as any).L;
    const collection: any = { type: "FeatureCollection", features: [] as any[] };

    drawnItems.eachLayer((layer: any) => {
        // polygons/lines/points:
        if (layer.toGeoJSON) {
            const gj = layer.toGeoJSON();
            // Circle is exported as Point; add radius on properties:
            if (layer instanceof L.Circle) {
                gj.properties = {
                    ...(gj.properties || {}),
                    radius: layer.getRadius(),
                    _type: "Circle",
                };
            }
            collection.features.push(gj);
        }
    });

    // TODO: kirim ke backend
    // await $fetch('/api/geofences', { method:'POST', body: collection })
    preview.value = JSON.stringify(collection, null, 2);
}

async function geocode() {
    if (!query.value.trim()) return;
    try {
        const q = encodeURIComponent(query.value.trim());
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}`;
        const res = await fetch(url, { headers: { "Accept-Language": "en" } });
        const data = await res.json();
        if (data?.length) {
            const { lat, lon } = data[0];
            map.setView([+lat, +lon], 16);
        } else {
            hint.value = "Address not found.";
        }
    } catch {
        hint.value = "Geocoding failed.";
    }
}

function locate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            map.setView([pos.coords.latitude, pos.coords.longitude], 16);
        },
        () => (hint.value = "Location permission denied.")
    );
}

onMounted(async () => {
    await waitForLeaflet();
    await initMap();
});

onBeforeUnmount(() => {
    try {
        if (map && clickHandler) map.off("click", clickHandler);
        if (map) map.remove();
    } catch {}
});
</script>

<style scoped>
.map {
    height: calc(100vh - 170px);
}

/* UI */
.card {
    border-radius: 0.75rem; /* rounded-xl */
    border: 1px solid #e5e7eb; /* border neutral-200 */
    background-color: #ffffff; /* bg-white */
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
}

.input {
    width: 100%; /* w-full */
    border-radius: 0.5rem; /* rounded-lg */
    border: 1px solid #e5e7eb; /* border-neutral-200 */
    background-color: #ffffff; /* bg-white */
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    outline: none; /* outline-none */
    transition: all 0.2s ease-in-out; /* transition */
}
.input:focus {
    border-color: #9ca3af; /* focus:border-neutral-400 */
    box-shadow: 0 0 0 2px rgb(23 23 23 / 0.1); /* focus:ring-2 ring-neutral-900/10 */
}

.lbl {
    font-size: 0.875rem; /* text-sm */
    color: #404040; /* text-neutral-700 */
    margin-bottom: 0.5rem; /* mb-2 */
}

/* buttons */
.btn-primary {
    display: inline-flex; /* inline-flex */
    align-items: center; /* items-center */
    justify-content: center; /* justify-center */
    border-radius: 0.5rem; /* rounded-lg */
    background-color: #171717; /* bg-neutral-900 */
    padding: 0.5rem 1rem; /* py-2 px-4 */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    color: #ffffff; /* text-white */
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-primary:hover {
    background-color: #262626;
} /* hover:bg-neutral-800 */
.btn-primary:disabled {
    opacity: 0.5;
} /* disabled:opacity-50 */

.btn-subtle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem; /* rounded-lg */
    border: 1px solid #e5e7eb; /* border */
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    background-color: #ffffff;
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-subtle:hover {
    background-color: #fafafa;
} /* hover:bg-neutral-50 */
.btn-subtle:disabled {
    opacity: 0.5;
} /* disabled:opacity-50 */

.btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem; /* rounded-lg */
    border: 1px solid #fca5a5; /* border-red-300 */
    color: #b91c1c; /* text-red-700 */
    background-color: #fef2f2; /* bg-red-50 */
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-danger:hover {
    background-color: #fee2e2;
} /* hover:bg-red-100 */
.btn-danger:disabled {
    opacity: 0.5;
} /* disabled:opacity-50 */
</style>
