<!-- pages/dashboard/fuel/[slug].vue -->
<template>
    <div class="min-h-[100dvh] bg-gradient-to-b from-neutral-50 to-neutral-100 p-4 md:p-6">
        <div class="mx-auto max-w-5xl space-y-4">
            <!-- Breadcrumb + Title -->
            <div class="flex items-center justify-between gap-3">
                <nav class="text-sm text-neutral-500">
                    <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span>Fuel</span>
                </nav>
                <NuxtLink
                    to="/dashboard/fuel"
                    class="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50"
                >
                    ← Kembali
                </NuxtLink>
            </div>

            <!-- Header card -->
            <section class="rounded-2xl border bg-white/90 backdrop-blur shadow-sm overflow-hidden">
                <div
                    class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b bg-neutral-50/60 px-4 py-3 md:px-6"
                >
                    <div>
                        <h1 class="text-xl md:text-2xl font-semibold tracking-tight">
                            {{ meta.name }}
                        </h1>
                        <p class="text-sm text-neutral-500">
                            Driver: <span class="text-neutral-800">{{ meta.driver }}</span> ·
                            Kapasitas: <span class="text-neutral-800">{{ meta.capacity }} L</span>
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <select
                            v-model="range"
                            class="rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                            <option value="12h">12 Jam</option>
                            <option value="24h">24 Jam</option>
                            <option value="7d">7 Hari</option>
                        </select>
                    </div>
                </div>

                <!-- Chart -->
                <div class="p-4 md:p-6">
                    <div class="h-[260px] sm:h-[320px] md:h-[380px]">
                        <canvas ref="chartEl"></canvas>
                    </div>
                    <p class="mt-2 text-xs text-neutral-500">
                        *Garis menampilkan <strong>Remaining (L)</strong> dan
                        <strong>Filled (L)</strong> per waktu. Data dummy bersifat simulasi.
                    </p>
                </div>
            </section>

            <!-- Ringkasan kecil -->
            <section class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="rounded-2xl border bg-white shadow-sm p-4">
                    <p class="text-xs text-neutral-500">Kapasitas</p>
                    <p class="text-lg font-semibold">{{ meta.capacity }} L</p>
                </div>
                <div class="rounded-2xl border bg-white shadow-sm p-4">
                    <p class="text-xs text-neutral-500">Rata-rata Filled</p>
                    <p class="text-lg font-semibold">{{ avgFilled }} L</p>
                </div>
                <div class="rounded-2xl border bg-white shadow-sm p-4">
                    <p class="text-xs text-neutral-500">Rata-rata Remaining</p>
                    <p class="text-lg font-semibold">{{ avgRemaining }} L</p>
                </div>
                <div class="rounded-2xl border bg-white shadow-sm p-4">
                    <p class="text-xs text-neutral-500">% Utilisasi (rata-rata)</p>
                    <p class="text-lg font-semibold">{{ avgUtil.toFixed(1) }}%</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Chart from "chart.js/auto";

const route = useRoute();
const router = useRouter();
const slug = computed(() => String(route.params.slug || ""));

/** Dummy master (sinkron dengan dashboard) */
const master = [
    { name: "Truck A", capacity: 200, driver: "Budi" },
    { name: "Truck B", capacity: 250, driver: "Andi" },
    { name: "Excavator C", capacity: 180, driver: "Susi" },
    { name: "Dozer D", capacity: 220, driver: "Rina" },
    { name: "Pickup E", capacity: 120, driver: "Joko" },
];
const toSlug = (s) =>
    s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
const meta = computed(() => {
    const found = master.find((m) => toSlug(m.name) === slug.value);
    if (!found) {
        // jika slug tak dikenal, balik ke daftar fuel
        router.replace("/");
        return { name: "-", capacity: 0, driver: "-" };
    }
    return found;
});

/** Rentang waktu: 12 jam / 24 jam / 7 hari */
const range = ref("12h");

/** Generator data dummy deterministik berbasis slug + range */
function generateSeries(slug, rangeKey, capacity) {
    const labels = [];
    const filled = [];
    const remaining = [];

    // seed sederhana dari slug
    let seed = Array.from(slug).reduce((s, ch) => s + ch.charCodeAt(0), 0);

    const pushPoint = (date) => {
        // pseudo-random deterministik
        seed = (seed * 9301 + 49297) % 233280;
        const r01 = seed / 233280;

        // variasi nilai
        const baseRemain = Math.round(capacity * (0.35 + 0.4 * r01));
        const baseFilled = Math.round(capacity * (0.15 + 0.2 * (1 - r01)));

        remaining.push(Math.min(capacity, Math.max(0, baseRemain)));
        filled.push(Math.min(capacity, Math.max(0, baseFilled)));
        labels.push(date);
    };

    const now = new Date();

    if (rangeKey === "12h") {
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 60 * 60 * 1000);
            pushPoint(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
    } else if (rangeKey === "24h") {
        for (let i = 23; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 60 * 60 * 1000);
            pushPoint(d.toLocaleTimeString([], { hour: "2-digit" }));
        }
    } else {
        // 7 hari
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            pushPoint(d.toLocaleDateString([], { day: "2-digit", month: "2-digit" }));
        }
    }

    return { labels, filled, remaining };
}

const chartEl = ref(null);
let chart = null;
let resizeHandler = null;

const series = computed(() => generateSeries(slug.value, range.value, meta.value.capacity));

const avg = (arr) => (arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0);
const avgFilled = computed(() => avg(series.value.filled));
const avgRemaining = computed(() => avg(series.value.remaining));
const avgUtil = computed(() => {
    const c = meta.value.capacity || 0;
    if (!c) return 0;
    return (avgFilled.value / c) * 100;
});

function buildChart() {
    const ctx = chartEl.value.getContext("2d");
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: series.value.labels,
            datasets: [
                {
                    label: "Remaining (L)",
                    data: series.value.remaining,
                    borderColor: "rgba(34,197,94,0.9)", // green-500
                    backgroundColor: "rgba(34,197,94,0.08)",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 2,
                    fill: true,
                    order: 1,
                },
                {
                    label: "Filled (L)",
                    data: series.value.filled,
                    borderColor: "rgba(251,191,36,0.95)", // amber-400
                    backgroundColor: "rgba(251,191,36,0.10)",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 2,
                    fill: true,
                    order: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            plugins: {
                legend: { position: "top" },
                tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                        title: (items) => items?.[0]?.label || "",
                        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} L`,
                    },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: Math.ceil((meta.value.capacity || 100) * 1.1),
                    title: { display: true, text: "Liter" },
                    grid: { color: "rgba(0,0,0,0.05)" },
                },
            },
        },
    });
}

function renewChart() {
    if (!chartEl.value) return;
    if (chart) {
        chart.destroy();
        chart = null;
    }
    buildChart();
}

onMounted(() => {
    buildChart();
    resizeHandler = () => chart?.resize();
    window.addEventListener("resize", resizeHandler, { passive: true });
});

watch([series, () => meta.value.capacity], () => renewChart(), { deep: true });
watch(range, () => renewChart());

onBeforeUnmount(() => {
    if (chart) chart.destroy();
    if (resizeHandler) window.removeEventListener("resize", resizeHandler);
});
</script>
