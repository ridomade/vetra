<!-- File: pages/fuel.vue (Nuxt 3) -->
<template>
    <div
        class="p-4 md:p-6 space-y-6 bg-gradient-to-b from-neutral-50 to-neutral-100 min-h-[calc(100dvh-4rem)]"
    >
        <!-- Header + Controls -->
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">Fuel Dashboard</h1>
                <p v-if="selectedCustomerId !== 'all'" class="text-xs text-neutral-500 mt-1">
                    Customer: <span class="font-medium">{{ currentCustomerName }}</span>
                </p>
            </div>

            <div class="flex flex-wrap gap-2">
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

                <select
                    v-model="sortBy"
                    class="px-3 py-1.5 text-sm rounded-xl border bg-white shadow-sm"
                    title="Sort by column"
                >
                    <option value="name">Sort: Name</option>
                    <option value="driver">Sort: Driver</option>
                    <option value="tripFuel">Sort: Trip Fuel</option>
                    <option value="price">Sort: Price</option>
                </select>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-2">
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Total Trip Fuel</p>
                <p class="text-xl font-semibold">{{ totalTripFuel }} L</p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Total Price</p>
                <p class="text-xl font-semibold">{{ formatIDR(totalPrice) }}</p>
            </div>
        </div>

        <!-- Chart -->
        <div class="rounded-2xl border shadow-sm bg-white overflow-hidden">
            <div class="flex items-center justify-between px-4 py-3 border-b bg-neutral-50">
                <div class="flex items-center gap-2">
                    <span class="inline-flex h-2 w-2 rounded-full bg-neutral-400"></span>
                    <h2 class="font-medium md:text-lg text-sm">Trip Fuel vs Price per Vehicle</h2>
                </div>
                <div class="flex items-center gap-3 md:text-xs text-[10px]">
                    <span class="inline-flex items-center gap-1">
                        <span
                            class="inline-block md:h-2.5 md:w-2.5 h-1 w-1 rounded bg-blue-500/80"
                        ></span>
                        Trip Fuel (L)
                    </span>
                    <span class="inline-flex items-center gap-1">
                        <span
                            class="inline-block md:h-2.5 md:w-2.5 h-1 w-1 rounded bg-neutral-400"
                        ></span>
                        Price (IDR)
                    </span>
                </div>
            </div>

            <div class="p-4">
                <div class="w-full overflow-x-auto">
                    <div class="min-w-0 md:min-w-[720px]">
                        <div class="h-[240px] sm:h-[300px] md:h-[360px]">
                            <canvas ref="chartEl"></canvas>
                        </div>
                    </div>
                </div>
                <p class="mt-2 text-xs text-neutral-500">
                    *Price dihitung dari <strong>Trip Fuel × Price per L</strong>.
                </p>
            </div>
        </div>

        <!-- Table -->
        <div class="rounded-2xl border shadow-sm bg-white overflow-hidden">
            <div class="px-4 py-3 border-b bg-neutral-50">
                <h3 class="font-medium">Ringkasan</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-left border-b bg-white">
                            <th class="py-2 px-4" :aria-sort="ariaSort('name')">
                                <button
                                    @click="setSort('name')"
                                    :class="thClass('name')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Vehicle <span class="text-[10px]">{{ sortIcon("name") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4" :aria-sort="ariaSort('driver')">
                                <button
                                    @click="setSort('driver')"
                                    :class="thClass('driver')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Driver <span class="text-[10px]">{{ sortIcon("driver") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4" :aria-sort="ariaSort('tripFuel')">
                                <button
                                    @click="setSort('tripFuel')"
                                    :class="thClass('tripFuel')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Trip Fuel (L)
                                    <span class="text-[10px]">{{ sortIcon("tripFuel") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4" :aria-sort="ariaSort('price')">
                                <button
                                    @click="setSort('price')"
                                    :class="thClass('price')"
                                    class="inline-flex items-center gap-1"
                                >
                                    Price <span class="text-[10px]">{{ sortIcon("price") }}</span>
                                </button>
                            </th>
                            <th class="py-2 px-4">Customer</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="v in vehiclesSorted"
                            :key="v._key"
                            class="border-b last:border-0 hover:bg-neutral-50/70 transition"
                        >
                            <td class="py-2 px-4 font-medium">{{ v.name }}</td>
                            <td class="py-2 px-4">{{ v.driver }}</td>
                            <td class="py-2 px-4">{{ v.tripFuel }}</td>
                            <td class="py-2 px-4">{{ formatIDR(v.price) }}</td>
                            <td class="py-2 px-4">{{ customerName(v.id_customer) }}</td>
                        </tr>
                        <tr v-if="vehiclesSorted.length === 0">
                            <td colspan="5" class="py-6 text-center text-neutral-500">No data.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";

/* Sumber data */
const { customers, fuelRows } = useFleetDb(); // fuel log (liter & price)
const { schedules } = useScheduleDb(); // master penentu daftar kendaraan/driver/customer

/* Helpers */
const customerName = (id) => customers.value.find((c) => c.id === id)?.name ?? "-";
const customerIdByName = (name) => customers.value.find((c) => c.name === name)?.id ?? null;

const formatIDR = (n) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n ?? 0);

/* Controls */
const sortBy = ref("name");
const sortDir = ref("asc");
const selectedCustomerId = ref("all");

const currentCustomerName = computed(() => {
    if (selectedCustomerId.value === "all") return "All Customers";
    const c = customers.value.find((x) => x.id === Number(selectedCustomerId.value));
    return c?.name ?? "Unknown";
});

const thClass = (key) =>
    (sortBy.value === key ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900") +
    " transition-colors";
const sortIcon = (key) => (sortBy.value !== key ? "" : sortDir.value === "asc" ? "▲" : "▼");
const ariaSort = (key) =>
    sortBy.value === key ? (sortDir.value === "asc" ? "ascending" : "descending") : "none";
const setSort = (key) => {
    if (sortBy.value === key) sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
    else {
        sortBy.value = key;
        sortDir.value = ["name", "driver"].includes(key) ? "asc" : "desc";
    }
};
watch(sortBy, (key) => {
    sortDir.value = ["name", "driver"].includes(key) ? "asc" : "desc";
});

/* ==== MASTER ROWS: berbasis schedule ==== */
/*
  - Ambil semua vehicle yang ada di schedules (apapun statusnya).
  - Resolusi driver & customer dari schedule terakhir (berdasarkan endDate/startDate).
  - Lalu gabungkan fuelLogs per vehicleName utk mengisi tripFuel & price (jika ada).
*/
const scheduleMasterRows = computed(() => {
    const byVeh = new Map();

    // kumpulkan info dasar dari schedules
    for (const s of schedules.value) {
        const key = s.vehicle || "-";
        if (!key) continue;
        const existing = byVeh.get(key) || {
            _key: key,
            name: key,
            driver: s.driver || "-",
            id_customer: customerIdByName(s.customer),
            tripFuel: 0,
            price: 0,
        };
        // prefer data yang paling "baru"
        const score = (r) => Number(new Date(r.endDate || r.startDate || 0));
        const takeNewer = !existing._src || score(s) >= (existing._srcScore || 0);
        if (takeNewer) {
            existing.driver = s.driver || existing.driver || "-";
            existing.id_customer = customerIdByName(s.customer);
            existing._src = "schedule";
            existing._srcScore = score(s);
        }
        byVeh.set(key, existing);
    }

    // tambahkan akumulasi fuel berdasarkan nama kendaraan
    for (const f of fuelRows.value) {
        const key = f.name || "-";
        if (!byVeh.has(key)) continue; // patokan jadwal—hanya yang ada di schedule
        const row = byVeh.get(key);
        row.tripFuel += Number(f.tripFuel || 0);
        row.price += Number(f.price || 0);
    }

    return Array.from(byVeh.values());
});

/* Filter by customer */
const vehiclesFiltered = computed(() => {
    const base = scheduleMasterRows.value;
    if (selectedCustomerId.value === "all") return base;
    const cid = Number(selectedCustomerId.value);
    return base.filter((v) => Number(v.id_customer) === cid);
});

/* Sorting */
const valueByKey = (row, key) => {
    switch (key) {
        case "name":
            return row.name ?? "";
        case "driver":
            return row.driver ?? "";
        case "tripFuel":
            return row.tripFuel ?? 0;
        case "price":
            return row.price ?? 0;
        default:
            return row.name ?? "";
    }
};

const vehiclesSorted = computed(() => {
    const arr = [...vehiclesFiltered.value];
    const key = sortBy.value;
    const dir = sortDir.value === "asc" ? 1 : -1;
    return arr.sort((a, b) => {
        const av = valueByKey(a, key);
        const bv = valueByKey(b, key);
        if (typeof av === "string" || typeof bv === "string") {
            const cmp = String(av).toLowerCase().localeCompare(String(bv).toLowerCase());
            if (cmp !== 0) return cmp * dir;
            return String(a.name).localeCompare(String(b.name)) * dir;
        }
        const numCmp = (av ?? 0) - (bv ?? 0);
        if (numCmp !== 0) return numCmp * dir;
        return String(a.name).localeCompare(String(b.name)) * dir;
    });
});

/* Stats */
const totalTripFuel = computed(() =>
    vehiclesFiltered.value.reduce((s, v) => s + (v.tripFuel || 0), 0)
);
const totalPrice = computed(() => vehiclesFiltered.value.reduce((s, v) => s + (v.price || 0), 0));

/* Chart */
const chartEl = ref(null);
let chartInstance = null;
let resizeHandler = null;

function buildChart() {
    if (!chartEl.value) return;
    const ctx = chartEl.value.getContext("2d");

    const labels = vehiclesSorted.value.map((v) => v.name);
    const tripFuelData = vehiclesSorted.value.map((v) => v.tripFuel);
    const priceData = vehiclesSorted.value.map((v) => v.price);

    const cfg = {
        data: {
            labels,
            datasets: [
                {
                    type: "bar",
                    label: "Trip Fuel (L)",
                    data: tripFuelData,
                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                    borderWidth: 0,
                    borderRadius: { topLeft: 8, topRight: 8 },
                    yAxisID: "yL",
                    order: 2,
                },
                // Jika ingin menjadikan Price sebagai line, aktifkan dataset berikut:
                // {
                //   type: "line",
                //   label: "Price (IDR)",
                //   data: priceData,
                //   yAxisID: "yR",
                //   pointRadius: 2,
                //   tension: 0.25,
                //   borderColor: "rgba(115,115,115,0.9)",
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
                            const row = vehiclesSorted.value[idx];
                            return `${row.name} (Driver: ${row?.driver ?? "-"})`;
                        },
                        label: (ctx) => {
                            const val = ctx.parsed.y ?? 0;
                            return ctx.dataset.label.includes("Price")
                                ? ` ${ctx.dataset.label}: ${formatIDR(val)}`
                                : ` ${ctx.dataset.label}: ${val} L`;
                        },
                    },
                },
            },
            scales: {
                x: { ticks: { maxRotation: 0, autoSkip: true }, grid: { display: false } },
                yL: {
                    position: "left",
                    beginAtZero: true,
                    suggestedMax: Math.ceil(Math.max(...tripFuelData, 100) * 1.1),
                    title: { display: true, text: "Liter" },
                    grid: { color: "rgba(0,0,0,0.05)" },
                },
                yR: {
                    position: "right",
                    beginAtZero: true,
                    suggestedMax: Math.ceil(Math.max(...priceData, 100000) * 1.1),
                    title: { display: true, text: "IDR" },
                    grid: { drawOnChartArea: false },
                    ticks: {
                        callback: (v) =>
                            new Intl.NumberFormat("id-ID", {
                                notation: "compact",
                                maximumFractionDigits: 1,
                            }).format(v),
                    },
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

onMounted(() => {
    buildChart();
    resizeHandler = () => chartInstance?.resize();
    window.addEventListener("resize", resizeHandler, { passive: true });
});
watch([sortBy, sortDir, schedules, fuelRows, selectedCustomerId], () => renewChart(), {
    deep: true,
});
onBeforeUnmount(() => {
    if (chartInstance) chartInstance.destroy();
    if (resizeHandler) window.removeEventListener("resize", resizeHandler);
});
</script>
