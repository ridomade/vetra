<!-- File: pages/reminders.vue (Nuxt 3) -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Reminder Info</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Reminder Info</h1>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search…"
                    class="input h-9 w-[220px]"
                />
                <button class="btn-primary h-9" @click="scrollToForm">Add Reminder</button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- Table -->
            <section class="lg:col-span-8 xl:col-span-8 card" aria-label="Reminder list">
                <div class="flex items-center justify-between p-3 border-b bg-neutral-50/60">
                    <h2 class="font-medium">Reminders</h2>
                    <span class="text-xs text-neutral-500"
                        >{{ filteredRows.length }} record(s)</span
                    >
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full w-full text-sm">
                        <thead class="bg-neutral-50 text-left text-neutral-700">
                            <tr>
                                <th class="th w-16">S.No</th>
                                <th class="th cursor-pointer" @click="toggleSort('vehicle')">
                                    Vehicle
                                    <span class="sort" v-if="sort.key === 'vehicle'">{{
                                        sort.dir === "asc" ? "▲" : "▼"
                                    }}</span>
                                </th>
                                <th class="th cursor-pointer" @click="toggleSort('date')">
                                    Date
                                    <span class="sort" v-if="sort.key === 'date'">{{
                                        sort.dir === "asc" ? "▲" : "▼"
                                    }}</span>
                                </th>
                                <th class="th">Message</th>
                                <th class="th text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!filteredRows.length">
                                <td class="td text-center text-neutral-500" colspan="5">
                                    No data available in table
                                </td>
                            </tr>
                            <tr
                                v-for="(row, i) in pageRows"
                                :key="row.id"
                                class="hover:bg-neutral-50"
                            >
                                <td class="td">{{ (page - 1) * pageSize + i + 1 }}</td>
                                <td class="td">{{ row.vehicle }}</td>
                                <td class="td">{{ row.date }}</td>
                                <td class="td max-w-[320px]">
                                    <p class="truncate" :title="row.message">{{ row.message }}</p>
                                </td>
                                <td class="td text-right">
                                    <div class="inline-flex gap-1">
                                        <button class="btn-subtle" @click="editRow(row)">
                                            Edit
                                        </button>
                                        <button class="btn-danger" @click="removeRow(row.id)">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="flex items-center justify-between px-3 py-2 border-t">
                    <div class="text-xs text-neutral-500">
                        Page {{ page }} of
                        {{ Math.max(1, Math.ceil(filteredRows.length / pageSize)) }}
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="btn-subtle" :disabled="page === 1" @click="page--">
                            Previous
                        </button>
                        <button
                            class="btn-subtle"
                            :disabled="page >= Math.ceil(filteredRows.length / pageSize)"
                            @click="page++"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>

            <!-- Form -->
            <section
                ref="formRef"
                class="lg:col-span-4 xl:col-span-4 card"
                aria-label="Add / Edit Reminder"
            >
                <div class="p-3 border-b bg-neutral-50/60 flex items-center justify-between">
                    <h2 class="font-medium">{{ editingId ? "Edit Reminder" : "Add Reminder" }}</h2>
                    <button v-if="editingId" class="btn-subtle" @click="resetForm">Cancel</button>
                </div>

                <form class="p-4 space-y-4" @submit.prevent="handleSubmit">
                    <div class="space-y-3">
                        <div>
                            <label class="lbl">Vehicle<span class="text-red-600">*</span></label>
                            <select v-model="form.vehicle" class="input">
                                <option value="" disabled>Select Vehicle</option>
                                <option v-for="v in vehicles" :key="v" :value="v">{{ v }}</option>
                            </select>
                            <p v-if="errors.vehicle" class="req">{{ errors.vehicle }}</p>
                        </div>

                        <div>
                            <label class="lbl">Date<span class="text-red-600">*</span></label>
                            <input v-model="form.date" type="date" class="input" />
                            <p v-if="errors.date" class="req">{{ errors.date }}</p>
                        </div>

                        <div>
                            <label class="lbl">Message<span class="text-red-600">*</span></label>
                            <textarea
                                v-model.trim="form.message"
                                rows="3"
                                class="input"
                                placeholder="Reminder message"
                            ></textarea>
                            <p v-if="errors.message" class="req">{{ errors.message }}</p>
                        </div>
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="btn-primary">
                            {{ editingId ? "Update Reminder" : "Add Reminder" }}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";

const formRef = ref<HTMLElement | null>(null);
const search = ref("");
const pageSize = 10;
const page = ref(1);

interface ReminderRow {
    id: number;
    vehicle: string;
    date: string;
    message: string;
}

const rows = ref<ReminderRow[]>([]);
const vehicles = ref(["Truck A", "Truck B", "Truck C"]);

// Sorting
const sort = reactive<{ key: keyof ReminderRow | ""; dir: "asc" | "desc" }>({
    key: "",
    dir: "asc",
});
function toggleSort(key: keyof ReminderRow) {
    if (sort.key === key) sort.dir = sort.dir === "asc" ? "desc" : "asc";
    else {
        sort.key = key;
        sort.dir = "asc";
    }
}

// Search + Sort + Pagination
const filteredRows = computed(() => {
    const q = search.value.toLowerCase().trim();
    const base = [...rows.value];
    if (sort.key) {
        base.sort((a: any, b: any) => {
            const A = (a[sort.key] ?? "").toString().toLowerCase();
            const B = (b[sort.key] ?? "").toString().toLowerCase();
            return sort.dir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        });
    }
    if (!q) return base;
    return base.filter((r) =>
        [r.vehicle, r.date, r.message].some((v) => v?.toLowerCase().includes(q))
    );
});
const pageRows = computed(() =>
    filteredRows.value.slice((page.value - 1) * pageSize, (page.value - 1) * pageSize + pageSize)
);

// Form
const emptyForm = () => ({ vehicle: "", date: "", message: "" });
const form = reactive<ReturnType<typeof emptyForm>>(emptyForm());
const errors = reactive<Record<string, string>>({});
let editingId: number | null = null;

function validate() {
    Object.keys(errors).forEach((k) => delete errors[k]);
    if (!form.vehicle) errors.vehicle = "Required";
    if (!form.date) errors.date = "Required";
    if (!form.message) errors.message = "Required";
    return Object.keys(errors).length === 0;
}

function handleSubmit() {
    if (!validate()) return;
    if (editingId) {
        const idx = rows.value.findIndex((r) => r.id === editingId);
        if (idx !== -1) rows.value[idx] = { id: editingId, ...form };
    } else {
        const id = rows.value.length ? Math.max(...rows.value.map((r) => r.id)) + 1 : 1;
        rows.value.unshift({ id, ...form });
    }
    resetForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function editRow(r: ReminderRow) {
    Object.assign(form, r);
    editingId = r.id;
    scrollToForm();
}
function removeRow(id: number) {
    rows.value = rows.value.filter((r) => r.id !== id);
}
function resetForm() {
    Object.assign(form, emptyForm());
    editingId = null;
}
function scrollToForm() {
    formRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

onMounted(() => {
    rows.value = [
        { id: 1, vehicle: "Truck A", date: "2025-09-25", message: "STNK renewal due next week" },
        { id: 2, vehicle: "Truck B", date: "2025-10-03", message: "Routine service at 90,000 km" },
    ];
});
</script>

<style scoped>
/* .card => rounded-2xl border bg-white shadow-sm overflow-hidden */
.card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb; /* neutral-200 */
    background-color: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

/* .th => py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap */
.th {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 600;
    color: #404040; /* neutral-700 */
    white-space: nowrap;
}

/* .td => py-3 px-4 align-middle */
.td {
    padding: 0.75rem 1rem;
    vertical-align: middle;
}

/* .input => w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition */
.input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb; /* neutral-200 */
    background-color: #ffffff;
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    outline: none;
    transition: box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease,
        color 0.2s ease;
}
.input:focus {
    border-color: #a3a3a3; /* neutral-400 */
    box-shadow: 0 0 0 2px rgba(23, 23, 23, 0.1); /* ring-neutral-900/10 */
}

/* .btn-primary => inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50 */
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background-color: #171717; /* neutral-900 */
    padding: 0.5rem 1rem; /* py-2 px-4 */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    font-weight: 500; /* font-medium */
    color: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn-primary:hover {
    background-color: #262626; /* neutral-800 */
}
.btn-primary:disabled {
    opacity: 0.5;
    pointer-events: none;
}

/* .btn-subtle => inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50 */
.btn-subtle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 0.375rem 0.75rem; /* py-1.5 px-3 */
    font-size: 0.75rem; /* text-xs */
    line-height: 1rem;
    font-weight: 500;
    background-color: transparent;
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn-subtle:hover {
    background-color: #fafafa; /* neutral-50 */
}
.btn-subtle:disabled {
    opacity: 0.5;
    pointer-events: none;
}

/* .btn-danger => inline-flex items-center justify-center rounded-xl border border-red-200 text-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-50 */
.btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid #fecaca; /* red-200 */
    color: #dc2626; /* red-600 */
    background-color: transparent;
    padding: 0.375rem 0.75rem; /* py-1.5 px-3 */
    font-size: 0.75rem; /* text-xs */
    line-height: 1rem;
    font-weight: 500;
    transition: background-color 0.15s ease;
}
.btn-danger:hover {
    background-color: #fef2f2; /* red-50 */
}

/* .lbl => block text-sm text-neutral-700 mb-1 */
.lbl {
    display: block;
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    color: #404040; /* neutral-700 */
    margin-bottom: 0.25rem; /* mb-1 */
}

/* .req => text-xs text-red-600 mt-1 */
.req {
    font-size: 0.75rem; /* text-xs */
    line-height: 1rem;
    color: #dc2626; /* red-600 */
    margin-top: 0.25rem; /* mt-1 */
}

/* .sort => text-[10px] text-neutral-400 */
.sort {
    font-size: 10px;
    line-height: 1;
    color: #a3a3a3; /* neutral-400 */
}
</style>
