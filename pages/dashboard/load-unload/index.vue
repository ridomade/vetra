<!-- pages/dashboard/load-unload.vue -->
<template>
    <div
        class="p-4 md:p-6 space-y-6 bg-gradient-to-b from-neutral-50 to-neutral-100 min-h-[calc(100dvh-4rem)]"
    >
        <!-- Header + Controls -->
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">Load/Unload Dashboard</h1>
            </div>

            <div class="flex flex-wrap gap-2">
                <!-- Customer Filter -->
                <select
                    v-model="selectedCustomerId"
                    class="px-3 py-1.5 text-sm rounded-xl border bg-white shadow-sm"
                    title="Filter by customer"
                >
                    <option value="all">All Customers</option>
                    <option v-for="c in customers" :key="c.id" :value="c.id" :title="c.address">
                        {{ c.name }}
                    </option>
                </select>

                <div class="inline-flex rounded-xl border bg-white shadow-sm overflow-hidden">
                    <button
                        class="px-3 py-1.5 text-sm transition"
                        :class="showPercent ? 'text-neutral-500' : 'bg-neutral-900 text-white'"
                        @click="showPercent = false"
                    >
                        Count
                    </button>
                </div>

                <select
                    v-model="sortBy"
                    class="px-3 py-1.5 text-sm rounded-xl border bg-white shadow-sm"
                    title="Sort by column"
                >
                    <option value="name">Sort: Name</option>
                    <option value="driver">Sort: Driver</option>
                    <option value="loads">Sort: Loads</option>
                    <option value="unloads">Sort: Unloads</option>
                    <option value="backlog">Sort: Backlog</option>
                    <option value="completion">Sort: Completion</option>
                </select>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Total Vehicle</p>
                <p class="text-xl font-semibold">{{ statTotalVehicle }}</p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Total Loads (Kg)</p>
                <p class="text-xl font-semibold">{{ statTotalLoads }}</p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Total Unloads (Kg)</p>
                <p class="text-xl font-semibold">{{ statTotalUnloads }}</p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Avg Completion</p>
                <p class="text-xl font-semibold">{{ statAvgCompletion.toFixed(1) }}%</p>
            </div>
        </div>

        <!-- Chart Card -->
        <div class="rounded-2xl border shadow-sm bg-white overflow-hidden">
            <div class="flex items-center justify-between px-4 py-3 border-b bg-neutral-50">
                <div class="flex items-center gap-2">
                    <span class="inline-flex h-2 w-2 rounded-full bg-neutral-400"></span>
                    <h2 class="font-medium">Loads vs Unloads per Vehicle</h2>
                </div>
                <div class="flex items-center gap-3 text-xs">
                    <span class="inline-flex items-center gap-1">
                        <span class="inline-block h-2.5 w-2.5 rounded bg-blue-500/70"></span>
                        Loads
                    </span>
                    <span class="inline-flex items-center gap-1">
                        <span class="inline-block h-2.5 w-2.5 rounded bg-green-500/80"></span>
                        Unloads
                    </span>
                    <span class="inline-flex items-center gap-1">
                        <span class="inline-block h-2.5 w-2.5 rounded bg-amber-400/80"></span>
                        Completion % (line)
                    </span>
                </div>
            </div>

            <div class="p-4">
                <div class="w-full">
                    <div class="h-[240px] sm:h-[300px] md:h-[360px]">
                        <canvas ref="chartEl"></canvas>
                    </div>
                </div>
                <p class="mt-2 text-xs text-neutral-500">
                    *Grafik menampilkan jumlah <strong>load</strong> dan <strong>unload</strong> per
                    kendaraan. Completion % dihitung sebagai <em>unload ÷ load</em>.
                </p>
            </div>
        </div>

        <!-- Table (Desktop) -->
        <div class="rounded-2xl border shadow-sm bg-white overflow-hidden">
            <div class="px-4 py-3 border-b bg-neutral-50">
                <h3 class="font-medium">Ringkasan</h3>
                <p class="text-xs text-neutral-500 mt-1" v-if="selectedCustomerId !== 'all'">
                    Customer: <span class="font-medium">{{ currentCustomerName }}</span>
                </p>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-left border-b bg-white">
                            <th class="py-2 px-4">
                                <button
                                    @click="setSort('name')"
                                    :class="thClass('name')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Vehicle <span class="text-[10px]">{{ sortIcon("name") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4">
                                <button
                                    @click="setSort('driver')"
                                    :class="thClass('driver')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Driver <span class="text-[10px]">{{ sortIcon("driver") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4">
                                <button
                                    @click="setSort('loads')"
                                    :class="thClass('loads')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Loads (Kg)
                                    <span class="text-[10px]">{{ sortIcon("loads") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4">
                                <button
                                    @click="setSort('unloads')"
                                    :class="thClass('unloads')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Unloads (Kg)
                                    <span class="text-[10px]">{{ sortIcon("unloads") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4">
                                <button
                                    @click="setSort('backlog')"
                                    :class="thClass('backlog')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Backlog (Kg)
                                    <span class="text-[10px]">{{ sortIcon("backlog") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4">
                                <button
                                    @click="setSort('completion')"
                                    :class="thClass('completion')"
                                    class="inline-flex items-center gap-1"
                                >
                                    % Completion
                                    <span class="text-[10px]">{{ sortIcon("completion") }}</span>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="v in rowsSorted"
                            :key="v._key"
                            class="border-b last:border-0 hover:bg-neutral-50/70 transition"
                            @click="goDetail(v)"
                        >
                            <td class="py-2 px-4 font-medium">{{ v.name }}</td>
                            <td class="py-2 px-4">{{ v.driver }}</td>
                            <td class="py-2 px-4">{{ v.loads }}</td>
                            <td class="py-2 px-4">{{ v.unloads }}</td>
                            <td class="py-2 px-4">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                                    :class="
                                        v.backlog >= 5
                                            ? 'bg-red-100 text-red-700'
                                            : v.backlog > 0
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-green-100 text-green-700'
                                    "
                                >
                                    {{ v.backlog }}
                                </span>
                            </td>
                            <td class="py-2 px-4">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                                    :class="
                                        v.completion >= 90
                                            ? 'bg-green-100 text-green-700'
                                            : v.completion >= 70
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                    "
                                >
                                    {{ v.completion.toFixed(1) }}%
                                </span>
                            </td>
                        </tr>
                        <tr v-if="rowsSorted.length === 0">
                            <td colspan="6" class="py-6 text-center text-neutral-500">No data.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import Chart from "chart.js/auto";
import { useRouter } from "vue-router";

const router = useRouter();
const toSlug = (s) =>
    String(s)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
function goDetail(v) {
    router.push(`/dashboard/load-unload/${toSlug(v.name)}`);
}

/* ========= sumber data ========= */
const { customers, loadRows } = useFleetDb(); // angka loads/unloads (bisa 0)
const { schedules } = useScheduleDb(); // master daftar kendaraan/driver/customer dari jadwal

/* Helpers */
const customerIdByName = (name) => customers.value.find((c) => c.name === name)?.id ?? null;

/* Controls */
const showPercent = ref(false);
const sortBy = ref("name");
const sortDir = ref("asc");
const selectedCustomerId = ref("all"); // 'all' | number

/* Customer name active */
const currentCustomerName = computed(() => {
    if (selectedCustomerId.value === "all") return "All Customers";
    const c = customers.value.find((x) => x.id === Number(selectedCustomerId.value));
    return c?.name ?? "Unknown";
});

/* ===== Master rows berbasis Schedule, lalu gabungkan dengan loadRows ===== */
const masterRows = computed(() => {
    const byVeh = new Map();

    // 1) Masukkan semua vehicle yg ada di schedules (jadi pasti muncul di dashboard)
    for (const s of schedules.value) {
        const key = s.vehicle || "-";
        if (!key) continue;

        const existed = byVeh.get(key) || {
            _key: key,
            name: key,
            driver: s.driver || "-",
            id_customer: customerIdByName(s.customer),
            loads: 0,
            unloads: 0,
            backlog: 0,
            completion: 0,
        };

        // preferkan baris schedule yang lebih "baru"
        const score = (r) => Number(new Date(r.endDate || r.startDate || 0));
        const takeNewer = !existed._src || score(s) >= (existed._srcScore || 0);
        if (takeNewer) {
            existed.driver = s.driver || existed.driver || "-";
            existed.id_customer = customerIdByName(s.customer);
            existed._src = "schedule";
            existed._srcScore = score(s);
        }

        byVeh.set(key, existed);
    }

    // 2) Akumulasi load/unload dari composable loadRows berdasarkan nama kendaraan
    for (const r of loadRows.value) {
        const key = r.name || "-";
        if (!byVeh.has(key)) continue; // patokan schedule; kalau belum ada di jadwal, skip
        const row = byVeh.get(key);
        row.loads += Number(r.loads || 0);
        row.unloads += Number(r.unloads || 0);
    }

    // 3) Hitung backlog & completion
    for (const row of byVeh.values()) {
        row.backlog = Math.max(0, (row.loads || 0) - (row.unloads || 0));
        row.completion = (row.loads || 0) > 0 ? ((row.unloads || 0) / (row.loads || 1)) * 100 : 0;
    }

    return Array.from(byVeh.values());
});

/* Filter by customer */
const rowsFiltered = computed(() => {
    if (selectedCustomerId.value === "all") return masterRows.value;
    const cid = Number(selectedCustomerId.value);
    return masterRows.value.filter((r) => Number(r.id_customer) === cid);
});

/* Sorting helpers */
const thClass = (key) =>
    (sortBy.value === key ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900") +
    " transition-colors";
function sortIcon(key) {
    return sortBy.value !== key ? "" : sortDir.value === "asc" ? "▲" : "▼";
}
function setSort(key) {
    if (sortBy.value === key) {
        sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
    } else {
        sortBy.value = key;
        sortDir.value = ["name", "driver"].includes(key) ? "asc" : "desc";
    }
}
function valueByKey(row, key) {
    switch (key) {
        case "name":
            return row.name ?? "";
        case "driver":
            return row.driver ?? "";
        case "loads":
            return row.loads ?? 0;
        case "unloads":
            return row.unloads ?? 0;
        case "backlog":
            return row.backlog ?? 0;
        case "completion":
            return row.completion ?? 0;
        default:
            return row.name ?? "";
    }
}

const rowsSorted = computed(() => {
    const arr = [...rowsFiltered.value];
    const key = sortBy.value;
    const dir = sortDir.value === "asc" ? 1 : -1;
    return arr.sort((a, b) => {
        const av = valueByKey(a, key);
        const bv = valueByKey(b, key);
        if (typeof av === "string" || typeof bv === "string") {
            return String(av).localeCompare(String(bv)) * dir;
        }
        return (av - bv) * dir;
    });
});

/* Stats (respect filter) */
const statTotalVehicle = computed(() => rowsFiltered.value.length);
const statTotalLoads = computed(() => rowsFiltered.value.reduce((s, v) => s + (v.loads || 0), 0));
const statTotalUnloads = computed(() =>
    rowsFiltered.value.reduce((s, v) => s + (v.unloads || 0), 0)
);
const statAvgCompletion = computed(() => {
    const list = rowsFiltered.value;
    return list.length ? list.reduce((s, v) => s + (v.completion || 0), 0) / list.length : 0;
});

/* Chart */
const chartEl = ref(null);
let chartInstance = null;

function buildChart() {
    if (!chartEl.value) return;
    const ctx = chartEl.value.getContext("2d");

    const labels = rowsSorted.value.map((v) => v.name);
    const loadsData = rowsSorted.value.map((v) => v.loads);
    const unloadsData = rowsSorted.value.map((v) => v.unloads);
    const completionData = rowsSorted.value.map((v) => Number(v.completion.toFixed(1)));

    const maxCount = Math.max(...loadsData, ...unloadsData, 10) || 10;

    const cfg = {
        data: {
            labels,
            datasets: [
                {
                    type: "bar",
                    label: "Loads",
                    data: loadsData,
                    backgroundColor: "rgba(59, 130, 246, 0.7)", // blue
                    borderWidth: 0,
                    borderRadius: { topLeft: 8, topRight: 8 },
                    order: 2,
                },
                {
                    type: "bar",
                    label: "Unloads",
                    data: unloadsData,
                    backgroundColor: "rgba(16, 185, 129, 0.8)", // green
                    borderWidth: 0,
                    borderRadius: { topLeft: 8, topRight: 8 },
                    order: 2,
                },
                // Garis completion (opsional aktifkan)
                // {
                //   type: "line",
                //   label: "Completion %",
                //   data: completionData,
                //   yAxisID: "y1",
                //   pointRadius: 2,
                //   tension: 0.25,
                //   borderColor: "rgba(245, 158, 11, 0.9)",
                //   borderWidth: 2,
                //   order: 1,
                // },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                        title: (items) => {
                            const idx = items[0].dataIndex;
                            const row = rowsSorted.value[idx];
                            return `${row.name} (Driver: ${row?.driver ?? "-"})`;
                        },
                        footer: (items) => {
                            const idx = items[0].dataIndex;
                            const row = rowsSorted.value[idx];
                            return `Completion: ${row.completion.toFixed(1)}%`;
                        },
                    },
                },
            },
            scales: {
                x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true } },
                y: {
                    beginAtZero: true,
                    suggestedMax: Math.ceil(maxCount * 1.1),
                    title: { display: true, text: "Count (Kg)" },
                    grid: { color: "rgba(0,0,0,0.05)" },
                },
                y1: {
                    position: "right",
                    beginAtZero: true,
                    suggestedMax: 100,
                    ticks: { callback: (v) => `${v}%` },
                    grid: { drawOnChartArea: false },
                },
            },
        },
    };

    chartInstance = new Chart(ctx, cfg);
}

function renewChart() {
    if (!chartEl.value) return;
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    buildChart();
}

onMounted(() => buildChart());
watch([sortBy, sortDir, selectedCustomerId, schedules, loadRows], () => renewChart(), {
    deep: true,
});
onBeforeUnmount(() => {
    if (chartInstance) chartInstance.destroy();
});
</script>
