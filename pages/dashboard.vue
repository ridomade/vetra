<template>
    <div class="p-4 space-y-4">
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-semibold">Fuel Dashboard</h1>
            <div class="text-sm text-neutral-500">Dummy data (editable di script)</div>
        </div>

        <div class="bg-white rounded-xl shadow border p-4">
            <h2 class="font-medium mb-2">Fuel Filled vs Remaining per Vehicle</h2>
            <div class="w-full overflow-x-auto">
                <div class="min-w-[600px]">
                    <canvas ref="chartEl" height="120"></canvas>
                </div>
            </div>
            <div class="mt-2 text-xs text-neutral-500">
                *Total bar per vehicle = capacity (filled + remaining).
            </div>
        </div>

        <!-- Tabel ringkas (opsional) -->
        <div class="bg-white rounded-xl shadow border p-4">
            <h3 class="font-medium mb-2">Ringkasan</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-left border-b">
                            <th class="py-2 pr-4">Vehicle</th>
                            <th class="py-2 pr-4">Capacity (L)</th>
                            <th class="py-2 pr-4">Filled (L)</th>
                            <th class="py-2 pr-4">Remaining (L)</th>
                            <th class="py-2 pr-4">Utilization</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="v in vehiclesComputed"
                            :key="v.name"
                            class="border-b last:border-0"
                        >
                            <td class="py-2 pr-4">{{ v.name }}</td>
                            <td class="py-2 pr-4">{{ v.capacity }}</td>
                            <td class="py-2 pr-4">{{ v.filled }}</td>
                            <td class="py-2 pr-4">{{ v.remaining }}</td>
                            <td class="py-2 pr-4">
                                {{ ((v.filled / v.capacity) * 100).toFixed(1) }}%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import Chart from "chart.js/auto";

// Dummy data
const vehicles = ref([
    { name: "Truck A", capacity: 200, filled: 120 },
    { name: "Truck B", capacity: 250, filled: 80 },
    { name: "Excavator C", capacity: 180, filled: 150 },
    { name: "Dozer D", capacity: 220, filled: 60 },
    { name: "Pickup E", capacity: 120, filled: 90 },
]);

// Hitung remaining dan sangga agar tidak negatif
const vehiclesComputed = computed(() =>
    vehicles.value.map((v) => {
        const filled = Math.min(v.filled, v.capacity);
        const remaining = Math.max(v.capacity - filled, 0);
        return { ...v, filled, remaining };
    })
);

const chartEl = ref(null);
let chartInstance = null;

onMounted(() => {
    const ctx = chartEl.value.getContext("2d");

    const labels = vehiclesComputed.value.map((v) => v.name);
    const filledData = vehiclesComputed.value.map((v) => v.filled);
    const remainingData = vehiclesComputed.value.map((v) => v.remaining);

    const maxCapacity = Math.max(...vehiclesComputed.value.map((v) => v.capacity)) || 100;

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                // 1) Remaining dulu (biru) agar berada di bawah
                {
                    label: "Remaining (L)",
                    data: remainingData,
                    backgroundColor: "rgba(59, 130, 246, 0.6)", // biru
                    stack: "fuel",
                },
                // 2) Filled kemudian (kuning) agar menumpuk di atas
                {
                    label: "Filled (L)",
                    data: filledData,
                    backgroundColor: "rgba(234, 179, 8, 0.6)", // kuning
                    stack: "fuel",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                        footer: (items) => {
                            const total = items.reduce((acc, it) => acc + it.parsed.y, 0);
                            return `Total: ${total} L`;
                        },
                    },
                },
                legend: { position: "top" },
            },
            scales: {
                x: { stacked: true, ticks: { maxRotation: 0, autoSkip: false } },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    suggestedMax: Math.ceil(maxCapacity * 1.1),
                    title: { display: true, text: "Liter" },
                },
            },
        },
    });
});

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
});
</script>
