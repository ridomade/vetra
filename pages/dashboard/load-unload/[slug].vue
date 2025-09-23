<template>
    <div class="min-h-[100dvh] bg-gradient-to-b from-neutral-50 to-neutral-100 p-4 md:p-6">
        <div class="mx-auto max-w-5xl space-y-4">
            <!-- Breadcrumb + Back -->
            <div class="flex items-center justify-between gap-3">
                <nav class="text-sm text-neutral-500">
                    <NuxtLink to="/dashboard" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Load &amp; Unload Detail</span>
                </nav>
                <NuxtLink
                    to="/dashboard"
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
                            Driver: <span class="text-neutral-800">{{ meta.driver }}</span>
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
                        *Garis menampilkan <strong>Loads</strong> dan <strong>Unloads</strong> per
                        waktu. Data dummy bersifat simulasi.
                    </p>
                </div>
            </section>

            <!-- Ringkasan -->
            <section class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="rounded-2xl border bg-white shadow-sm p-4">
                    <p class="text-xs text-neutral-500">Total Loads</p>
                    <p class="text-lg font-semibold">{{ sumLoads }}</p>
                </div>
                <div class="rounded-2xl border bg-white shadow-sm p-4">
                    <p class="text-xs text-neutral-500">Total Unloads</p>
                    <p class="text-lg font-semibold">{{ sumUnloads }}</p>
                </div>
                <div class="rounded-2xl border bg-white shadow-sm p-4">
                    <p class="text-xs text-neutral-500">Rata-rata Backlog</p>
                    <p class="text-lg font-semibold">{{ avgBacklog }}</p>
                </div>
                <div class="rounded-2xl border bg-white shadow-sm p-4">
                    <p class="text-xs text-neutral-500">% Completion (rata-rata)</p>
                    <p class="text-lg font-semibold">{{ avgCompletion.toFixed(1) }}%</p>
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

/** Master dummy: sinkron dengan dashboard utama */
const master = [
    { name: "Truck A", driver: "Budi" },
    { name: "Truck B", driver: "Andi" },
    { name: "Excavator C", driver: "Susi" },
    { name: "Dozer D", driver: "Rina" },
    { name: "Pickup E", driver: "Joko" },
];
const toSlug = (s) =>
    s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
const meta = computed(() => {
    const found = master.find((m) => toSlug(m.name) === slug.value);
    if (!found) {
        router.replace("/dashboard");
        return { name: "-", driver: "-" };
    }
    return found;
});

/** Rentang waktu */
const range = ref("12h");

/** Generator data dummy deterministik berdasar slug + range */
function genLoadUnload(slug, rangeKey) {
    const labels = [];
    const loads = [];
    const unloads = [];

    // seed sederhana
    let seed = Array.from(slug).reduce((s, ch) => s + ch.charCodeAt(0), 0);

    const pushPoint = (label) => {
        seed = (seed * 9301 + 49297) % 233280;
        const r01 = seed / 233280;

        // Loads antara 6..18, Unloads <= Loads ± variasi, tetap non-negatif
        const L = Math.max(0, Math.round(6 + 12 * r01));
        const U = Math.max(0, Math.min(L, Math.round(L * (0.6 + 0.35 * (1 - r01)))));

        loads.push(L);
        unloads.push(U);
        labels.push(label);
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
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            pushPoint(d.toLocaleDateString([], { day: "2-digit", month: "2-digit" }));
        }
    }
    return { labels, loads, unloads };
}

const series = computed(() => genLoadUnload(slug.value, range.value));

/** Ringkasan */
const sum = (a) => a.reduce((s, v) => s + v, 0);
const sumLoads = computed(() => sum(series.value.loads));
const sumUnloads = computed(() => sum(series.value.unloads));
const avgBacklog = computed(() => {
    const n = series.value.loads.length || 1;
    const total = series.value.loads
        .map((v, i) => v - series.value.unloads[i])
        .reduce((s, v) => s + v, 0);
    return Math.round(total / n);
});
const avgCompletion = computed(() => {
    const n = series.value.loads.length || 1;
    const total = series.value.loads
        .map((v, i) => {
            const l = v || 0;
            const u = series.value.unloads[i] || 0;
            return l ? (u / l) * 100 : 0;
        })
        .reduce((s, v) => s + v, 0);
    return total / n;
});

/** Chart.js */
const chartEl = ref(null);
let chart = null;
let resizeHandler = null;

function buildChart() {
    const ctx = chartEl.value.getContext("2d");
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: series.value.labels,
            datasets: [
                {
                    label: "Loads (count)",
                    data: series.value.loads,
                    borderColor: "rgba(59,130,246,0.95)", // blue-500
                    backgroundColor: "rgba(59,130,246,0.10)",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 2,
                    fill: true,
                    order: 1,
                },
                {
                    label: "Unloads (count)",
                    data: series.value.unloads,
                    borderColor: "rgba(16,185,129,0.95)", // emerald-500
                    backgroundColor: "rgba(16,185,129,0.10)",
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
                        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
                    },
                },
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    suggestedMax: 20,
                    title: { display: true, text: "Count" },
                    grid: { color: "rgba(0,0,0,0.05)" },
                },
            },
        },
    });
}

function renewChart() {
    if (!chartEl.value) return;
    if (chart) chart.destroy();
    buildChart();
}

onMounted(() => {
    buildChart();
    resizeHandler = () => chart?.resize();
    window.addEventListener("resize", resizeHandler, { passive: true });
});
watch([series], () => renewChart(), { deep: true });
watch(range, () => renewChart());
onBeforeUnmount(() => {
    if (chart) chart.destroy();
    if (resizeHandler) window.removeEventListener("resize", resizeHandler);
});
</script>
