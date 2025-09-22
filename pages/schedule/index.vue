<!-- File: pages/schedule.vue (Nuxt 3) -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Schedule</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Schedule</h1>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search…"
                    class="input h-9 w-[200px]"
                />
                <button class="btn-primary h-9" @click="scrollToForm">Add Trip</button>
            </div>
        </div>

        <!-- Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- Table -->
            <section class="lg:col-span-7 xl:col-span-8 card" aria-label="Schedule list">
                <div class="flex items-center justify-between p-3 border-b bg-neutral-50/60">
                    <h2 class="font-medium">Trips</h2>
                    <span class="text-xs text-neutral-500"
                        >{{ filteredRows.length }} record(s)</span
                    >
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full w-full text-sm">
                        <thead class="bg-neutral-50 text-left text-neutral-700">
                            <tr>
                                <th class="th w-16">S.No</th>
                                <th class="th cursor-pointer" @click="toggleSort('customer')">
                                    <span class="th-btn"
                                        >Customer
                                        <span class="sort" v-if="sort.key === 'customer'">{{
                                            sort.dir === "asc" ? "▲" : "▼"
                                        }}</span></span
                                    >
                                </th>
                                <th class="th">Vehicle</th>
                                <th class="th">Type</th>
                                <th class="th">Driver</th>
                                <th class="th">Trip Status</th>
                                <th class="th text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!filteredRows.length">
                                <td class="td text-center text-neutral-500" colspan="7">
                                    No data available in table
                                </td>
                            </tr>
                            <tr
                                v-for="(row, i) in pageRows"
                                :key="row.id"
                                class="hover:bg-neutral-50"
                            >
                                <td class="td">{{ (page - 1) * pageSize + i + 1 }}</td>
                                <td class="td">{{ row.customer }}</td>
                                <td class="td">{{ row.vehicle }}</td>
                                <td class="td">{{ row.type }}</td>
                                <td class="td">{{ row.driver }}</td>
                                <td class="td">
                                    <span :class="statusPill(row.status)">{{ row.status }}</span>
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
                class="lg:col-span-5 xl:col-span-4 card"
                aria-label="Add / Edit Trip"
            >
                <div class="p-3 border-b bg-neutral-50/60 flex items-center justify-between">
                    <h2 class="font-medium">{{ editingId ? "Edit Schedule" : "Add Schedule" }}</h2>
                    <button v-if="editingId" class="btn-subtle" @click="resetForm">Cancel</button>
                </div>

                <form class="p-4 space-y-4" @submit.prevent="handleSubmit">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="lbl"
                                >Customer Name<span class="text-red-600">*</span></label
                            >
                            <select v-model="form.customer" class="input">
                                <option value="" disabled>Select Customer</option>
                                <option v-for="c in customers" :key="c.email" :value="c.name">
                                    {{ c.name }}
                                </option>
                            </select>
                            <p v-if="errors.customer" class="req">{{ errors.customer }}</p>
                        </div>

                        <div>
                            <label class="lbl">Vehicle<span class="text-red-600">*</span></label>
                            <select v-model="form.vehicle" class="input">
                                <option value="" disabled>Select Vehicle</option>
                                <option v-for="v in vehicles" :key="v" :value="v">{{ v }}</option>
                            </select>
                            <p v-if="errors.vehicle" class="req">{{ errors.vehicle }}</p>
                        </div>

                        <div>
                            <label class="lbl">Driver<span class="text-red-600">*</span></label>
                            <select v-model="form.driver" class="input">
                                <option value="" disabled>Select Driver</option>
                                <option v-for="d in drivers" :key="d" :value="d">{{ d }}</option>
                            </select>
                            <p v-if="errors.driver" class="req">{{ errors.driver }}</p>
                        </div>

                        <div>
                            <label class="lbl">Trip Type<span class="text-red-600">*</span></label>
                            <select v-model="form.type" class="input">
                                <option value="" disabled>Select Trip Type</option>
                                <option v-for="t in tripTypes" :key="t" :value="t">{{ t }}</option>
                            </select>
                            <p v-if="errors.type" class="req">{{ errors.type }}</p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Trip Start Location<span class="text-red-600">*</span></label
                            >
                            <input
                                v-model="form.startLocation"
                                type="text"
                                class="input"
                                placeholder="Trip Start Location"
                            />
                            <p v-if="errors.startLocation" class="req">
                                {{ errors.startLocation }}
                            </p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Trip End Location<span class="text-red-600">*</span></label
                            >
                            <input
                                v-model="form.endLocation"
                                type="text"
                                class="input"
                                placeholder="Trip End Location"
                            />
                            <p v-if="errors.endLocation" class="req">{{ errors.endLocation }}</p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Approx Total KM<span class="text-red-600">*</span></label
                            >
                            <input
                                v-model.number="form.km"
                                type="number"
                                min="0"
                                class="input"
                                placeholder="Approx Total KM"
                            />
                            <p v-if="errors.km" class="req">{{ errors.km }}</p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Trip Start Date<span class="text-red-600">*</span></label
                            >
                            <input v-model="form.startDate" type="date" class="input" />
                            <p v-if="errors.startDate" class="req">{{ errors.startDate }}</p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Trip End Date<span class="text-red-600">*</span></label
                            >
                            <input v-model="form.endDate" type="date" class="input" />
                            <p v-if="errors.endDate" class="req">{{ errors.endDate }}</p>
                        </div>

                        <div>
                            <label class="lbl">Tonnage<span class="text-red-600">*</span></label>
                            <input
                                v-model="form.tonnage"
                                type="text"
                                class="input"
                                placeholder="Tonnage"
                            />
                            <p v-if="errors.tonnage" class="req">{{ errors.tonnage }}</p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Trip Status<span class="text-red-600">*</span></label
                            >
                            <select v-model="form.status" class="input">
                                <option value="" disabled>Trip Status</option>
                                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                            </select>
                            <p v-if="errors.status" class="req">{{ errors.status }}</p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="lbl">Email</label>
                        <input
                            v-model="form.email"
                            type="email"
                            class="input"
                            placeholder="customer@email.com"
                        />
                        <label class="inline-flex items-center gap-2 text-sm">
                            <input v-model="form.sendEmail" type="checkbox" class="rounded" />
                            <span>Send booking confirmation email to customer?</span>
                        </label>
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="btn-primary">
                            {{ editingId ? "Update Trip" : "Add Trip" }}
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

const sort = reactive<{ key: keyof Row | ""; dir: "asc" | "desc" }>({ key: "", dir: "asc" });

interface Row {
    id: number;
    customer: string;
    vehicle: string;
    type: string;
    driver: string;
    status: string;
    startLocation?: string;
    endLocation?: string;
    startDate?: string;
    endDate?: string;
    tonnage?: string;
    km?: number;
}

const rows = ref<Row[]>([]);

// Dummy master data
const customers = ref([
    { name: "PT Nusantara Logistik", email: "contact@nusantara.co.id" },
    { name: "CV Mitra Abadi", email: "hello@mitraabadi.id" },
    { name: "PT Sejahtera Bersama", email: "sales@sejahtera.id" },
]);
const vehicles = ref(["Truck A", "Truck B", "Truck C"]);
const drivers = ref(["Budi", "Andi", "Susi", "Rina"]);
const tripTypes = ref(["Single Trip", "Round Trip", "Shuttle"]);
const statuses = ref(["Scheduled", "In Progress", "Completed", "Cancelled"]);

// Form state
const emptyForm = () => ({
    customer: "",
    vehicle: "",
    driver: "",
    type: "",
    startLocation: "",
    endLocation: "",
    km: undefined as number | undefined,
    startDate: "",
    endDate: "",
    tonnage: "",
    status: "",
    email: "",
    sendEmail: false,
});

const form = reactive<ReturnType<typeof emptyForm>>(emptyForm());
const errors = reactive<Record<string, string>>({});
let editingId: number | null = null;

const statusPill = (s: string) =>
    `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        s === "Completed"
            ? "bg-green-50 text-green-700 border-green-200"
            : s === "In Progress"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : s === "Cancelled"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
    }`;

const filteredRows = computed(() => {
    const q = search.value.toLowerCase().trim();
    const base = [...rows.value];
    // sort
    if (sort.key) {
        base.sort((a: any, b: any) => {
            const A = (a[sort.key] ?? "").toString().toLowerCase();
            const B = (b[sort.key] ?? "").toString().toLowerCase();
            return sort.dir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        });
    }
    if (!q) return base;
    return base.filter((r) =>
        [r.customer, r.vehicle, r.type, r.driver, r.status].some((v) =>
            v?.toLowerCase().includes(q)
        )
    );
});

const pageRows = computed(() => {
    const start = (page.value - 1) * pageSize;
    return filteredRows.value.slice(start, start + pageSize);
});

function toggleSort(key: keyof Row) {
    if (sort.key === key) {
        sort.dir = sort.dir === "asc" ? "desc" : "asc";
    } else {
        sort.key = key;
        sort.dir = "asc";
    }
}

function validate() {
    Object.keys(errors).forEach((k) => delete errors[k]);
    const req = [
        "customer",
        "vehicle",
        "driver",
        "type",
        "startLocation",
        "endLocation",
        "startDate",
        "endDate",
        "tonnage",
        "status",
        "km",
    ] as const;
    for (const k of req) {
        const val = (form as any)[k];
        if (val === "" || val === undefined || val === null) {
            errors[k] = "Required";
        }
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
        errors.endDate = "End date must be after start date";
    }
    return Object.keys(errors).length === 0;
}

function handleSubmit() {
    if (!validate()) return;
    if (editingId) {
        const i = rows.value.findIndex((r) => r.id === editingId);
        if (i !== -1) rows.value[i] = { id: editingId, ...form } as Row;
    } else {
        const id = rows.value.length ? Math.max(...rows.value.map((r) => r.id)) + 1 : 1;
        rows.value.unshift({ id, ...form } as Row);
    }
    resetForm();
    // jump to table top on add
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function editRow(r: Row) {
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
    // seed with a couple of rows
    rows.value = [
        {
            id: 1,
            customer: "PT Nusantara Logistik",
            vehicle: "Truck A",
            type: "Single Trip",
            driver: "Budi",
            status: "Scheduled",
            startLocation: "Bandung",
            endLocation: "Jakarta",
            startDate: "2025-10-01",
            endDate: "2025-10-01",
            tonnage: "10T",
            km: 150,
        },
        {
            id: 2,
            customer: "CV Mitra Abadi",
            vehicle: "Truck B",
            type: "Round Trip",
            driver: "Susi",
            status: "In Progress",
            startLocation: "Jakarta",
            endLocation: "Cikarang",
            startDate: "2025-10-02",
            endDate: "2025-10-02",
            tonnage: "8T",
            km: 80,
        },
    ];
});
</script>

<style scoped>
/* .card => rounded-2xl border bg-white shadow-sm overflow-hidden */
.card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
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
    color: #404040;
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
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
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
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn-primary:hover {
    background-color: #262626;
} /* neutral-800 */
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
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    background-color: transparent;
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn-subtle:hover {
    background-color: #fafafa;
} /* neutral-50 */
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
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    transition: background-color 0.15s ease;
}
.btn-danger:hover {
    background-color: #fef2f2;
} /* red-50 */

/* .lbl => block text-sm text-neutral-700 mb-1 */
.lbl {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #404040; /* neutral-700 */
    margin-bottom: 0.25rem;
}

/* .req => text-xs text-red-600 mt-1 */
.req {
    font-size: 0.75rem;
    line-height: 1rem;
    color: #dc2626; /* red-600 */
    margin-top: 0.25rem;
}

/* .sort => text-[10px] text-neutral-400 */
.sort {
    font-size: 10px;
    line-height: 1;
    color: #a3a3a3; /* neutral-400 */
}
</style>
