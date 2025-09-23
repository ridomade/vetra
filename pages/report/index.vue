<!-- File: pages/reports.vue -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4">
            <nav class="text-sm text-neutral-500 mb-1">
                <NuxtLink to="/" class="hover:underline">Report</NuxtLink>
                <span class="mx-1">/</span>
                <span class="text-neutral-900">Reports</span>
            </nav>
            <h1 class="text-2xl font-semibold tracking-tight">Reports</h1>
            <p class="text-sm text-neutral-500 mt-1">
                Pilih jenis laporan, atur rentang tanggal dan kendaraan, lalu klik <b>Generate</b>.
            </p>
        </div>

        <!-- Tabs -->
        <div class="card p-2 mb-4">
            <div class="tabs">
                <button
                    class="tab"
                    :class="{ 'tab--active': tab === 'schedule' }"
                    @click="switchTab('schedule')"
                >
                    Schedule
                </button>
                <button
                    class="tab"
                    :class="{ 'tab--active': tab === 'load' }"
                    @click="switchTab('load')"
                >
                    Load & Unload
                </button>
                <button
                    class="tab"
                    :class="{ 'tab--active': tab === 'fuel' }"
                    @click="switchTab('fuel')"
                >
                    Fuel
                </button>
            </div>
        </div>

        <!-- Filters + Actions -->
        <div class="card p-3 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div class="md:col-span-3">
                    <label class="lbl">Report From</label>
                    <input type="date" class="input" v-model="filters.from" />
                </div>
                <div class="md:col-span-3">
                    <label class="lbl">Report To</label>
                    <input type="date" class="input" v-model="filters.to" />
                </div>

                <div class="md:col-span-4">
                    <label class="lbl">Vehicle</label>
                    <select class="input" v-model="filters.vehicle">
                        <option value="all">All Vehicle</option>
                        <option v-for="v in vehicles" :key="v.id" :value="v.id">
                            {{ v.label }}
                        </option>
                    </select>
                </div>

                <div class="md:col-span-2 flex gap-2">
                    <button class="btn-primary flex-1" @click="generate" :disabled="loading">
                        {{ loading ? "Generating…" : "Generate Report" }}
                    </button>
                    <button class="btn-subtle" :disabled="!rows.length" @click="exportCSV">
                        Export CSV
                    </button>
                </div>
            </div>

            <p v-if="hint" class="text-xs text-neutral-500 mt-2">{{ hint }}</p>
        </div>

        <!-- Results -->
        <div class="card overflow-hidden">
            <div class="flex items-center justify-between p-3 border-b">
                <div class="text-sm font-medium">
                    {{ titleForTab(tab) }}
                    <span class="text-neutral-500 font-normal" v-if="rows.length">
                        — {{ rows.length }} records
                    </span>
                </div>
                <div class="text-xs text-neutral-500">
                    Periode:
                    <b>{{ filters.from || "—" }}</b>
                    <span class="mx-1">→</span>
                    <b>{{ filters.to || "—" }}</b>
                </div>
            </div>

            <div class="overflow-x-auto">
                <!-- Schedule -->
                <table v-if="tab === 'schedule'" class="w-full text-sm">
                    <thead class="bg-neutral-50 text-left text-neutral-700">
                        <tr>
                            <th class="th">Date</th>
                            <th class="th">Vehicle</th>
                            <th class="th">Customer</th>
                            <th class="th">Driver</th>
                            <th class="th">Type</th>
                            <th class="th text-right">Approx KM</th>
                            <th class="th">Trip Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="r in rows as ScheduleRow[]"
                            :key="r.id"
                            class="hover:bg-neutral-50"
                        >
                            <td class="td">{{ r.date }}</td>
                            <td class="td">{{ r.vehicle }}</td>
                            <td class="td">{{ r.customer }}</td>
                            <td class="td">{{ r.driver }}</td>
                            <td class="td">{{ r.type }}</td>
                            <td class="td text-right">{{ r.approxKm.toLocaleString() }}</td>
                            <td class="td">
                                <span :class="badge(r.status)">{{ r.status }}</span>
                            </td>
                        </tr>
                        <tr v-if="!rows.length">
                            <td class="td text-center text-neutral-500" colspan="7">No data.</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Load & Unload -->
                <table v-else-if="tab === 'load'" class="w-full text-sm">
                    <thead class="bg-neutral-50 text-left text-neutral-700">
                        <tr>
                            <th class="th">Date</th>
                            <th class="th">Vehicle</th>
                            <th class="th">Type</th>
                            <th class="th text-right">Tonnage</th>
                            <th class="th">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in rows as LoadRow[]" :key="r.id" class="hover:bg-neutral-50">
                            <td class="td">{{ r.date }}</td>
                            <td class="td">{{ r.vehicle }}</td>
                            <td class="td">{{ r.type }}</td>
                            <td class="td text-right">{{ r.tonnage.toLocaleString() }}</td>
                            <td class="td">{{ r.description || "—" }}</td>
                        </tr>
                        <tr v-if="!rows.length">
                            <td class="td text-center text-neutral-500" colspan="5">No data.</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Fuel -->
                <table v-else class="w-full text-sm">
                    <thead class="bg-neutral-50 text-left text-neutral-700">
                        <tr>
                            <th class="th">Date</th>
                            <th class="th">Vehicle</th>
                            <th class="th text-right">Qty (L)</th>
                            <th class="th text-right">Total Price</th>
                            <th class="th">Filled By</th>
                            <th class="th text-right">Odometer</th>
                            <th class="th">Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in rows as FuelRow[]" :key="r.id" class="hover:bg-neutral-50">
                            <td class="td">{{ r.date }}</td>
                            <td class="td">{{ r.vehicle }}</td>
                            <td class="td text-right">{{ r.qty }}</td>
                            <td class="td text-right">Rp {{ r.totalPrice.toLocaleString() }}</td>
                            <td class="td">{{ r.filledBy }}</td>
                            <td class="td text-right">{{ r.odometer }}</td>
                            <td class="td">{{ r.comments || "—" }}</td>
                        </tr>
                        <tr v-if="!rows.length">
                            <td class="td text-center text-neutral-500" colspan="7">No data.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

type Tab = "schedule" | "load" | "fuel";

type ScheduleRow = {
    id: string;
    date: string;
    vehicle: string;
    customer: string;
    driver: string;
    type: "Pickup" | "Delivery" | "Transfer";
    approxKm: number;
    status: "Planned" | "Ongoing" | "Done";
};
type LoadRow = {
    id: string;
    date: string;
    vehicle: string;
    type: "Load" | "Unload";
    tonnage: number;
    description?: string;
};
type FuelRow = {
    id: string;
    date: string;
    vehicle: string;
    qty: number;
    totalPrice: number;
    filledBy: string;
    odometer: number;
    comments?: string;
};

const vehicles = [
    { id: "all", label: "All Vehicle" },
    { id: "truck-a", label: "Truck A" },
    { id: "truck-b", label: "Truck B" },
    { id: "truck-c", label: "Truck C" },
];

const tab = ref<Tab>("schedule");
const loading = ref(false);
const rows = ref<Array<ScheduleRow | LoadRow | FuelRow>>([]);
const hint = ref("");

const filters = reactive({
    from: "",
    to: "",
    vehicle: "all",
});

function switchTab(t: Tab) {
    tab.value = t;
    rows.value = [];
    hint.value = "";
}

/* ----- UI helpers ----- */
function titleForTab(t: Tab) {
    if (t === "schedule") return "Schedule Report";
    if (t === "load") return "Load & Unload Report";
    return "Fuel Report";
}
function badge(status: "Planned" | "Ongoing" | "Done") {
    if (status === "Done") return "badge badge--green";
    if (status === "Ongoing") return "badge badge--blue";
    return "badge";
}

/* ----- Generate (dummy). Ganti ke API kamu ----- */
async function generate() {
    loading.value = true;
    rows.value = [];
    hint.value = "";

    // validasi ringan
    if (!filters.from || !filters.to) {
        loading.value = false;
        hint.value = "Pilih tanggal awal dan akhir.";
        return;
    }

    // simulasi fetch
    await new Promise((r) => setTimeout(r, 400));

    if (tab.value === "schedule") rows.value = await fetchScheduleReport();
    else if (tab.value === "load") rows.value = await fetchLoadReport();
    else rows.value = await fetchFuelReport();

    loading.value = false;
}

/* ----- Dummy data builders ----- */
function fetchScheduleReport(): Promise<ScheduleRow[]> {
    const base: ScheduleRow[] = [
        {
            id: "s1",
            date: filters.from,
            vehicle: "Truck A",
            customer: "ACME",
            driver: "Deni",
            type: "Pickup",
            approxKm: 34,
            status: "Planned",
        },
        {
            id: "s2",
            date: filters.to,
            vehicle: "Truck B",
            customer: "Beta",
            driver: "Yudi",
            type: "Delivery",
            approxKm: 81,
            status: "Ongoing",
        },
        {
            id: "s3",
            date: filters.to,
            vehicle: "Truck C",
            customer: "Cargo",
            driver: "Raka",
            type: "Transfer",
            approxKm: 15,
            status: "Done",
        },
    ];
    return Promise.resolve(applyVehicleFilter(base, (r) => r.vehicle));
}
function fetchLoadReport(): Promise<LoadRow[]> {
    const base: LoadRow[] = [
        {
            id: "l1",
            date: filters.from,
            vehicle: "Truck A",
            type: "Load",
            tonnage: 12,
            description: "Coal",
        },
        {
            id: "l2",
            date: filters.to,
            vehicle: "Truck B",
            type: "Unload",
            tonnage: 9,
            description: "Sand",
        },
        { id: "l3", date: filters.to, vehicle: "Truck C", type: "Load", tonnage: 16 },
    ];
    return Promise.resolve(applyVehicleFilter(base, (r) => r.vehicle));
}
function fetchFuelReport(): Promise<FuelRow[]> {
    const base: FuelRow[] = [
        {
            id: "f1",
            date: filters.from,
            vehicle: "Truck A",
            qty: 40,
            totalPrice: 420000,
            filledBy: "Adi",
            odometer: 13450,
            comments: "",
        },
        {
            id: "f2",
            date: filters.to,
            vehicle: "Truck B",
            qty: 55,
            totalPrice: 585000,
            filledBy: "Uus",
            odometer: 23890,
            comments: "BBM subsidized",
        },
        {
            id: "f3",
            date: filters.to,
            vehicle: "Truck C",
            qty: 35,
            totalPrice: 385000,
            filledBy: "Riko",
            odometer: 30900,
        },
    ];
    return Promise.resolve(applyVehicleFilter(base, (r) => r.vehicle));
}

function applyVehicleFilter<T>(data: T[], getVehicle: (r: T) => string): T[] {
    if (filters.vehicle === "all") return data;
    return data.filter((r) =>
        getVehicle(r).toLowerCase().includes(labelFor(filters.vehicle).toLowerCase())
    );
}
function labelFor(id: string) {
    return vehicles.find((v) => v.id === id)?.label || id;
}

/* ----- CSV Export ----- */
function exportCSV() {
    if (!rows.value.length) return;
    const cols = Object.keys(rows.value[0] as any);
    const csv = [
        cols.join(","),
        ...rows.value.map((r: any) =>
            cols.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(",")
        ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${titleForTab(tab.value).replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
</script>

<style scoped>
.card {
    @apply rounded-2xl border bg-white shadow-sm;
}
.input {
    @apply w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition
                 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10;
}
.lbl {
    @apply block text-sm text-neutral-700 mb-1;
}
.btn-primary {
    @apply inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50;
}
.btn-subtle {
    @apply inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50;
}
.th {
    @apply py-2 px-3 text-xs font-semibold text-neutral-700 whitespace-nowrap;
}
.td {
    @apply py-2 px-3 align-middle;
}

/* Tabs */
.tabs {
    @apply flex gap-1;
}
.tab {
    @apply px-3 py-1.5 text-sm rounded-xl border hover:bg-neutral-50;
}
.tab--active {
    @apply bg-neutral-900 text-white border-neutral-900;
}

/* Badges */
.badge {
    @apply inline-flex px-2 py-0.5 rounded-full text-xs border bg-neutral-100 text-neutral-600 border-neutral-200;
}
.badge--green {
    @apply border-green-200 bg-green-50 text-green-700;
}
.badge--blue {
    @apply border-blue-200 bg-blue-50 text-blue-700;
}
</style>
