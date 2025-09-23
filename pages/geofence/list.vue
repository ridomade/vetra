<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6 space-y-6">
        <!-- Page header -->
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/dashboard" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Geofence</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Geofence Center</h1>
                <p class="text-sm text-neutral-500">
                    Kelola geofence & pantau eventnya dalam satu halaman.
                </p>
            </div>

            <div class="flex flex-wrap gap-2">
                <NuxtLink to="/geofence">
                    <button class="btn-primary h-9">+ Add Geofence</button></NuxtLink
                >
                <button class="btn-subtle h-9" @click="resetAll()">Reset Filters</button>
            </div>
        </div>

        <!-- ===== Geofence List ===== -->
        <section class="card">
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 md:p-4 border-b bg-neutral-50"
            >
                <div class="flex items-center gap-2">
                    <h2 class="font-medium">Geofences</h2>
                    <span
                        class="px-2 py-0.5 rounded-full text-[11px] bg-neutral-100 text-neutral-700"
                        >{{ filteredFences.length }} total</span
                    >
                </div>

                <div class="flex flex-wrap gap-2">
                    <div class="relative">
                        <input
                            v-model.trim="qFence"
                            type="search"
                            class="input h-9 pl-9 w-[220px] md:w-[260px]"
                            placeholder="Search name, description…"
                        />
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                            >⌕</span
                        >
                    </div>
                    <select v-model="vehicleFilter" class="input h-9 w-[160px]">
                        <option value="all">All Vehicles</option>
                        <option v-for="v in vehicleOptions" :key="v" :value="v">{{ v }}</option>
                    </select>
                </div>
            </div>

            <!-- Table (desktop) -->
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-left border-b bg-white">
                            <th class="th w-16">S.No</th>
                            <th class="th">
                                <button
                                    class="th-btn"
                                    :class="thClassF('name')"
                                    @click="setSortF('name')"
                                >
                                    Name <span class="sort">{{ sortIconF("name") }}</span>
                                </button>
                            </th>
                            <th class="th">Description</th>
                            <th class="th">
                                <button
                                    class="th-btn"
                                    :class="thClassF('vehicles')"
                                    @click="setSortF('vehicles')"
                                >
                                    Vehicles <span class="sort">{{ sortIconF("vehicles") }}</span>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(g, idx) in paginatedFences"
                            :key="g.id"
                            class="border-b last:border-0 hover:bg-neutral-50/70 transition"
                        >
                            <td class="td">{{ (pageF - 1) * perPageF + idx + 1 }}</td>
                            <td class="td font-medium">{{ g.name }}</td>
                            <td class="td text-neutral-600">{{ g.desc }}</td>
                            <td class="td">
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="v in g.vehicles" :key="v" class="chip">{{
                                        v
                                    }}</span>
                                    <span
                                        v-if="g.vehicles.length === 0"
                                        class="text-xs text-neutral-400"
                                        >—</span
                                    >
                                </div>
                            </td>
                        </tr>
                        <tr v-if="paginatedFences.length === 0">
                            <td colspan="4" class="py-8 text-center text-neutral-500">
                                No geofence found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Cards (mobile) -->
            <div class="md:hidden divide-y">
                <div v-for="(g, idx) in paginatedFences" :key="g.id" class="p-4">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-xs text-neutral-500">
                                #{{ (pageF - 1) * perPageF + idx + 1 }}
                            </p>
                            <h3 class="text-base font-semibold">{{ g.name }}</h3>
                            <p class="text-xs text-neutral-500">{{ g.desc }}</p>
                        </div>
                    </div>
                    <div class="mt-3 flex flex-wrap gap-1">
                        <span v-for="v in g.vehicles" :key="v" class="chip">{{ v }}</span>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
                <div class="text-sm text-neutral-500">
                    Showing <span class="font-medium text-neutral-800">{{ startRowF + 1 }}</span
                    >–<span class="font-medium text-neutral-800">{{ endRowF }}</span> of
                    <span class="font-medium text-neutral-800">{{ filteredFences.length }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <select v-model.number="perPageF" class="input h-9 w-[90px]">
                        <option :value="5">5 / page</option>
                        <option :value="10">10 / page</option>
                        <option :value="20">20 / page</option>
                        <option :value="fences.length">All / page</option>
                    </select>
                    <div class="inline-flex rounded-xl border">
                        <button
                            class="px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="pageF === 1"
                            @click="pageF--"
                        >
                            Previous
                        </button>
                        <span class="px-3 py-2 text-sm bg-neutral-900 text-white">{{ pageF }}</span>
                        <button
                            class="px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="pageF >= totalPagesF"
                            @click="pageF++"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== Events ===== -->
        <section class="card">
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 md:p-4 border-b bg-neutral-50"
            >
                <div class="flex items-center gap-2">
                    <h2 class="font-medium">Geofence Events</h2>
                    <span
                        class="px-2 py-0.5 rounded-full text-[11px] bg-neutral-100 text-neutral-700"
                        >{{ filteredEvents.length }} records</span
                    >
                </div>
                <div class="flex flex-wrap gap-2">
                    <div class="relative">
                        <input
                            v-model.trim="qEvent"
                            type="search"
                            class="input h-9 pl-9 w-[220px] md:w-[260px]"
                            placeholder="Search vehicle, geofence…"
                        />
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                            >⌕</span
                        >
                    </div>
                    <select v-model="eventType" class="input h-9 w-[160px]">
                        <option value="all">All Events</option>
                        <option value="enter">Enter</option>
                        <option value="exit">Exit</option>
                    </select>
                    <select v-model="sortByE" class="input h-9 w-[160px]">
                        <option value="time">Sort: Time</option>
                        <option value="vehicleName">Sort: Vehicle</option>
                        <option value="geoName">Sort: Geofence</option>
                        <option value="type">Sort: Event</option>
                    </select>
                </div>
            </div>

            <!-- Table (desktop) -->
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-left border-b bg-white">
                            <th class="th w-16">S.No</th>
                            <th class="th">
                                <button
                                    class="th-btn"
                                    :class="thClassE('vehicleName')"
                                    @click="setSortE('vehicleName')"
                                >
                                    Vehicle <span class="sort">{{ sortIconE("vehicleName") }}</span>
                                </button>
                            </th>
                            <th class="th">
                                <button
                                    class="th-btn"
                                    :class="thClassE('geoName')"
                                    @click="setSortE('geoName')"
                                >
                                    Geofence <span class="sort">{{ sortIconE("geoName") }}</span>
                                </button>
                            </th>
                            <th class="th">
                                <button
                                    class="th-btn"
                                    :class="thClassE('type')"
                                    @click="setSortE('type')"
                                >
                                    Event <span class="sort">{{ sortIconE("type") }}</span>
                                </button>
                            </th>
                            <th class="th w-56">
                                <button
                                    class="th-btn"
                                    :class="thClassE('time')"
                                    @click="setSortE('time')"
                                >
                                    Time <span class="sort">{{ sortIconE("time") }}</span>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(e, idx) in paginatedEvents"
                            :key="e.id"
                            class="border-b last:border-0 hover:bg-neutral-50/70 transition"
                        >
                            <td class="td">{{ (pageE - 1) * perPageE + idx + 1 }}</td>
                            <td class="td font-medium">{{ e.vehicleName }}</td>
                            <td class="td">{{ e.geoName }}</td>
                            <td class="td">
                                <span :class="e.type === 'enter' ? 'chip-green' : 'chip-red'">{{
                                    e.type === "enter" ? "Enter" : "Exit"
                                }}</span>
                            </td>
                            <td class="td font-mono text-xs">{{ e.time }}</td>
                        </tr>
                        <tr v-if="paginatedEvents.length === 0">
                            <td colspan="5" class="py-8 text-center text-neutral-500">
                                No event found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Cards (mobile) -->
            <div class="md:hidden divide-y">
                <div v-for="(e, idx) in paginatedEvents" :key="e.id" class="p-4">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-xs text-neutral-500">
                                #{{ (pageE - 1) * perPageE + idx + 1 }}
                            </p>
                            <h3 class="font-semibold">{{ e.vehicleName }}</h3>
                            <p class="text-xs text-neutral-500">{{ e.geoName }}</p>
                        </div>
                        <span :class="e.type === 'enter' ? 'chip-green' : 'chip-red'">{{
                            e.type === "enter" ? "Enter" : "Exit"
                        }}</span>
                    </div>
                    <p class="mt-2 text-xs font-mono">{{ e.time }}</p>
                </div>
            </div>

            <!-- Pagination -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
                <div class="text-sm text-neutral-500">
                    Showing <span class="font-medium text-neutral-800">{{ startRowE + 1 }}</span
                    >–<span class="font-medium text-neutral-800">{{ endRowE }}</span> of
                    <span class="font-medium text-neutral-800">{{ filteredEvents.length }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <select v-model.number="perPageE" class="input h-9 w-[90px]">
                        <option :value="5">5 / page</option>
                        <option :value="10">10 / page</option>
                        <option :value="20">20 / page</option>
                        <option :value="events.length">All / page</option>
                    </select>
                    <div class="inline-flex rounded-xl border">
                        <button
                            class="px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="pageE === 1"
                            @click="pageE--"
                        >
                            Previous
                        </button>
                        <span class="px-3 py-2 text-sm bg-neutral-900 text-white">{{ pageE }}</span>
                        <button
                            class="px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="pageE >= totalPagesE"
                            @click="pageE++"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Add modal -->
        <transition name="fade">
            <div v-if="openAdd" class="fixed inset-0 z-50">
                <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
                <div
                    class="relative mx-auto my-8 w-[92vw] max-w-xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
                >
                    <div class="flex items-center justify-between border-b px-5 py-4">
                        <h3 class="text-lg font-semibold">Add Geofence</h3>
                        <button class="icon-btn" @click="closeModal">✕</button>
                    </div>
                    <form class="px-5 py-4" @submit.prevent="saveFence()">
                        <div class="grid gap-4">
                            <div>
                                <label class="lbl">Name</label>
                                <input
                                    v-model="form.name"
                                    required
                                    class="input"
                                    placeholder="Geofence name"
                                />
                            </div>
                            <div>
                                <label class="lbl">Description</label>
                                <textarea
                                    v-model="form.desc"
                                    rows="3"
                                    class="input"
                                    placeholder="Description"
                                ></textarea>
                            </div>
                            <div>
                                <label class="lbl">Vehicles (comma separated)</label>
                                <input
                                    v-model="form.vehiclesRaw"
                                    class="input"
                                    placeholder="e.g. Truck A, Dump 02"
                                />
                            </div>
                        </div>
                        <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button type="button" class="btn-subtle" @click="closeModal">
                                Close
                            </button>
                            <button type="submit" class="btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

/* ===== Dummy data ===== */
const fences = ref([
    { id: 1, name: "Pit Alpha", desc: "Area galian utama.", vehicles: ["Truck A", "Truck B"] },
    { id: 2, name: "Workshop", desc: "Perawatan unit.", vehicles: ["Dozer C"] },
    { id: 3, name: "Fuel Station", desc: "Pengisian BBM.", vehicles: ["Pickup D", "Truck A"] },
    { id: 4, name: "Stockpile East", desc: "Penumpukan material timur.", vehicles: [] },
]);

const events = ref([
    {
        id: 101,
        vehicleId: "V-01",
        vehicleName: "Truck A",
        geoName: "Pit Alpha",
        type: "enter",
        time: "2025-09-23 08:01:22",
    },
    {
        id: 102,
        vehicleId: "V-01",
        vehicleName: "Truck A",
        geoName: "Pit Alpha",
        type: "exit",
        time: "2025-09-23 08:37:10",
    },
    {
        id: 103,
        vehicleId: "V-02",
        vehicleName: "Truck B",
        geoName: "Pit Alpha",
        type: "enter",
        time: "2025-09-23 08:10:03",
    },
    {
        id: 104,
        vehicleId: "V-03",
        vehicleName: "Dozer C",
        geoName: "Workshop",
        type: "enter",
        time: "2025-09-23 09:12:44",
    },
    {
        id: 105,
        vehicleId: "V-04",
        vehicleName: "Pickup D",
        geoName: "Fuel Station",
        type: "exit",
        time: "2025-09-23 09:40:11",
    },
]);

/* ===== Filters / search (FENCES) ===== */
const qFence = ref("");
const vehicleFilter = ref("all");
const sortByF = ref("name"); // name | vehicles
const sortDirF = ref("asc");
const pageF = ref(1);
const perPageF = ref(10);

const vehicleOptions = computed(() => {
    const set = new Set();
    fences.value.forEach((f) => f.vehicles.forEach((v) => set.add(v)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const filteredFences = computed(() => {
    const term = qFence.value.toLowerCase();
    const vf = vehicleFilter.value;
    return fences.value.filter((f) => {
        const q =
            !term ||
            f.name.toLowerCase().includes(term) ||
            f.desc.toLowerCase().includes(term) ||
            f.vehicles.some((v) => v.toLowerCase().includes(term));
        const byVehicle = vf === "all" ? true : f.vehicles.includes(vf);
        return q && byVehicle;
    });
});

const sortedFences = computed(() => {
    const arr = [...filteredFences.value];
    const dir = sortDirF.value === "asc" ? 1 : -1;
    const key = sortByF.value;
    return arr.sort((a, b) => {
        const av = key === "name" ? a.name : a.vehicles.length;
        const bv = key === "name" ? b.name : b.vehicles.length;
        if (typeof av === "string") return av.localeCompare(bv) * dir;
        return (av - bv) * dir;
    });
});

const totalPagesF = computed(() =>
    Math.max(1, Math.ceil(sortedFences.value.length / perPageF.value))
);
const paginatedFences = computed(() => {
    if (pageF.value > totalPagesF.value) pageF.value = totalPagesF.value;
    const start = (pageF.value - 1) * perPageF.value;
    return sortedFences.value.slice(start, start + perPageF.value);
});
const startRowF = computed(() =>
    Math.min((pageF.value - 1) * perPageF.value, filteredFences.value.length - 1)
);
const endRowF = computed(() => Math.min(pageF.value * perPageF.value, filteredFences.value.length));

function setSortF(key) {
    if (sortByF.value === key) sortDirF.value = sortDirF.value === "asc" ? "desc" : "asc";
    else {
        sortByF.value = key;
        sortDirF.value = "asc";
    }
}
const thClassF = (key) =>
    sortByF.value === key ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900";
const sortIconF = (key) => (sortByF.value !== key ? "" : sortDirF.value === "asc" ? "▲" : "▼");

/* ===== Filters / search (EVENTS) ===== */
const qEvent = ref("");
const eventType = ref("all"); // all | enter | exit
const sortByE = ref("time"); // time | vehicleName | geoName | type
const sortDirE = ref("desc");
const pageE = ref(1);
const perPageE = ref(10);

const filteredEvents = computed(() => {
    const term = qEvent.value.toLowerCase();
    const t = eventType.value;
    return events.value.filter((e) => {
        const q =
            !term ||
            e.vehicleName.toLowerCase().includes(term) ||
            e.geoName.toLowerCase().includes(term);
        const byType = t === "all" ? true : e.type === t;
        return q && byType;
    });
});

const sortedEvents = computed(() => {
    const arr = [...filteredEvents.value];
    const dir = sortDirE.value === "asc" ? 1 : -1;
    const key = sortByE.value;
    return arr.sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (key === "time") return (new Date(av) - new Date(bv)) * dir;
        return String(av).localeCompare(String(bv)) * dir;
    });
});

const totalPagesE = computed(() =>
    Math.max(1, Math.ceil(sortedEvents.value.length / perPageE.value))
);
const paginatedEvents = computed(() => {
    if (pageE.value > totalPagesE.value) pageE.value = totalPagesE.value;
    const start = (pageE.value - 1) * perPageE.value;
    return sortedEvents.value.slice(start, start + perPageE.value);
});
const startRowE = computed(() =>
    Math.min((pageE.value - 1) * perPageE.value, filteredEvents.value.length - 1)
);
const endRowE = computed(() => Math.min(pageE.value * perPageE.value, filteredEvents.value.length));

function setSortE(key) {
    if (sortByE.value === key) sortDirE.value = sortDirE.value === "asc" ? "desc" : "asc";
    else {
        sortByE.value = key;
        sortDirE.value = key === "time" ? "desc" : "asc";
    }
}
const thClassE = (key) =>
    sortByE.value === key ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900";
const sortIconE = (key) => (sortByE.value !== key ? "" : sortDirE.value === "asc" ? "▲" : "▼");

/* ===== Modal add (no row actions) ===== */
const openAdd = ref(false);
const form = ref({ name: "", desc: "", vehiclesRaw: "" });

function closeModal() {
    openAdd.value = false;
    form.value = { name: "", desc: "", vehiclesRaw: "" };
}
function saveFence() {
    const list = form.value.vehiclesRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    fences.value.unshift({
        id: Math.max(0, ...fences.value.map((f) => f.id)) + 1,
        name: form.value.name,
        desc: form.value.desc,
        vehicles: list,
    });
    closeModal();
}

function resetAll() {
    qFence.value = "";
    vehicleFilter.value = "all";
    qEvent.value = "";
    eventType.value = "all";
    sortByF.value = "name";
    sortDirF.value = "asc";
    pageF.value = 1;
    sortByE.value = "time";
    sortDirE.value = "desc";
    pageE.value = 1;
}
</script>

<style scoped>
:root {
    --n50: #fafafa;
    --n100: #f5f5f5;
    --n200: #e5e5e5;
    --n400: #a3a3a3;
    --n700: #404040;
    --n900: #171717;
    --g100: #dcfce7;
    --g700: #15803d;
    --r100: #fee2e2;
    --r700: #b91c1c;
}
.card {
    border-radius: 16px;
    border: 1px solid var(--n200);
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}
.th {
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 600;
    color: var(--n700);
    white-space: nowrap;
    text-align: left;
}
.td {
    padding: 12px 16px;
    vertical-align: middle;
}
.input {
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--n200);
    background: #fff;
    padding: 8px 12px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.input:focus {
    border-color: var(--n400);
    box-shadow: 0 0 0 4px rgba(23, 23, 23, 0.1);
}
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 12px;
    background: #feffff;
    color: #000000;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}
.btn-primary:hover {
    background: #000000;
    color: #ffffff;
}
.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.btn-subtle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--n200);
    border-radius: 12px;
    background: #fff;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}
.btn-subtle:hover {
    background: var(--n100);
}
.icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: #374151;
    background: transparent;
    border: none;
    cursor: pointer;
}
.icon-btn:hover {
    background: var(--n100);
}
.icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
}
.th-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.sort {
    font-size: 10px;
    color: var(--n400);
}
.lbl {
    display: block;
    font-size: 14px;
    color: var(--n700);
    margin-bottom: 4px;
}
.chip {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    background: var(--n100);
    color: var(--n700);
    font-size: 11px;
    padding: 0.125rem 0.5rem;
}
.chip-green {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    background: var(--g100);
    color: var(--g700);
    font-size: 11px;
    padding: 0.125rem 0.5rem;
}
.chip-red {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    background: var(--r100);
    color: var(--r700);
    font-size: 11px;
    padding: 0.125rem 0.5rem;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
