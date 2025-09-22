<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Top Bar / Breadcrumbs -->
        <header class="bg-white border-b">
            <div class="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div>
                    <nav class="text-sm text-neutral-500">
                        <ol class="flex items-center gap-2">
                            <li>
                                <NuxtLink to="/" class="hover:text-neutral-800">Dashboard</NuxtLink>
                            </li>
                            <li class="opacity-50">/</li>
                            <li class="text-neutral-900 font-medium">Driver Info</li>
                        </ol>
                    </nav>
                    <h1 class="text-xl font-semibold text-neutral-900 mt-1">Driver Info</h1>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        @click="openCreate()"
                        class="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4">
                            <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
                        </svg>
                        Add Driver
                    </button>
                </div>
            </div>
        </header>

        <!-- Toolbar + Table wrapper (FULL WIDTH) -->
        <section class="w-full px-0 lg:px-0 mt-6">
            <div class="rounded-none lg:rounded-none border-y bg-white shadow-sm overflow-hidden">
                <!-- Toolbar -->
                <div
                    class="px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b"
                >
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="relative">
                            <input
                                v-model="query"
                                type="text"
                                placeholder="Search drivers (name, mobile, license)…"
                                class="w-72 rounded-xl border border-neutral-200 bg-white px-3 py-2 pl-9 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                class="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
                            >
                                <path
                                    fill="currentColor"
                                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                                />
                            </svg>
                        </div>
                        <select
                            v-model.number="pageSize"
                            class="rounded-xl border px-3 py-2 text-sm"
                        >
                            <option :value="5">5 / page</option>
                            <option :value="10">10 / page</option>
                            <option :value="20">20 / page</option>
                        </select>
                        <select v-model="statusFilter" class="rounded-xl border px-3 py-2 text-sm">
                            <option value="all">All status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="text-xs text-neutral-500">
                        Showing
                        <span class="font-medium text-neutral-700">{{ paged.length }}</span> of
                        <span class="font-medium text-neutral-700">{{ filtered.length }}</span>
                        drivers
                    </div>
                </div>

                <!-- TABLE FULL LAYAR -->
                <div class="overflow-x-auto">
                    <table class="min-w-full w-full text-sm">
                        <thead class="bg-neutral-50 text-neutral-700">
                            <tr>
                                <th
                                    class="py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap w-16"
                                >
                                    S.No
                                </th>
                                <th
                                    class="py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap cursor-pointer"
                                    @click="sortBy('name')"
                                >
                                    <span class="inline-flex items-center gap-1"
                                        >Name
                                        <SortGlyph :dir="sort.key === 'name' ? sort.dir : null"
                                    /></span>
                                </th>
                                <th
                                    class="py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap"
                                >
                                    Mobile
                                </th>
                                <th
                                    class="py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap cursor-pointer"
                                    @click="sortBy('licenseNo')"
                                >
                                    <span class="inline-flex items-center gap-1"
                                        >License No
                                        <SortGlyph
                                            :dir="sort.key === 'licenseNo' ? sort.dir : null"
                                    /></span>
                                </th>
                                <th
                                    class="py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap cursor-pointer"
                                    @click="sortBy('licenseExp')"
                                >
                                    <span class="inline-flex items-center gap-1"
                                        >License Exp Date
                                        <SortGlyph
                                            :dir="sort.key === 'licenseExp' ? sort.dir : null"
                                    /></span>
                                </th>
                                <th
                                    class="py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap"
                                >
                                    Date of Joining
                                </th>
                                <th
                                    class="py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap"
                                >
                                    Is Active
                                </th>
                                <th
                                    class="py-3 px-4 text-xs font-semibold text-neutral-700 whitespace-nowrap w-24"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(d, idx) in paged"
                                :key="d.id"
                                class="border-t hover:bg-neutral-50/60"
                            >
                                <td class="py-3 px-4 align-middle">{{ startIndex + idx + 1 }}</td>
                                <td class="py-3 px-4 align-middle font-medium text-neutral-900">
                                    {{ d.name }}
                                </td>
                                <td class="py-3 px-4 align-middle">{{ d.mobile }}</td>
                                <td class="py-3 px-4 align-middle">{{ d.licenseNo }}</td>
                                <td class="py-3 px-4 align-middle">{{ fmtDate(d.licenseExp) }}</td>
                                <td class="py-3 px-4 align-middle">{{ fmtDate(d.joinDate) }}</td>
                                <td class="py-3 px-4 align-middle">
                                    <span
                                        :class="
                                            d.active
                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                                        "
                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                                    >
                                        <span
                                            :class="d.active ? 'bg-emerald-500' : 'bg-rose-500'"
                                            class="w-1.5 h-1.5 rounded-full"
                                        ></span>
                                        {{ d.active ? "Active" : "Inactive" }}
                                    </span>
                                </td>
                                <td class="py-3 px-4 align-middle">
                                    <div class="flex items-center gap-2">
                                        <button
                                            @click="openEdit(d)"
                                            class="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                class="w-4 h-4"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
                                                />
                                            </svg>
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!paged.length">
                                <td colspan="8" class="py-10 px-4 text-center text-neutral-500">
                                    No data
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div
                    class="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-t bg-neutral-50"
                >
                    <div class="text-xs text-neutral-500">
                        Page <span class="font-semibold text-neutral-700">{{ page }}</span> of
                        <span class="font-semibold text-neutral-700">{{ totalPages }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <button
                            class="inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="page === 1"
                            @click="setPage(page - 1)"
                        >
                            Previous
                        </button>
                        <button
                            v-for="p in pages"
                            :key="p"
                            @click="setPage(p)"
                            class="px-3 py-1.5 text-sm rounded-xl border"
                            :class="
                                p === page
                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                    : 'hover:bg-neutral-100'
                            "
                        >
                            {{ p }}
                        </button>
                        <button
                            class="inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="page === totalPages"
                            @click="setPage(page + 1)"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal Add/Edit Driver (field sesuai gambar) -->
        <div v-if="modalOpen" class="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
            <div class="w-full max-w-6xl rounded-2xl bg-white shadow-lg overflow-hidden">
                <header class="px-6 py-4 border-b flex items-center justify-between">
                    <h3 class="font-semibold text-neutral-900">
                        {{ editing?.id ? "Edit Driver" : "Add driver" }}
                    </h3>
                    <button
                        class="inline-flex items-center justify-center rounded-xl hover:bg-neutral-100 w-9 h-9"
                        @click="closeModal()"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
                            <path
                                fill="currentColor"
                                d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z"
                            />
                        </svg>
                    </button>
                </header>
                <form @submit.prevent="saveDriver" class="p-6 grid gap-5">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <!-- Row 1 -->
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >Driver Name<span class="text-rose-500">*</span></label
                            >
                            <input
                                v-model="form.name"
                                required
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                                placeholder="Driver Name"
                            />
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >Mobile<span class="text-rose-500">*</span></label
                            >
                            <input
                                v-model="form.mobile"
                                required
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                                placeholder="Mobile"
                            />
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >Age<span class="text-rose-500">*</span></label
                            >
                            <input
                                v-model.number="form.age"
                                type="number"
                                min="18"
                                required
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                                placeholder="Age"
                            />
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >License No<span class="text-rose-500">*</span></label
                            >
                            <input
                                v-model="form.licenseNo"
                                required
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                                placeholder="License No"
                            />
                        </div>

                        <!-- Row 2 -->
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >License Expiry Date<span class="text-rose-500">*</span></label
                            >
                            <input
                                v-model="form.licenseExp"
                                type="date"
                                required
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                            />
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >Total Experience<span class="text-rose-500">*</span></label
                            >
                            <input
                                v-model="form.totalExp"
                                required
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                                placeholder="e.g. 5 years"
                            />
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >Date of Joining<span class="text-rose-500">*</span></label
                            >
                            <input
                                v-model="form.joinDate"
                                type="date"
                                required
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                                placeholder="Date of Joining"
                            />
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >Reference/Notes</label
                            >
                            <input
                                v-model="form.reference"
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                                placeholder="Reference or Notes"
                            />
                        </div>

                        <!-- Row 3 -->
                        <div class="md:col-span-9">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >Address<span class="text-rose-500">*</span></label
                            >
                            <textarea
                                v-model="form.address"
                                required
                                rows="3"
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                                placeholder="Address"
                            ></textarea>
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-neutral-700 mb-1"
                                >Driver Status</label
                            >
                            <select
                                v-model="form.active"
                                class="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                            >
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            class="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium hover:bg-neutral-50"
                            @click="closeModal()"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                            Add Driver
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, defineComponent } from "vue";

// Small inline component for sort glyph
const SortGlyph = defineComponent({
    props: { dir: { type: [String, null], default: null } },
    template: `
    <svg v-if="dir==='asc'" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='w-3.5 h-3.5'><path fill='currentColor' d='M7 14l5-5 5 5z'/></svg>
    <svg v-else-if="dir==='desc'" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='w-3.5 h-3.5'><path fill='currentColor' d='M7 10l5 5 5-5z'/></svg>
    <svg v-else xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class='w-3.5 h-3.5 text-neutral-400'><path fill='currentColor' d='M7 10l5 5 5-5z'/></svg>
  `,
});

// ===== Dummy data =====
const seed = [
    {
        id: 1,
        name: "Agus Pratama",
        mobile: "08123123123",
        age: 34,
        licenseNo: "A-10001",
        licenseExp: "2026-01-15",
        joinDate: "2023-04-10",
        totalExp: "5 years",
        reference: "",
        address: "Bandung",
        active: true,
    },
    {
        id: 2,
        name: "Budi Santoso",
        mobile: "08123456789",
        age: 29,
        licenseNo: "B-10002",
        licenseExp: "2025-11-01",
        joinDate: "2022-08-22",
        totalExp: "3 years",
        reference: "",
        address: "Bandung",
        active: true,
    },
    {
        id: 3,
        name: "Citra Lestari",
        mobile: "0813555777",
        age: 31,
        licenseNo: "A-10003",
        licenseExp: "2025-10-11",
        joinDate: "2024-02-01",
        totalExp: "6 years",
        reference: "",
        address: "Cimahi",
        active: false,
    },
];
const auto = Array.from({ length: 12 }, (_, i) => ({
    id: 4 + i,
    name: `Driver ${i + 1}`,
    mobile: `08${Math.floor(1e10 + Math.random() * 9e9)}`,
    age: 25 + Math.floor(Math.random() * 20),
    licenseNo: `B-${10010 + i}`,
    licenseExp: randDate("2025-01-01", "2027-12-31"),
    joinDate: randDate("2021-01-01", "2024-12-31"),
    totalExp: `${1 + Math.floor(Math.random() * 9)} years`,
    reference: "",
    address: "—",
    active: Math.random() > 0.3,
}));
const drivers = ref([...seed, ...auto]);

function randDate(start, end) {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const d = new Date(s + Math.random() * (e - s));
    return d.toISOString().slice(0, 10);
}

// ===== Table utilities =====
const query = ref("");
const statusFilter = ref("all"); // all | active | inactive
const page = ref(1);
const pageSize = ref(10);
const sort = reactive({ key: "name", dir: "asc" }); // asc | desc

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    return drivers.value.filter((d) => {
        const matchQ =
            !q || [d.name, d.mobile, d.licenseNo].some((v) => String(v).toLowerCase().includes(q));
        const matchS =
            statusFilter.value === "all" ||
            (statusFilter.value === "active" ? d.active : !d.active);
        return matchQ && matchS;
    });
});

const sorted = computed(() => {
    const arr = [...filtered.value];
    arr.sort((a, b) => {
        const k = sort.key;
        const av = a[k];
        const bv = b[k];
        if (av == null && bv != null) return sort.dir === "asc" ? -1 : 1;
        if (av != null && bv == null) return sort.dir === "asc" ? 1 : -1;
        if (typeof av === "string")
            return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        return sort.dir === "asc"
            ? av > bv
                ? 1
                : av < bv
                ? -1
                : 0
            : av < bv
            ? 1
            : av > bv
            ? -1
            : 0;
    });
    return arr;
});

const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize.value)));
const startIndex = computed(() => (page.value - 1) * pageSize.value);
const paged = computed(() =>
    sorted.value.slice(startIndex.value, startIndex.value + pageSize.value)
);

const pages = computed(() => {
    const tp = totalPages.value;
    const p = page.value;
    const win = 3;
    const start = Math.max(1, p - win);
    const end = Math.min(tp, p + win);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

function setPage(p) {
    page.value = Math.min(Math.max(1, p), totalPages.value);
}
function sortBy(key) {
    if (sort.key === key) sort.dir = sort.dir === "asc" ? "desc" : "asc";
    else {
        sort.key = key;
        sort.dir = "asc";
    }
}

// Reset ke halaman 1 saat filter berubah
watch([query, statusFilter, pageSize], () => {
    page.value = 1;
});

function fmtDate(s) {
    try {
        return new Date(s).toISOString().slice(0, 10);
    } catch {
        return s;
    }
}

// ===== Modal & form =====
const modalOpen = ref(false);
const editing = ref(null);
const form = reactive({
    id: null,
    name: "",
    mobile: "",
    age: null,
    licenseNo: "",
    licenseExp: "",
    joinDate: "",
    totalExp: "",
    reference: "",
    address: "",
    active: true,
});

function openEdit(d) {
    editing.value = d;
    Object.assign(form, d);
    modalOpen.value = true;
}
function openCreate() {
    editing.value = null;
    Object.assign(form, {
        id: null,
        name: "",
        mobile: "",
        age: null,
        licenseNo: "",
        licenseExp: "",
        joinDate: "",
        totalExp: "",
        reference: "",
        address: "",
        active: true,
    });
    modalOpen.value = true;
}
function closeModal() {
    modalOpen.value = false;
}

function saveDriver() {
    // Validasi berdasarkan field bertanda * di gambar
    if (
        !form.name ||
        !form.mobile ||
        !form.age ||
        !form.licenseNo ||
        !form.licenseExp ||
        !form.joinDate ||
        !form.totalExp ||
        !form.address
    )
        return;
    if (editing.value) {
        const idx = drivers.value.findIndex((x) => x.id === editing.value.id);
        if (idx !== -1) drivers.value[idx] = { ...drivers.value[idx], ...form };
    } else {
        const maxId = drivers.value.reduce((m, x) => Math.max(m, x.id), 0);
        drivers.value.unshift({ ...form, id: maxId + 1 });
    }
    modalOpen.value = false;
}
</script>

<style scoped>
/* Utility-only classes in markup to minimize CSS complexity. */
</style>
