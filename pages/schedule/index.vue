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
                                    <span class="th-btn">
                                        Customer
                                        <span class="sort" v-if="sort.key === 'customer'">{{
                                            sort.dir === "asc" ? "▲" : "▼"
                                        }}</span>
                                    </span>
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
                                <option v-for="c in customers" :key="c.id" :value="c.name">
                                    {{ c.name }}
                                </option>
                            </select>
                            <p v-if="errors.customer" class="req">{{ errors.customer }}</p>
                        </div>

                        <div>
                            <label class="lbl">Vehicle<span class="text-red-600">*</span></label>
                            <select v-model="form.vehicle" class="input">
                                <option value="" disabled>Select Vehicle</option>
                                <option
                                    v-for="v in vehicleOpts"
                                    :key="v.name"
                                    :value="v.name"
                                    :disabled="v.disabled"
                                >
                                    {{ v.name }}{{ v.disabled ? " (busy)" : "" }}
                                </option>
                            </select>
                            <p v-if="errors.vehicle" class="req">{{ errors.vehicle }}</p>
                            <p class="text-xs text-neutral-500 mt-1" v-if="busyVehiclesCount">
                                {{ busyVehiclesCount }} vehicle currently busy in overlapping
                                schedules.
                            </p>
                        </div>

                        <div>
                            <label class="lbl">Driver<span class="text-red-600">*</span></label>
                            <select v-model="form.driver" class="input">
                                <option value="" disabled>Select Driver</option>
                                <option
                                    v-for="d in driverOpts"
                                    :key="d.name"
                                    :value="d.name"
                                    :disabled="d.disabled"
                                >
                                    {{ d.name }}{{ d.disabled ? " (busy)" : "" }}
                                </option>
                            </select>
                            <p v-if="errors.driver" class="req">{{ errors.driver }}</p>
                            <p class="text-xs text-neutral-500 mt-1" v-if="busyDriversCount">
                                {{ busyDriversCount }} driver currently busy in overlapping
                                schedules.
                            </p>
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
                            <span
                                >Is it necessary to send a confirmation email once the schedule has
                                been approved by the management?</span
                            >
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

<script setup>
import { ref, reactive, computed, watch } from "vue";

const {
    schedules,
    customerOptions,
    vehicleNames,
    driverNames,
    tripTypes,
    tripStatuses,
    createSchedule,
    updateSchedule,
    removeSchedule,
} = useScheduleDb();

/* ===== UI state ===== */
const formRef = ref(null);
const search = ref("");
const pageSize = 10;
const page = ref(1);
const sort = reactive({ key: "", dir: "asc" });

/* ===== Table: search + sort + pagination ===== */
const filteredRows = computed(() => {
    const q = search.value.toLowerCase().trim();
    const base = [...schedules.value];
    if (sort.key) {
        base.sort((a, b) => {
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
function toggleSort(key) {
    if (sort.key === key) sort.dir = sort.dir === "asc" ? "desc" : "asc";
    else {
        sort.key = key;
        sort.dir = "asc";
    }
}

/* ===== Dropdown options ===== */
const customers = computed(() => customerOptions.value);
const statuses = computed(() => tripStatuses);

/* Helpers tanggal & overlap */
const toDate = (s) => {
    if (!s) return null;
    const [y, m, d] = String(s)
        .split("-")
        .map((n) => Number(n));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
};
const overlap = (a1, a2, b1, b2) => {
    if (!a1 || !a2 || !b1 || !b2) return true; // konservatif: kalau tak lengkap, dianggap overlap
    return a1 <= b2 && b1 <= a2;
};
const isPending = (s) => s === "Yet to Start" || s === "Ongoing";

/* Form */
const emptyForm = () => ({
    customer: "",
    vehicle: "",
    driver: "",
    type: "",
    startLocation: "",
    endLocation: "",
    km: undefined,
    startDate: "",
    endDate: "",
    tonnage: "",
    status: "",
    email: "",
    sendEmail: false,
});
const form = reactive(emptyForm());
const errors = reactive({});
let editingId = null;

/* Otomatis isi email customer */
watch(
    () => form.customer,
    (name) => {
        const c = customers.value.find((x) => x.name === name);
        if (c && c.email && !form.email) form.email = c.email;
    }
);

/* Hitung siapa yang sedang busy (untuk disable opsi) */
const formStart = computed(() => toDate(form.startDate));
const formEnd = computed(() => toDate(form.endDate));

const busyVehicles = computed(() => {
    const set = new Set();
    for (const r of schedules.value) {
        if (editingId && r.id === editingId) continue; // jangan blokir dirinya sendiri saat edit
        if (!isPending(r.status)) continue;
        // blokir jika overlap dengan tanggal form; jika tanggal form kosong, pakai overlap "konservatif"
        const block = overlap(
            formStart.value,
            formEnd.value,
            toDate(r.startDate),
            toDate(r.endDate)
        );
        if (block && r.vehicle) set.add(r.vehicle);
    }
    return set;
});
const busyDrivers = computed(() => {
    const set = new Set();
    for (const r of schedules.value) {
        if (editingId && r.id === editingId) continue;
        if (!isPending(r.status)) continue;
        const block = overlap(
            formStart.value,
            formEnd.value,
            toDate(r.startDate),
            toDate(r.endDate)
        );
        if (block && r.driver) set.add(r.driver);
    }
    return set;
});

const vehicleOpts = computed(() =>
    vehicleNames.value.map((name) => ({
        name,
        disabled: busyVehicles.value.has(name) && name !== form.vehicle,
    }))
);
const driverOpts = computed(() =>
    driverNames.value.map((name) => ({
        name,
        disabled: busyDrivers.value.has(name) && name !== form.driver,
    }))
);

const busyVehiclesCount = computed(() => [...busyVehicles.value].length);
const busyDriversCount = computed(() => [...busyDrivers.value].length);

/* Validate */
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
    ];
    for (const k of req) {
        const val = form[k];
        if (val === "" || val === undefined || val === null) errors[k] = "Required";
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
        errors.endDate = "End date must be after start date";
    }
    // cegah submit bila memilih opsi yang sedang busy
    if (
        busyVehicles.value.has(form.vehicle) &&
        form.vehicle !== (editingId ? getEditing("vehicle") : "")
    ) {
        errors.vehicle = "Vehicle is busy in the selected date range";
    }
    if (
        busyDrivers.value.has(form.driver) &&
        form.driver !== (editingId ? getEditing("driver") : "")
    ) {
        errors.driver = "Driver is busy in the selected date range";
    }
    return Object.keys(errors).length === 0;
}
function getEditing(field) {
    if (!editingId) return "";
    const r = schedules.value.find((x) => x.id === editingId);
    return r ? r[field] : "";
}

/* Submit */
function handleSubmit() {
    if (!validate()) return;
    if (editingId) updateSchedule(editingId, { ...form });
    else createSchedule({ ...form });
    resetForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function editRow(r) {
    Object.assign(form, r);
    editingId = r.id;
    scrollToForm();
}
function removeRow(id) {
    removeSchedule(id);
}
function resetForm() {
    Object.assign(form, emptyForm());
    editingId = null;
}
function scrollToForm() {
    formRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Badge style */
const statusPill = (s) =>
    `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        s === "Completed"
            ? "bg-green-50 text-green-700 border-green-200"
            : s === "Ongoing"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : s === "Cancelled"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
    }`;
</script>

<style scoped>
.card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
}
.th {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 600;
    color: #404040;
    white-space: nowrap;
}
.th-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}
.sort {
    font-size: 10px;
    line-height: 1;
    color: #a3a3a3;
}
.td {
    padding: 0.75rem 1rem;
    vertical-align: middle;
}
.input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition: box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease,
        color 0.2s ease;
}
.input:focus {
    border-color: #a3a3a3;
    box-shadow: 0 0 0 2px rgba(23, 23, 23, 0.1);
}
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background-color: #171717;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn-primary:hover {
    background-color: #262626;
}
.btn-primary:disabled {
    opacity: 0.5;
    pointer-events: none;
}
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
}
.btn-subtle:disabled {
    opacity: 0.5;
    pointer-events: none;
}
.btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid #fecaca;
    color: #dc2626;
    background-color: transparent;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    transition: background-color 0.15s ease;
}
.btn-danger:hover {
    background-color: #fef2f2;
}
.lbl {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #404040;
    margin-bottom: 0.25rem;
}
.req {
    font-size: 0.75rem;
    line-height: 1rem;
    color: #dc2626;
    margin-top: 0.25rem;
}
</style>
