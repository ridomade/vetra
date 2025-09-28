<!-- File: pages/drivers.vue (Nuxt 3) -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Driver Info</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Driver Info</h1>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search…"
                    class="input h-9 w-[220px]"
                />
                <button class="btn-primary h-9" @click="scrollToForm">Add Driver</button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- Table -->
            <section class="lg:col-span-8 xl:col-span-8 card" aria-label="Driver list">
                <div class="flex items-center justify-between p-3 border-b bg-neutral-50/60">
                    <h2 class="font-medium">Drivers</h2>
                    <span class="text-xs text-neutral-500"
                        >{{ filteredRows.length }} record(s)</span
                    >
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full w-full text-sm">
                        <thead class="bg-neutral-50 text-neutral-700 text-left">
                            <tr>
                                <th class="th w-16">S.No</th>
                                <th class="th cursor-pointer" @click="toggleSort('name')">
                                    Name
                                    <span class="sort" v-if="sort.key === 'name'">{{
                                        sort.dir === "asc" ? "▲" : "▼"
                                    }}</span>
                                </th>
                                <th class="th">Mobile</th>
                                <th class="th">License No</th>
                                <th class="th cursor-pointer" @click="toggleSort('licenseExpDate')">
                                    License Exp Date
                                    <span class="sort" v-if="sort.key === 'licenseExpDate'">{{
                                        sort.dir === "asc" ? "▲" : "▼"
                                    }}</span>
                                </th>
                                <th class="th cursor-pointer" @click="toggleSort('dateOfJoining')">
                                    Date of Joining
                                    <span class="sort" v-if="sort.key === 'dateOfJoining'">{{
                                        sort.dir === "asc" ? "▲" : "▼"
                                    }}</span>
                                </th>
                                <th class="th">Is Active</th>
                                <th class="th text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!filteredRows.length">
                                <td class="td text-center text-neutral-500" colspan="8">
                                    No data available in table
                                </td>
                            </tr>
                            <tr
                                v-for="(row, i) in pageRows"
                                :key="row.id"
                                class="hover:bg-neutral-50"
                            >
                                <td class="td">{{ (page - 1) * pageSize + i + 1 }}</td>
                                <td class="td">{{ row.name }}</td>
                                <td class="td">{{ row.mobile }}</td>
                                <td class="td">{{ row.licenseNo }}</td>
                                <td class="td">{{ row.licenseExpDate }}</td>
                                <td class="td">{{ row.dateOfJoining }}</td>
                                <td class="td">
                                    <span :class="statusPill(row.status)">{{ row.status }}</span>
                                </td>
                                <td class="td text-right">
                                    <div class="inline-flex gap-1">
                                        <button class="btn-subtle" @click="editRow(row)">
                                            Edit
                                        </button>
                                        <button class="btn-subtle" @click="toggleStatus(row)">
                                            {{
                                                row.status === "Active" ? "Deactivate" : "Activate"
                                            }}
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
                aria-label="Add / Edit Driver"
            >
                <div class="p-3 border-b bg-neutral-50/60 flex items-center justify-between">
                    <h2 class="font-medium">{{ editingId ? "Edit Driver" : "Add Driver" }}</h2>
                    <button v-if="editingId" class="btn-subtle" @click="resetForm">Cancel</button>
                </div>

                <form class="p-4 space-y-4" @submit.prevent="handleSubmit">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="lbl"
                                >Driver Name<span class="text-red-600">*</span></label
                            >
                            <input
                                v-model.trim="form.name"
                                type="text"
                                class="input"
                                placeholder="Driver Name"
                            />
                            <p v-if="errors.name" class="req">{{ errors.name }}</p>
                        </div>

                        <div>
                            <label class="lbl">Mobile<span class="text-red-600">*</span></label>
                            <input
                                v-model.trim="form.mobile"
                                type="tel"
                                class="input"
                                placeholder="Mobile"
                            />
                            <p v-if="errors.mobile" class="req">{{ errors.mobile }}</p>
                        </div>

                        <div>
                            <label class="lbl">Age<span class="text-red-600">*</span></label>
                            <input
                                v-model.number="form.age"
                                type="number"
                                min="18"
                                class="input"
                                placeholder="Age"
                            />
                            <p v-if="errors.age" class="req">{{ errors.age }}</p>
                        </div>

                        <div>
                            <label class="lbl">License No<span class="text-red-600">*</span></label>
                            <input
                                v-model.trim="form.licenseNo"
                                type="text"
                                class="input"
                                placeholder="License No"
                            />
                            <p v-if="errors.licenseNo" class="req">{{ errors.licenseNo }}</p>
                        </div>

                        <div>
                            <label class="lbl"
                                >License Expiry Date<span class="text-red-600">*</span></label
                            >
                            <input v-model="form.licenseExpDate" type="date" class="input" />
                            <p v-if="errors.licenseExpDate" class="req">
                                {{ errors.licenseExpDate }}
                            </p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Total Experience (years)<span class="text-red-600">*</span></label
                            >
                            <input
                                v-model.number="form.experience"
                                type="number"
                                min="0"
                                step="0.5"
                                class="input"
                                placeholder="Total Experience"
                            />
                            <p v-if="errors.experience" class="req">{{ errors.experience }}</p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Date of Joining<span class="text-red-600">*</span></label
                            >
                            <input v-model="form.dateOfJoining" type="date" class="input" />
                            <p v-if="errors.dateOfJoining" class="req">
                                {{ errors.dateOfJoining }}
                            </p>
                        </div>

                        <div>
                            <label class="lbl">Reference/Notes</label>
                            <input
                                v-model.trim="form.notes"
                                type="text"
                                class="input"
                                placeholder="Reference or Notes"
                            />
                        </div>

                        <div class="sm:col-span-2">
                            <label class="lbl">Address<span class="text-red-600">*</span></label>
                            <textarea
                                v-model.trim="form.address"
                                rows="3"
                                class="input"
                                placeholder="Address"
                            ></textarea>
                            <p v-if="errors.address" class="req">{{ errors.address }}</p>
                        </div>

                        <div class="sm:col-span-2">
                            <label class="lbl"
                                >Driver Status<span class="text-red-600">*</span></label
                            >
                            <select v-model="form.status" class="input">
                                <option value="" disabled>Select Driver Status</option>
                                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                            </select>
                            <p v-if="errors.status" class="req">{{ errors.status }}</p>
                        </div>
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="btn-primary">
                            {{ editingId ? "Update Driver" : "Add Driver" }}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
/* ====== Ambil state & API dari dummy DB ====== */
const {
    drivers, // reactive array of drivers
    createDriver,
    updateDriver,
    removeDriver,
    toggleDriverStatus,
    driverStatuses, // ["Active", "Inactive"]
} = useDriversDb();

/* ====== UI State ====== */
const formRef = ref(null);
const search = ref("");
const pageSize = 10;
const page = ref(1);

const statuses = driverStatuses;

/* ====== Sorting ====== */
const sort = reactive({ key: "", dir: "asc" }); // key: name | licenseExpDate | dateOfJoining | etc.
function toggleSort(key) {
    if (sort.key === key) sort.dir = sort.dir === "asc" ? "desc" : "asc";
    else {
        sort.key = key;
        sort.dir = "asc";
    }
}

/* ====== Styling ====== */
const statusPill = (s) =>
    `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        s === "Active"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-neutral-100 text-neutral-600 border-neutral-200"
    }`;

/* ====== Search + Sort + Pagination ====== */
const filteredRows = computed(() => {
    const q = search.value.toLowerCase().trim();
    const base = [...drivers.value];
    if (sort.key) {
        base.sort((a, b) => {
            const A = (a[sort.key] ?? "").toString().toLowerCase();
            const B = (b[sort.key] ?? "").toString().toLowerCase();
            return sort.dir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        });
    }
    if (!q) return base;
    return base.filter((r) =>
        [r.name, r.mobile, r.licenseNo, r.status, r.address].some((v) =>
            (v ?? "").toLowerCase().includes(q)
        )
    );
});
const pageRows = computed(() =>
    filteredRows.value.slice((page.value - 1) * pageSize, (page.value - 1) * pageSize + pageSize)
);

/* ====== Form ====== */
const emptyForm = () => ({
    name: "",
    mobile: "",
    age: undefined,
    licenseNo: "",
    licenseExpDate: "",
    dateOfJoining: "",
    address: "",
    experience: undefined,
    notes: "",
    status: "",
});
const form = reactive(emptyForm());
const errors = reactive({});
const editingId = ref(null);

function validate() {
    Object.keys(errors).forEach((k) => delete errors[k]);
    const required = [
        "name",
        "mobile",
        "age",
        "licenseNo",
        "licenseExpDate",
        "dateOfJoining",
        "address",
        "experience",
        "status",
    ];
    for (const k of required) {
        const val = form[k];
        if (val === "" || val === undefined || val === null) errors[k] = "Required";
    }
    return Object.keys(errors).length === 0;
}

function handleSubmit() {
    if (!validate()) return;
    if (editingId.value) {
        updateDriver(editingId.value, { ...form });
    } else {
        createDriver({ ...form });
    }
    resetForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function editRow(r) {
    Object.assign(form, r);
    editingId.value = r.id;
    scrollToForm();
}
function toggleStatus(r) {
    toggleDriverStatus(r.id);
}
function removeRow(id) {
    removeDriver(id);
}
function resetForm() {
    Object.assign(form, emptyForm());
    editingId.value = null;
}
function scrollToForm() {
    formRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
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

/* .input */
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
    border-color: #a3a3a3;
    box-shadow: 0 0 0 2px rgba(23, 23, 23, 0.1);
}

/* .btn-primary */
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
    color: #ffffff;
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

/* .btn-subtle */
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

/* .btn-danger */
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

/* .lbl */
.lbl {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #404040;
    margin-bottom: 0.25rem;
}

/* .req */
.req {
    font-size: 0.75rem;
    line-height: 1rem;
    color: #dc2626;
    margin-top: 0.25rem;
}

/* .sort */
.sort {
    font-size: 10px;
    line-height: 1;
    color: #a3a3a3;
}
</style>
