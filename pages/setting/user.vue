<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Users</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">User Management</h1>
                <p class="text-neutral-500 text-sm mt-1">
                    Kelola pengguna dan permission dalam satu halaman.
                </p>
            </div>

            <div class="flex items-center gap-2">
                <div class="relative">
                    <input v-model="query" placeholder="Search…" class="input pl-9 md:w-72" />
                    <svg
                        class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12.9 14.32A8 8 0 1114.32 12.9l3.39 3.39a1 1 0 01-1.42 1.42l-3.39-3.39zM8 14a6 6 0 100-12 6 6 0 000 12z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <button class="btn-primary" @click="openCreate">+ Add User</button>
            </div>
        </div>

        <!-- Table -->
        <div class="card overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-neutral-50 text-left text-neutral-700">
                        <tr>
                            <th class="th w-20">S.No</th>
                            <th class="th">Name</th>
                            <th class="th">Mobile</th>
                            <th class="th">Email</th>
                            <th class="th">Status</th>
                            <th class="th w-28">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(u, i) in paged" :key="u.id" class="hover:bg-neutral-50">
                            <td class="td">{{ (page - 1) * perPage + i + 1 }}</td>
                            <td class="td font-medium">{{ u.name }}</td>
                            <td class="td">{{ u.mobile || "—" }}</td>
                            <td class="td">{{ u.email }}</td>
                            <td class="td">
                                <span :class="u.active ? badgeActive : badgeMuted">{{
                                    u.active ? "Active" : "Inactive"
                                }}</span>
                            </td>
                            <td class="td">
                                <div class="flex gap-2">
                                    <button class="btn-subtle" @click="openEdit(u)">Edit</button>
                                    <button class="btn-danger" @click="remove(u.id)">Delete</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!paged.length">
                            <td class="td text-center text-neutral-500" colspan="6">
                                No users found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between p-3 border-t">
                <div class="text-xs text-neutral-500">
                    Showing <b>{{ (page - 1) * perPage + 1 }}</b
                    >–
                    <b>{{ Math.min(page * perPage, filtered.length) }}</b>
                    of <b>{{ filtered.length }}</b>
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn-subtle" :disabled="page === 1" @click="page--">
                        Previous
                    </button>
                    <span class="text-sm">Page {{ page }}</span>
                    <button class="btn-subtle" :disabled="page >= maxPage" @click="page++">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal (Create / Edit) -->
        <Transition name="fade">
            <div v-if="showModal" class="fixed inset-0 z-50">
                <div class="absolute inset-0 bg-black/40" @click="closeModal" />
                <div class="absolute inset-0 grid place-items-center p-4">
                    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between p-4 border-b">
                            <h3 class="text-lg font-semibold">
                                {{ editing ? "Edit User" : "Add User" }}
                            </h3>
                            <button class="btn-icon" @click="closeModal">✕</button>
                        </div>

                        <!-- Modal body -->
                        <div class="p-4 space-y-6 max-h-[75vh] overflow-auto">
                            <!-- Basic fields -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label class="lbl">Name</label>
                                    <input
                                        v-model="form.name"
                                        class="input"
                                        placeholder="Full name"
                                    />
                                </div>
                                <div>
                                    <label class="lbl">Email</label>
                                    <input
                                        v-model="form.email"
                                        class="input"
                                        type="email"
                                        placeholder="email@domain.com"
                                    />
                                </div>
                                <div>
                                    <label class="lbl">User Name</label>
                                    <input
                                        v-model="form.username"
                                        class="input"
                                        placeholder="username"
                                    />
                                </div>
                                <div>
                                    <label class="lbl">Password</label>
                                    <input
                                        v-model="form.password"
                                        class="input"
                                        type="password"
                                        :placeholder="editing ? '••••••••' : 'Min. 6 chars'"
                                    />
                                </div>
                                <div>
                                    <label class="lbl">Mobile</label>
                                    <input
                                        v-model="form.mobile"
                                        class="input"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                                <div class="flex items-end">
                                    <label class="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            v-model="form.active"
                                            class="rounded"
                                        />
                                        Active
                                    </label>
                                </div>
                            </div>

                            <!-- Permissions -->
                            <div>
                                <div class="mb-2 flex items-center justify-between">
                                    <h4 class="font-semibold">User Permissions</h4>
                                    <div class="flex items-center gap-3 text-xs">
                                        <button class="btn-subtle" @click="checkAll(true)">
                                            Select all
                                        </button>
                                        <button class="btn-subtle" @click="checkAll(false)">
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <div
                                        v-for="(ops, moduleName) in PERMISSIONS"
                                        :key="moduleName"
                                        class="rounded-xl border p-3"
                                    >
                                        <div class="font-medium mb-2">{{ moduleName }}</div>
                                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                                            <label
                                                v-for="op in ops"
                                                :key="op"
                                                class="inline-flex items-center gap-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    :checked="isChecked(moduleName as string, op)"
                                                    @change="
                                                        togglePerm(
                                                            moduleName as string,
                                                            op,
                                                            ($event.target as HTMLInputElement)
                                                                .checked
                                                        )
                                                    "
                                                    class="rounded"
                                                />
                                                <span>{{ op }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Modal footer -->
                        <div class="p-4 border-t flex items-center justify-end gap-2">
                            <button class="btn-subtle" @click="closeModal">Cancel</button>
                            <button class="btn-primary" @click="save">
                                {{ editing ? "Save Changes" : "Add User" }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";

type User = {
    id: number;
    name: string;
    email: string;
    username: string;
    /** hanya untuk form; optional dan TIDAK disimpan ke daftar */
    password?: string;
    mobile?: string;
    active: boolean;
    permissions: Record<string, string[]>;
};

const badgeActive =
    "inline-flex px-2 py-0.5 rounded-full text-xs border bg-green-50 text-green-700 border-green-200";
const badgeMuted =
    "inline-flex px-2 py-0.5 rounded-full text-xs border bg-neutral-100 text-neutral-600 border-neutral-200";

/** Permission matrix */
const PERMISSIONS: Record<string, string[]> = {
    Vehicle: ["All List", "Detail View", "Edit", "Add"],
    "Vehicle Group": ["All List", "Add New", "Delete"],
    Driver: ["All List", "Edit", "Add New"],
    Bookings: ["All Bookings", "Edit", "Add New"],
    Customer: ["All List", "Edit", "Add New"],
    Fuel: ["Fuel List", "Edit", "Add New"],
    Reminder: ["All List", "Delete", "Add New"],
    "Income Expense": ["All List", "Edit", "Add New"],
    Tracking: ["History Tracking", "Live Location"],
    Geofence: ["Add", "All List", "Delete", "Events"],
    Reports: ["View Reports"],
    Settings: ["All Settings"],
};

/** Dummy data awal */
const users = ref<User[]>([
    {
        id: 1,
        name: "admin",
        email: "admin@vetra.xxx",
        username: "admin",
        mobile: "081123456789",
        active: true,
        permissions: { Settings: ["All Settings"] },
    },
]);

/* ---------- Table state ---------- */
const query = ref("");
const page = ref(1);
const perPage = 10;

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return users.value;
    return users.value.filter(
        (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.mobile ?? "").toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q)
    );
});
const maxPage = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)));
const paged = computed(() =>
    filtered.value.slice((page.value - 1) * perPage, page.value * perPage)
);

/* ---------- Modal state ---------- */
const showModal = ref(false);
const editing = ref(false);
const editingId = ref<number | null>(null);

const emptyForm = (): User => ({
    id: Date.now(),
    name: "",
    email: "",
    username: "",
    password: "", // untuk form saja
    mobile: "",
    active: true,
    permissions: {},
});
const form = reactive<User>(emptyForm());

function openCreate() {
    Object.assign(form, emptyForm());
    editing.value = false;
    editingId.value = null;
    showModal.value = true;
}
function openEdit(u: User) {
    Object.assign(form, JSON.parse(JSON.stringify(u)));
    form.password = ""; // kosongkan saat edit
    editing.value = true;
    editingId.value = u.id;
    showModal.value = true;
}
function closeModal() {
    showModal.value = false;
}

/* ---------- Permission helpers ---------- */
function isChecked(moduleName: string, op: string) {
    return !!form.permissions[moduleName]?.includes(op);
}
function togglePerm(moduleName: string, op: string, checked: boolean) {
    const arr = form.permissions[moduleName] ?? [];
    if (checked && !arr.includes(op)) arr.push(op);
    if (!checked) {
        const idx = arr.indexOf(op);
        if (idx >= 0) arr.splice(idx, 1);
    }
    if (arr.length) form.permissions[moduleName] = arr;
    else delete form.permissions[moduleName];
}
function checkAll(state: boolean) {
    if (state) {
        const all: Record<string, string[]> = {};
        Object.entries(PERMISSIONS).forEach(([m, ops]) => (all[m] = [...ops]));
        form.permissions = all;
    } else {
        form.permissions = {};
    }
}

/* ---------- CRUD (mock) ---------- */
function save() {
    if (!form.name || !form.email || !form.username) {
        return alert("Lengkapi Name, Email, dan Username.");
    }
    if (!editing.value && (!form.password || form.password.length < 6)) {
        return alert("Password minimal 6 karakter untuk user baru.");
    }

    // Payload ke server: kirim password hanya jika diisi
    const payload = JSON.parse(JSON.stringify(form)) as User;
    if (!payload.password) delete payload.password;

    // Simpan ke tabel lokal TANPA password
    const { password, ...withoutPwd } = payload;

    if (!editing.value) {
        users.value.unshift(withoutPwd as User);
    } else {
        const idx = users.value.findIndex((u) => u.id === editingId.value);
        if (idx >= 0) users.value[idx] = withoutPwd as User;
    }

    // TODO: ganti bagian atas dengan call API-mu, contoh:
    // await $fetch('/api/users', { method: editing.value ? 'PUT' : 'POST', body: payload })

    closeModal();
}
function remove(id: number) {
    if (!confirm("Hapus user ini?")) return;
    users.value = users.value.filter((u) => u.id !== id);
}
</script>
<style scoped>
/* cards & inputs */
.card {
    border-radius: 1rem; /* rounded-2xl */
    border: 1px solid #e5e7eb; /* border / neutral-200 */
    background-color: #ffffff; /* bg-white */
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
}
.input {
    width: 100%; /* w-full */
    border-radius: 0.75rem; /* rounded-xl */
    border: 1px solid #e5e7eb; /* border-neutral-200 */
    background-color: #ffffff; /* bg-white */
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    outline: none; /* outline-none */
    transition: all 0.2s ease-in-out; /* transition */
}
.input:focus {
    border-color: #9ca3af; /* focus:border-neutral-400 */
    box-shadow: 0 0 0 2px rgb(23 23 23 / 0.1); /* focus:ring-2 ring-neutral-900/10 */
}

/* buttons */
.btn-primary {
    display: inline-flex; /* inline-flex */
    align-items: center; /* items-center */
    justify-content: center; /* justify-center */
    border-radius: 0.75rem; /* rounded-xl */
    background-color: #171717; /* bg-neutral-900 */
    padding: 0.5rem 1rem; /* py-2 px-4 */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    color: #ffffff; /* text-white */
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-primary:hover {
    background-color: #262626;
} /* hover:bg-neutral-800 */
.btn-primary:disabled {
    opacity: 0.5;
} /* disabled:opacity-50 */

.btn-subtle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem; /* rounded-xl */
    border: 1px solid #e5e7eb; /* border */
    padding: 0.375rem 0.75rem; /* py-1.5 px-3 */
    font-size: 0.75rem; /* text-xs */
    font-weight: 500; /* font-medium */
    background-color: #ffffff;
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-subtle:hover {
    background-color: #fafafa;
} /* hover:bg-neutral-50 */
.btn-subtle:disabled {
    opacity: 0.5;
}

.btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem; /* rounded-xl */
    background-color: #dc2626; /* bg-red-600 */
    color: #ffffff; /* text-white */
    padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
    font-size: 0.75rem; /* text-xs */
    font-weight: 500; /* font-medium */
    transition: background-color 0.2s ease-in-out;
}
.btn-danger:hover {
    background-color: #b91c1c;
} /* hover:bg-red-700 */

.btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem; /* rounded-lg */
    border: 1px solid #e5e7eb; /* border */
    padding: 0.25rem 0.75rem; /* py-1 px-3 */
    font-size: 0.875rem; /* text-sm */
    background-color: #ffffff;
    transition: background-color 0.2s ease-in-out;
}
.btn-icon:hover {
    background-color: #fafafa;
} /* hover:bg-neutral-50 */

/* table */
.th {
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    font-size: 0.75rem; /* text-xs */
    font-weight: 600; /* font-semibold */
    color: #404040; /* text-neutral-700 */
    white-space: nowrap; /* whitespace-nowrap */
}
.td {
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    vertical-align: middle; /* align-middle */
}

/* modal transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
