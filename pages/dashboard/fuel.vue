<template>
    <div
        class="p-4 md:p-6 space-y-6 bg-gradient-to-b from-neutral-50 to-neutral-100 min-h-[calc(100dvh-4rem)]"
    >
        <!-- Header + Controls -->
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">Fuel Dashboard</h1>
                <p class="text-sm text-neutral-500">Dummy data.</p>
            </div>

            <div class="flex flex-wrap gap-2">
                <div class="inline-flex rounded-xl border bg-white shadow-sm overflow-hidden">
                    <button
                        class="px-3 py-1.5 text-sm transition"
                        :class="showPercent ? 'text-neutral-500' : 'bg-neutral-900 text-white'"
                        @click="showPercent = false"
                    >
                        Liter
                    </button>
                </div>

                <select
                    v-model="sortBy"
                    class="px-3 py-1.5 text-sm rounded-xl border bg-white shadow-sm"
                >
                    <option value="name">Sort: Name</option>
                    <option value="capacity">Sort: Capacity</option>
                    <option value="filled">Sort: Filled</option>
                    <option value="remaining">Sort: Remaining</option>
                    <option value="util">Sort: Utilization</option>
                </select>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Total Vehicle</p>
                <p class="text-xl font-semibold">{{ totalVehicle }}</p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Total Filled</p>
                <p class="text-xl font-semibold">{{ totalFilled }} L</p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Total Remaining</p>
                <p class="text-xl font-semibold">{{ totalRemaining }} L</p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-4">
                <p class="text-xs text-neutral-500">Avg Utilization</p>
                <p class="text-xl font-semibold">{{ avgUtil.toFixed(1) }}%</p>
            </div>
        </div>

        <!-- Chart Card -->
        <div class="rounded-2xl border shadow-sm bg-white overflow-hidden">
            <div class="flex items-center justify-between px-4 py-3 border-b bg-neutral-50">
                <div class="flex items-center gap-2">
                    <span class="inline-flex h-2 w-2 rounded-full bg-neutral-400"></span>
                    <h2 class="font-medium">Fuel Filled vs Remaining per Vehicle</h2>
                </div>
                <div class="flex items-center gap-3 text-xs">
                    <span class="inline-flex items-center gap-1">
                        <span class="inline-block h-2.5 w-2.5 rounded bg-red-500/70"></span>
                        Remaining <= 20 L
                    </span>
                    <span class="inline-flex items-center gap-1">
                        <span class="inline-block h-2.5 w-2.5 rounded bg-blue-500/70"></span>
                        Remaining <= 40 L
                    </span>
                    <span class="inline-flex items-center gap-1">
                        <span class="inline-block h-2.5 w-2.5 rounded bg-green-500/70"></span>
                        Remaining > 40 L
                    </span>
                    <span class="inline-flex items-center gap-1">
                        <span class="inline-block h-2.5 w-2.5 rounded bg-amber-400/80"></span>
                        Filled
                    </span>
                </div>
            </div>

            <div class="p-4">
                <div class="w-full overflow-x-auto">
                    <div class="min-w-[720px]">
                        <div class="h-[360px]">
                            <canvas ref="chartEl"></canvas>
                        </div>
                    </div>
                </div>
                <p class="mt-2 text-xs text-neutral-500">
                    *Bar menampilkan <strong>filled</strong> + <strong>remaining</strong>. Pastikan
                    data mematuhi: capacity ≥ filled + remaining.
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
                            <th class="py-2 px-4">Vehicle</th>
                            <th class="py-2 px-4">Capacity (L)</th>
                            <th class="py-2 px-4">Filled (L)</th>
                            <th class="py-2 px-4">% Filled</th>
                            <th class="py-2 px-4">Remaining (L)</th>
                            <th class="py-2 px-4">% Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="v in vehiclesSorted"
                            :key="v.name"
                            class="border-b last:border-0 hover:bg-neutral-50/70 transition"
                        >
                            <td class="py-2 px-4 font-medium">{{ v.name }}</td>
                            <td class="py-2 px-4">{{ v.capacity }}</td>
                            <td class="py-2 px-4">{{ v.filled }}</td>
                            <td class="py-2 px-4">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                                    :class="
                                        v.util >= 75
                                            ? 'bg-green-100 text-green-700'
                                            : v.util >= 50
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                    "
                                >
                                    {{ v.util.toFixed(1) }}%
                                </span>
                            </td>
                            <td class="py-2 px-4">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                                    :class="
                                        v.remaining <= 20
                                            ? 'bg-red-100 text-red-700'
                                            : v.remaining <= 40
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-green-100 text-green-700'
                                    "
                                >
                                    {{ v.remaining }}
                                </span>
                            </td>
                            <td class="py-2 px-4">{{ v.remainingPct.toFixed(1) }}%</td>
                        </tr>
                        <tr v-if="vehiclesSorted.length === 0">
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

/**
 * Dummy Data — SEKARANG remaining berasal dari data (bukan turunan).
 * Pastikan (capacity >= filled + remaining). Jika tidak, remaining akan dipangkas otomatis.
 */
const vehicles = ref([
    { name: "Truck A", capacity: 200, filled: 140, remaining: 40, driver: "Budi" },
    { name: "Truck B", capacity: 250, filled: 180, remaining: 50, driver: "Andi" },
    { name: "Excavator C", capacity: 180, filled: 130, remaining: 40, driver: "Susi" },
    { name: "Dozer D", capacity: 220, filled: 150, remaining: 60, driver: "Rina" },
    { name: "Pickup E", capacity: 120, filled: 80, remaining: 20, driver: "Joko" },
]);

// Controls
const showPercent = ref(false);
const sortBy = ref("name");

// Ambil nilai dari data, lalu sanitasi agar tidak melebihi capacity
const vehiclesComputed = computed(() =>
    vehicles.value.map((v) => {
        const cap = Math.max(0, v.capacity ?? 0);
        let filled = Math.max(0, Math.min(v.filled ?? 0, cap));
        let remaining = Math.max(0, v.remaining ?? 0);

        // Pangkas remaining jika melebihi sisa kapasitas
        if (filled + remaining > cap) {
            remaining = Math.max(0, cap - filled);
        }

        const util = cap > 0 ? (filled / cap) * 100 : 0;
        const remainingPct = cap > 0 ? (remaining / cap) * 100 : 0;

        return { ...v, capacity: cap, filled, remaining, util, remainingPct };
    })
);

// Sorting
const vehiclesSorted = computed(() => {
    const arr = [...vehiclesComputed.value];
    switch (sortBy.value) {
        case "capacity":
            return arr.sort((a, b) => b.capacity - a.capacity);
        case "filled":
            return arr.sort((a, b) => b.filled - a.filled);
        case "remaining":
            return arr.sort((a, b) => b.remaining - a.remaining);
        case "util":
            return arr.sort((a, b) => b.util - a.util);
        default:
            return arr.sort((a, b) => a.name.localeCompare(b.name));
    }
});

// Stats
const totalCapacity = computed(() => vehiclesComputed.value.reduce((s, v) => s + v.capacity, 0));
const totalVehicle = computed(() => vehiclesComputed.value.length);
const totalFilled = computed(() => vehiclesComputed.value.reduce((s, v) => s + v.filled, 0));
const totalRemaining = computed(() => vehiclesComputed.value.reduce((s, v) => s + v.remaining, 0));
const avgUtil = computed(() => {
    const list = vehiclesComputed.value;
    return list.length ? list.reduce((s, v) => s + v.util, 0) / list.length : 0;
});

// Chart
const chartEl = ref(null);
let chartInstance = null;

function buildChart() {
    const ctx = chartEl.value.getContext("2d");

    const labels = vehiclesSorted.value.map((v) => v.name);
    const filledData = vehiclesSorted.value.map((v) => v.filled);
    const remainingData = vehiclesSorted.value.map((v) => v.remaining);

    // Warna remaining berdasarkan persentase sisa
    const remainingColors = vehiclesSorted.value.map((v) => {
        if (v.remaining <= 20) return "rgba(239, 68, 68, 0.85)"; // merah
        if (v.remaining <= 40) return "rgba(59, 130, 246, 0.7)"; // biru
        return "rgba(0, 128, 0, 0.7)"; // hijau
    });

    const maxCapacity = Math.max(...vehiclesSorted.value.map((v) => v.capacity)) || 100;

    const cfg = {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Remaining (L)",
                    data: remainingData,
                    backgroundColor: remainingColors, // kondisi warna per-bar
                    borderWidth: 0,
                    stack: "fuel",
                    borderRadius: 0,
                },
                {
                    label: "Filled (L)",
                    data: filledData,
                    backgroundColor: "rgba(251, 191, 36, 0.85)", // kuning
                    borderWidth: 0,
                    stack: "fuel",
                    borderRadius: { topLeft: 8, topRight: 8 },
                },
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
                            return ` ${ctx.dataset.label}: ${val} L`;
                        },
                        footer: (items) => {
                            const total = items.reduce((acc, it) => acc + (it.parsed.y ?? 0), 0);
                            return `Total: ${total} L`;
                        },
                    },
                },
            },

            scales: {
                x: {
                    stacked: true,
                    ticks: { maxRotation: 0, autoSkip: false },
                    grid: { display: false },
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    suggestedMax: Math.ceil(maxCapacity * 1.1),
                    title: { display: true, text: "Liter" },
                    grid: { color: "rgba(0,0,0,0.05)" },
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
watch([sortBy, vehiclesComputed], () => renewChart(), { deep: true });
onBeforeUnmount(() => {
    if (chartInstance) chartInstance.destroy();
});
</script>
