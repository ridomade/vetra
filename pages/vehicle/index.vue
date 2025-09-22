<!-- pages/vehicle/index.vue -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/vehicle" class="hover:underline">Vehicle</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">List</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Vehicle Management</h1>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <select v-model="statusFilter" class="input h-9 w-[160px]">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <div class="relative">
                    <input
                        v-model.trim="q"
                        type="search"
                        class="input h-9 pl-9 w-[220px] md:w-[260px]"
                        placeholder="Search vehicle, reg. no, model…"
                    />
                </div>

                <!-- open Add Vehicle modal -->
                <button class="btn-primary h-9" @click="openVehCreate()">+ Add Vehicle</button>
            </div>
        </div>

        <!-- ====================== ADD/EDIT VEHICLE MODAL ====================== -->
        <transition name="fade">
            <div
                v-if="openVeh"
                class="fixed inset-0 z-50"
                role="dialog"
                aria-modal="true"
                @keydown.esc="closeVehModal"
            >
                <div class="absolute inset-0 bg-black/50" @click.self="closeVehModal"></div>

                <div
                    class="relative mx-auto my-6 w-[96vw] max-w-6xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
                >
                    <!-- Header -->
                    <div class="flex items-start justify-between border-b px-5 py-4">
                        <h3 class="text-lg font-semibold">{{ vehModalTitle }}</h3>
                        <button
                            class="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                            aria-label="Close"
                            @click="closeVehModal"
                        >
                            ✕
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="grid gap-4 p-5 md:grid-cols-[1fr_360px]">
                        <!-- LEFT: form -->
                        <form
                            @submit.prevent="saveVehicle"
                            class="space-y-5 max-h-[75vh] overflow-y-auto pr-1"
                        >
                            <!-- General Information -->
                            <div class="card-section">
                                <h4 class="sec-title">General Information</h4>
                                <div class="grid gap-4 md:grid-cols-2">
                                    <!-- Registration Number -->
                                    <div>
                                        <label class="lbl">Registration Number</label>
                                        <input
                                            v-model.trim="vehForm.regNo"
                                            type="text"
                                            required
                                            placeholder="Registration Number"
                                            class="input"
                                        />
                                        <p v-if="!vehForm.regNo" class="req">Required</p>
                                    </div>

                                    <!-- Vehicle Name -->
                                    <div>
                                        <label class="lbl">Vehicle Name</label>
                                        <input
                                            v-model.trim="vehForm.name"
                                            type="text"
                                            required
                                            placeholder="Vehicle Name"
                                            class="input"
                                        />
                                        <p v-if="!vehForm.name" class="req">Required</p>
                                    </div>

                                    <!-- Model -->
                                    <div>
                                        <label class="lbl">Model</label>
                                        <input
                                            v-model.trim="vehForm.model"
                                            type="text"
                                            required
                                            placeholder="Model"
                                            class="input"
                                        />
                                        <p v-if="!vehForm.model" class="req">Required</p>
                                    </div>

                                    <!-- Manufactured By -->
                                    <div>
                                        <label class="lbl">Manufactured By</label>
                                        <input
                                            v-model.trim="vehForm.manufacturer"
                                            type="text"
                                            placeholder="Manufacturer"
                                            class="input"
                                        />
                                    </div>

                                    <!-- Chassis No -->
                                    <div>
                                        <label class="lbl">Chassis No</label>
                                        <input
                                            v-model.trim="vehForm.chassisNo"
                                            type="text"
                                            placeholder="Chassis No"
                                            class="input"
                                        />
                                    </div>

                                    <!-- Engine No -->
                                    <div>
                                        <label class="lbl">Engine No</label>
                                        <input
                                            v-model.trim="vehForm.engineNo"
                                            type="text"
                                            placeholder="Engine No"
                                            class="input"
                                        />
                                    </div>

                                    <!-- Truck Index -->
                                    <div>
                                        <label class="lbl">Truck Index</label>
                                        <select v-model="vehForm.truckIndex" class="input">
                                            <option value="" disabled>Select truck index</option>
                                            <option
                                                v-for="opt in truckIndexOptions"
                                                :key="opt"
                                                :value="opt"
                                            >
                                                {{ opt }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Vehicle Group -->
                                    <div>
                                        <label class="lbl">Vehicle Group</label>
                                        <select v-model="vehForm.group" class="input">
                                            <option value="" disabled>Select vehicle group</option>
                                            <option v-for="g in groups" :key="g.id" :value="g.name">
                                                {{ g.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Registration Expiry Date -->
                                    <div>
                                        <label class="lbl">Registration Expiry Date</label>
                                        <input
                                            v-model="vehForm.regExpiry"
                                            type="date"
                                            class="input"
                                        />
                                    </div>

                                    <!-- Vehicle Color -->
                                    <div>
                                        <label class="lbl"
                                            >Vehicle Color
                                            <span class="text-xs text-neutral-500"
                                                >(map pin)</span
                                            ></label
                                        >
                                        <div class="flex items-center gap-2">
                                            <input
                                                v-model="vehForm.color"
                                                type="color"
                                                class="h-9 w-12 rounded-md border cursor-pointer"
                                            />
                                            <div
                                                class="h-9 w-9 rounded-md border"
                                                :style="{ backgroundColor: vehForm.color }"
                                            ></div>
                                            <input
                                                v-model.trim="vehForm.color"
                                                type="text"
                                                class="input w-[140px]"
                                                placeholder="#HEX"
                                            />
                                            <button
                                                type="button"
                                                class="btn-subtle"
                                                @click="randomColor"
                                            >
                                                Random
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- GPS API Details -->
                            <div class="card-section">
                                <h4 class="sec-title">
                                    GPS API Details
                                    <span class="text-xs text-neutral-400">(feed GPS data)</span>
                                </h4>
                                <div class="grid gap-4 md:grid-cols-2">
                                    <div class="md:col-span-2">
                                        <label class="lbl">API URL</label>
                                        <input
                                            v-model.trim="vehForm.apiUrl"
                                            type="url"
                                            class="input"
                                            placeholder="https://gps.vendor.com/api"
                                        />
                                        <p class="text-[11px] text-neutral-400 mt-1">
                                            e.g., https://gps.vendor.com/api
                                        </p>
                                    </div>

                                    <div>
                                        <label class="lbl">API Username</label>
                                        <input
                                            v-model.trim="vehForm.apiUsername"
                                            type="text"
                                            class="input"
                                            placeholder="API Username"
                                        />
                                    </div>

                                    <div class="relative">
                                        <label class="lbl">API Password</label>
                                        <input
                                            :type="showPwd ? 'text' : 'password'"
                                            v-model.trim="vehForm.apiPassword"
                                            class="input pr-14"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            class="absolute right-2 top-[34px] text-xs rounded px-2 py-1 border hover:bg-neutral-50"
                                            @click="showPwd = !showPwd"
                                        >
                                            {{ showPwd ? "Hide" : "Show" }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Footer buttons -->
                            <div
                                class="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end"
                            >
                                <button
                                    type="button"
                                    class="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50"
                                    @click="resetVehForm"
                                >
                                    Reset
                                </button>
                                <button type="submit" class="btn-primary" :disabled="!canSaveVeh">
                                    {{ vehIsEdit ? "Save Changes" : "Add Vehicle" }}
                                </button>
                            </div>
                        </form>

                        <!-- RIGHT: preview -->
                        <aside class="space-y-4">
                            <div class="rounded-2xl border bg-white p-4 shadow-sm">
                                <div class="flex items-start gap-3">
                                    <div
                                        class="h-12 w-12 rounded-xl border"
                                        :style="{ backgroundColor: vehForm.color }"
                                    ></div>
                                    <div class="min-w-0">
                                        <h4 class="font-semibold leading-tight truncate">
                                            {{ vehForm.name || "Vehicle Name" }}
                                        </h4>
                                        <p class="text-xs text-neutral-500">
                                            {{ vehForm.regNo || "REG-0000" }} ·
                                            {{ vehForm.model || "Model" }}
                                        </p>
                                    </div>
                                </div>

                                <div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <div class="text-neutral-500">Truck Index</div>
                                    <div class="text-neutral-900">
                                        {{ vehForm.truckIndex || "-" }}
                                    </div>

                                    <div class="text-neutral-500">Registration Expiry</div>
                                    <div class="text-neutral-900">
                                        {{ vehForm.regExpiry || "-" }}
                                    </div>

                                    <div class="text-neutral-500">Group</div>
                                    <div class="text-neutral-900">{{ vehForm.group || "-" }}</div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </transition>

        <!-- ====================== VEHICLES ====================== -->
        <section class="card">
            <!-- Table (Desktop) -->
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-left border-b bg-white/70">
                            <th class="th w-16">S.No</th>
                            <th class="th">
                                <button class="th-btn" @click="setSort('name')">
                                    Vehicle Name <span class="sort">{{ sortIcon("name") }}</span>
                                </button>
                            </th>
                            <th class="th">
                                <button class="th-btn" @click="setSort('regNo')">
                                    Registration Number
                                    <span class="sort">{{ sortIcon("regNo") }}</span>
                                </button>
                            </th>
                            <th class="th">
                                <button class="th-btn" @click="setSort('model')">
                                    Model <span class="sort">{{ sortIcon("model") }}</span>
                                </button>
                            </th>
                            <th class="th">
                                <button class="th-btn" @click="setSort('chassisNo')">
                                    Chassis No <span class="sort">{{ sortIcon("chassisNo") }}</span>
                                </button>
                            </th>
                            <th class="th">
                                <button class="th-btn" @click="setSort('group')">
                                    Group <span class="sort">{{ sortIcon("group") }}</span>
                                </button>
                            </th>
                            <th class="th w-28">
                                <button class="th-btn" @click="setSort('active')">
                                    Status <span class="sort">{{ sortIcon("active") }}</span>
                                </button>
                            </th>
                            <th class="th w-32">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(v, idx) in paginated"
                            :key="v.id"
                            class="border-b last:border-0 hover:bg-neutral-50/70 transition"
                        >
                            <td class="td">{{ (page - 1) * perPage + idx + 1 }}</td>
                            <td class="td font-medium">{{ v.name }}</td>
                            <td class="td font-mono">{{ v.regNo }}</td>
                            <td class="td">{{ v.model }}</td>
                            <td class="td font-mono">{{ v.chassisNo }}</td>
                            <td class="td">{{ v.group }}</td>
                            <td class="td">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                                    :class="
                                        v.active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-neutral-200 text-neutral-700'
                                    "
                                >
                                    {{ v.active ? "Active" : "Inactive" }}
                                </span>
                            </td>
                            <td class="td">
                                <div class="flex items-center gap-2">
                                    <button class="icon-btn" title="View" @click="viewVehicle(v)">
                                        <svg viewBox="0 0 24 24" class="icon">
                                            <path
                                                d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                                            />
                                        </svg>
                                    </button>
                                    <button class="icon-btn" title="Edit" @click="startVehEdit(v)">
                                        <svg viewBox="0 0 24 24" class="icon">
                                            <path
                                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        class="icon-btn"
                                        title="Delete"
                                        @click="deleteVehicle(v)"
                                    >
                                        <svg viewBox="0 0 24 24" class="icon">
                                            <path
                                                d="M6 7h12M9 7V5h6v2m-7 3v9m4-9v9m4-9v9M5 7l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        class="icon-btn"
                                        :title="v.active ? 'Set Inactive' : 'Set Active'"
                                        @click="toggleActive(v)"
                                    >
                                        <svg viewBox="0 0 24 24" class="icon">
                                            <path
                                                d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1-6 6-6-1.4-1.4L11 13.2 8.4 10.6 7 12l4 4z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="paginated.length === 0">
                            <td colspan="8" class="py-8 text-center text-neutral-500">
                                No results found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Cards (Mobile) -->
            <div class="md:hidden divide-y">
                <div v-for="(v, idx) in paginated" :key="v.id" class="p-4">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-sm text-neutral-500">
                                #{{ (page - 1) * perPage + idx + 1 }}
                            </p>
                            <h3 class="text-base font-semibold leading-tight">{{ v.name }}</h3>
                            <p class="text-xs text-neutral-500">
                                Reg. {{ v.regNo }} · {{ v.model }}
                            </p>
                        </div>
                        <span
                            class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                            :class="
                                v.active
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-neutral-200 text-neutral-700'
                            "
                        >
                            {{ v.active ? "Active" : "Inactive" }}
                        </span>
                    </div>

                    <dl class="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <dt class="text-neutral-500">Chassis</dt>
                            <dd class="font-mono">{{ v.chassisNo }}</dd>
                        </div>
                        <div>
                            <dt class="text-neutral-500">Group</dt>
                            <dd>{{ v.group }}</dd>
                        </div>
                    </dl>

                    <div class="mt-3 flex items-center gap-2">
                        <button class="btn-subtle" @click="viewVehicle(v)">View</button>
                        <button class="btn-subtle" @click="startVehEdit(v)">Edit</button>
                        <button class="btn-subtle" @click="toggleActive(v)">
                            {{ v.active ? "Set Inactive" : "Set Active" }}
                        </button>
                        <button class="btn-danger" @click="deleteVehicle(v)">Delete</button>
                    </div>
                </div>

                <div v-if="paginated.length === 0" class="p-6 text-center text-neutral-500">
                    No results found.
                </div>
            </div>

            <!-- Footer: pagination -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
                <div class="text-sm text-neutral-500">
                    Showing <span class="font-medium text-neutral-800">{{ startRow + 1 }}</span
                    >– <span class="font-medium text-neutral-800">{{ endRow }}</span> of
                    <span class="font-medium text-neutral-800">{{ filtered.length }}</span>
                </div>

                <div class="flex items-center gap-2">
                    <select v-model.number="perPage" class="input h-9 w-[90px]">
                        <option :value="5">5 / page</option>
                        <option :value="10">10 / page</option>
                        <option :value="20">20 / page</option>
                        <option :value="vehicles.length">All / page</option>
                    </select>

                    <div class="inline-flex rounded-xl border">
                        <button
                            class="px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="page === 1"
                            @click="page--"
                        >
                            Previous
                        </button>
                        <span class="px-3 py-2 text-sm bg-neutral-900 text-white">{{ page }}</span>
                        <button
                            class="px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="page >= totalPages"
                            @click="page++"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ====================== VEHICLE GROUPS ====================== -->
        <section class="card mt-6">
            <!-- Subheader (Add + Search) -->
            <div class="flex items-center justify-between gap-3 border-b bg-neutral-50 p-3 md:p-4">
                <button class="btn-primary h-9" @click="openCreate()">+ Add Group</button>

                <!-- Group Modal (ADD/EDIT) -->
                <transition name="fade">
                    <div
                        v-if="open"
                        class="fixed inset-0 z-50"
                        role="dialog"
                        aria-modal="true"
                        @keydown.esc="closeModal"
                    >
                        <div class="absolute inset-0 bg-black/50" @click.self="closeModal"></div>

                        <div
                            class="relative mx-auto my-6 w-[92vw] max-w-xl rounded-xl bg-white shadow-xl ring-1 ring-black/5"
                        >
                            <div class="flex items-start justify-between border-b px-5 py-4">
                                <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
                                <button
                                    class="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                                    aria-label="Close"
                                    @click="closeModal"
                                >
                                    ✕
                                </button>
                            </div>

                            <form
                                @submit.prevent="onSubmit"
                                class="px-5 py-4 max-h-[75vh] overflow-y-auto"
                            >
                                <div class="grid gap-4">
                                    <div class="grid items-center gap-2 sm:grid-cols-[120px_1fr]">
                                        <label for="grp-name" class="text-sm text-neutral-600"
                                            >Name</label
                                        >
                                        <input
                                            id="grp-name"
                                            v-model.trim="form.name"
                                            type="text"
                                            required
                                            placeholder="Enter Group Name"
                                            class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                                        />
                                    </div>

                                    <div class="grid items-start gap-2 sm:grid-cols-[120px_1fr]">
                                        <label for="grp-desc" class="text-sm text-neutral-600"
                                            >Description</label
                                        >
                                        <textarea
                                            id="grp-desc"
                                            v-model.trim="form.description"
                                            rows="3"
                                            placeholder="Enter Description"
                                            class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                                        ></textarea>
                                    </div>
                                </div>

                                <div
                                    class="mt-6 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end"
                                >
                                    <button
                                        type="button"
                                        class="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50"
                                        @click="closeModal"
                                    >
                                        Close
                                    </button>
                                    <button type="submit" class="btn-primary">
                                        {{ isEdit ? "Save Changes" : "Save" }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </transition>

                <div class="relative">
                    <input
                        v-model.trim="qG"
                        type="search"
                        class="input h-9 pl-9 w-[220px] md:w-[260px]"
                        placeholder="Search groups…"
                    />
                </div>
            </div>

            <!-- Table (Desktop) -->
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-left border-b bg-white/70">
                            <th class="th w-16">S.No</th>
                            <th class="th">
                                <button class="th-btn" @click="setSortG('name')">
                                    Name <span class="sort">{{ sortIconG("name") }}</span>
                                </button>
                            </th>
                            <th class="th">Description</th>
                            <th class="th w-56">
                                <button class="th-btn" @click="setSortG('createdAt')">
                                    Created Date
                                    <span class="sort">{{ sortIconG("createdAt") }}</span>
                                </button>
                            </th>
                            <th class="th w-28">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(g, idx) in paginatedG"
                            :key="g.id"
                            class="border-b last:border-0 hover:bg-neutral-50/70 transition"
                        >
                            <td class="td">{{ (pageG - 1) * perPageG + idx + 1 }}</td>
                            <td class="td font-medium">{{ g.name }}</td>
                            <td class="td">{{ g.desc }}</td>
                            <td class="td font-mono">{{ g.createdAt }}</td>
                            <td class="td">
                                <div class="flex items-center gap-2">
                                    <button class="icon-btn" title="Edit" @click="startEdit(g)">
                                        <svg viewBox="0 0 24 24" class="icon">
                                            <path
                                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                            />
                                        </svg>
                                    </button>
                                    <button class="icon-btn" title="Delete" @click="deleteGroup(g)">
                                        <svg viewBox="0 0 24 24" class="icon">
                                            <path
                                                d="M6 7h12M9 7V5h6v2m-7 3v9m4-9v9m4-9v9M5 7l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="paginatedG.length === 0">
                            <td colspan="5" class="py-8 text-center text-neutral-500">
                                No group found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Cards (Mobile) -->
            <div class="md:hidden divide-y">
                <div v-for="(g, idx) in paginatedG" :key="g.id" class="p-4">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-sm text-neutral-500">
                                #{{ (pageG - 1) * perPageG + idx + 1 }}
                            </p>
                            <h3 class="text-base font-semibold leading-tight">{{ g.name }}</h3>
                            <p class="text-xs text-neutral-500">{{ g.desc }}</p>
                        </div>
                        <span class="text-xs text-neutral-400 font-mono">{{ g.createdAt }}</span>
                    </div>

                    <div class="mt-3 flex items-center gap-2">
                        <button class="btn-subtle" @click="startEdit(g)">Edit</button>
                        <button class="btn-danger" @click="deleteGroup(g)">Delete</button>
                    </div>
                </div>

                <div v-if="paginatedG.length === 0" class="p-6 text-center text-neutral-500">
                    No group found.
                </div>
            </div>

            <!-- Footer: pagination -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
                <div class="text-sm text-neutral-500">
                    Showing <span class="font-medium text-neutral-800">{{ startRowG + 1 }}</span
                    >– <span class="font-medium text-neutral-800">{{ endRowG }}</span> of
                    <span class="font-medium text-neutral-800">{{ filteredG.length }}</span>
                </div>

                <div class="flex items-center gap-2">
                    <select v-model.number="perPageG" class="input h-9 w-[90px]">
                        <option :value="5">5 / page</option>
                        <option :value="10">10 / page</option>
                        <option :value="20">20 / page</option>
                        <option :value="groups.length">All / page</option>
                    </select>

                    <div class="inline-flex rounded-xl border">
                        <button
                            class="px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="pageG === 1"
                            @click="pageG--"
                        >
                            Previous
                        </button>
                        <span class="px-3 py-2 text-sm bg-neutral-900 text-white">{{ pageG }}</span>
                        <button
                            class="px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
                            :disabled="pageG >= totalPagesG"
                            @click="pageG++"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

/* ========= VEHICLE MODAL ========= */
const openVeh = ref(false);
const vehIsEdit = ref(false);
const vehEditingId = ref(null);
const showPwd = ref(false);

const vehForm = ref({
    // general
    regNo: "",
    name: "",
    model: "",
    manufacturer: "",
    engineNo: "",
    chassisNo: "",
    truckIndex: "",
    group: "",
    regExpiry: "",
    color: "#F399EB",
    // api
    apiUrl: "",
    apiUsername: "",
    apiPassword: "",
});

const vehModalTitle = computed(() => (vehIsEdit.value ? "Edit Vehicle" : "Add Vehicle"));
const canSaveVeh = computed(
    () => !!vehForm.value.regNo && !!vehForm.value.name && !!vehForm.value.model
);

const truckIndexOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];

function resetVehForm() {
    vehForm.value = {
        regNo: "",
        name: "",
        model: "",
        manufacturer: "",
        engineNo: "",
        chassisNo: "",
        truckIndex: "",
        group: "",
        regExpiry: "",
        color: "#F399EB",
        apiUrl: "",
        apiUsername: "",
        apiPassword: "",
    };
    vehEditingId.value = null;
    vehIsEdit.value = false;
    showPwd.value = false;
}
function openVehCreate() {
    resetVehForm();
    openVeh.value = true;
}
function startVehEdit(v) {
    vehIsEdit.value = true;
    vehEditingId.value = v.id;
    vehForm.value = {
        regNo: v.regNo || "",
        name: v.name || "",
        model: v.model || "",
        manufacturer: v.manufacturer || "",
        engineNo: v.engineNo || "",
        chassisNo: v.chassisNo || "",
        truckIndex: v.truckIndex || "",
        group: v.group || "",
        regExpiry: v.regExpiry || "",
        color: v.color || "#F399EB",
        apiUrl: v.apiUrl || "",
        apiUsername: v.apiUsername || "",
        apiPassword: v.apiPassword || "",
    };
    openVeh.value = true;
}
function closeVehModal() {
    openVeh.value = false;
}

function saveVehicle() {
    if (!canSaveVeh.value) return;

    if (vehIsEdit.value && vehEditingId.value != null) {
        const idx = vehicles.value.findIndex((x) => x.id === vehEditingId.value);
        if (idx !== -1) {
            vehicles.value[idx] = {
                ...vehicles.value[idx],
                ...vehForm.value,
            };
        }
    } else {
        const newId = (vehicles.value.at(-1)?.id || 0) + 1;
        vehicles.value.push({
            id: newId,
            active: true,
            ...vehForm.value,
        });
    }
    closeVehModal();
}

function randomColor() {
    const n = Math.floor(Math.random() * 0xffffff);
    vehForm.value.color = `#${n.toString(16).padStart(6, "0").toUpperCase()}`;
}

/* ========= MODAL (ADD/EDIT GROUP) ========= */
const open = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const form = ref({ name: "", description: "" });
const modalTitle = computed(() => (isEdit.value ? "Edit Group" : "Add New Group"));

function resetForm() {
    form.value = { name: "", description: "" };
    editingId.value = null;
    isEdit.value = false;
}
function openCreate() {
    resetForm();
    open.value = true;
}
function startEdit(g) {
    isEdit.value = true;
    editingId.value = g.id;
    form.value = { name: g.name, description: g.desc };
    open.value = true;
}
function closeModal() {
    open.value = false;
}
function formatNow() {
    const pad = (n) => String(n).padStart(2, "0");
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function onSubmit() {
    if (!form.value.name.trim()) return;
    if (isEdit.value && editingId.value != null) {
        const idx = groups.value.findIndex((x) => x.id === editingId.value);
        if (idx !== -1) {
            groups.value[idx] = {
                ...groups.value[idx],
                name: form.value.name.trim(),
                desc: form.value.description.trim(),
            };
        }
    } else {
        const newId = (groups.value.at(-1)?.id || 0) + 1;
        groups.value.push({
            id: newId,
            name: form.value.name.trim(),
            desc: form.value.description.trim(),
            createdAt: formatNow(),
        });
    }
    closeModal();
}

/* Lock scroll if any modal open */
const lockScroll = () => document.documentElement.classList.add("overflow-hidden");
const unlockScroll = () => document.documentElement.classList.remove("overflow-hidden");
const anyModalOpen = computed(() => open.value || openVeh.value);
watch(anyModalOpen, (v) => (v ? lockScroll() : unlockScroll()));
onMounted(() => unlockScroll());
onBeforeUnmount(unlockScroll);

/* ========= DUMMY VEHICLES ========= */
const vehicles = ref([
    {
        id: 1,
        name: "Dump Truck A",
        regNo: "BDG-1234",
        model: "DTX-320",
        chassisNo: "CH-0001",
        group: "Dump Truck",
        active: true,
    },
    {
        id: 2,
        name: "Excavator B",
        regNo: "JKT-2210",
        model: "EX-200",
        chassisNo: "CH-0002",
        group: "Excavator",
        active: true,
    },
    {
        id: 3,
        name: "Pickup C",
        regNo: "BDO-7788",
        model: "PU-150",
        chassisNo: "CH-0003",
        group: "Pickup",
        active: false,
    },
    {
        id: 4,
        name: "Dozer D",
        regNo: "DPS-9981",
        model: "DZ-400",
        chassisNo: "CH-0004",
        group: "Dozer",
        active: true,
    },
    {
        id: 5,
        name: "Dump Truck E",
        regNo: "SBY-4567",
        model: "DTX-330",
        chassisNo: "CH-0005",
        group: "Dump Truck",
        active: true,
    },
    {
        id: 6,
        name: "Excavator F",
        regNo: "MDN-3011",
        model: "EX-210",
        chassisNo: "CH-0006",
        group: "Excavator",
        active: false,
    },
    {
        id: 7,
        name: "Pickup G",
        regNo: "SMG-9910",
        model: "PU-160",
        chassisNo: "CH-0007",
        group: "Pickup",
        active: true,
    },
    {
        id: 8,
        name: "Dozer H",
        regNo: "PLG-4411",
        model: "DZ-420",
        chassisNo: "CH-0008",
        group: "Dozer",
        active: false,
    },
    {
        id: 9,
        name: "Dump Truck I",
        regNo: "BTM-1122",
        model: "DTX-340",
        chassisNo: "CH-0009",
        group: "Dump Truck",
        active: true,
    },
    {
        id: 10,
        name: "Excavator J",
        regNo: "UPG-7654",
        model: "EX-215",
        chassisNo: "CH-0010",
        group: "Excavator",
        active: true,
    },
    {
        id: 11,
        name: "Pickup K",
        regNo: "PKU-1239",
        model: "PU-170",
        chassisNo: "CH-0011",
        group: "Pickup",
        active: true,
    },
    {
        id: 12,
        name: "Dozer L",
        regNo: "JBR-5521",
        model: "DZ-450",
        chassisNo: "CH-0012",
        group: "Dozer",
        active: false,
    },
]);

/* VEHICLE controls */
const q = ref("");
const statusFilter = ref("all"); // all | active | inactive
const sortBy = ref("name");
const sortDir = ref("asc");
const page = ref(1);
const perPage = ref(10);

/* VEHICLE filter + sort + pagination */
const filtered = computed(() => {
    const term = q.value.toLowerCase();
    const stat = statusFilter.value;
    return vehicles.value.filter((v) => {
        const matchQ =
            !term ||
            v.name.toLowerCase().includes(term) ||
            v.regNo.toLowerCase().includes(term) ||
            v.model.toLowerCase().includes(term) ||
            (v.chassisNo || "").toLowerCase().includes(term) ||
            (v.group || "").toLowerCase().includes(term);
        const matchS = stat === "all" ? true : stat === "active" ? v.active : !v.active;
        return matchQ && matchS;
    });
});
const sorted = computed(() => {
    const arr = [...filtered.value];
    const dir = sortDir.value === "asc" ? 1 : -1;
    const key = sortBy.value;
    return arr.sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (typeof av === "string") return av.localeCompare(bv) * dir;
        if (typeof av === "boolean") return (Number(av) - Number(bv)) * dir;
        return (av - bv) * dir;
    });
});
const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / perPage.value)));
const paginated = computed(() => {
    if (page.value > totalPages.value) page.value = totalPages.value;
    const start = (page.value - 1) * perPage.value;
    return sorted.value.slice(start, start + perPage.value);
});
const startRow = computed(() =>
    Math.min((page.value - 1) * perPage.value, filtered.value.length - 1)
);
const endRow = computed(() => Math.min(page.value * perPage.value, filtered.value.length));

/* VEHICLE actions */
function setSort(key) {
    if (sortBy.value === key) sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
    else {
        sortBy.value = key;
        sortDir.value = key === "active" ? "desc" : "asc";
    }
}
const sortIcon = (key) => (sortBy.value !== key ? "" : sortDir.value === "asc" ? "▲" : "▼");

function viewVehicle(v) {
    alert(`View: ${v.name} (${v.regNo})`);
}
function deleteVehicle(v) {
    if (confirm(`Delete "${v.name}"?`))
        vehicles.value = vehicles.value.filter((x) => x.id !== v.id);
}
function toggleActive(v) {
    v.active = !v.active;
}

/* ========= DUMMY GROUPS ========= */
const groups = ref([
    {
        id: 1,
        name: "Dump Truck",
        desc: "Unit untuk hauling material.",
        createdAt: "2022-07-20 03:48:25",
    },
    { id: 2, name: "Excavator", desc: "Penggalian & loading.", createdAt: "2023-03-10 10:12:01" },
    {
        id: 3,
        name: "Pickup",
        desc: "Distribusi ringan area site.",
        createdAt: "2024-01-05 14:22:19",
    },
    { id: 4, name: "Dozer", desc: "Land clearing & leveling.", createdAt: "2025-09-21 07:06:04" },
]);

/* GROUP controls */
const qG = ref("");
const sortByG = ref("name"); // name | createdAt
const sortDirG = ref("asc");
const pageG = ref(1);
const perPageG = ref(10);

/* GROUP filter + sort + pagination */
const filteredG = computed(() => {
    const term = qG.value.toLowerCase();
    return groups.value.filter(
        (g) => !term || g.name.toLowerCase().includes(term) || g.desc.toLowerCase().includes(term)
    );
});
const sortedG = computed(() => {
    const arr = [...filteredG.value];
    const dir = sortDirG.value === "asc" ? 1 : -1;
    const key = sortByG.value;
    return arr.sort((a, b) => String(a[key]).localeCompare(String(b[key])) * dir);
});
const totalPagesG = computed(() => Math.max(1, Math.ceil(sortedG.value.length / perPageG.value)));
const paginatedG = computed(() => {
    if (pageG.value > totalPagesG.value) pageG.value = totalPagesG.value;
    const start = (pageG.value - 1) * perPageG.value;
    return sortedG.value.slice(start, start + perPageG.value);
});
const startRowG = computed(() =>
    Math.min((pageG.value - 1) * perPageG.value, filteredG.value.length - 1)
);
const endRowG = computed(() => Math.min(pageG.value * perPageG.value, filteredG.value.length));

/* GROUP actions */
function setSortG(key) {
    sortByG.value === key
        ? (sortDirG.value = sortDirG.value === "asc" ? "desc" : "asc")
        : ((sortByG.value = key), (sortDirG.value = "asc"));
}
const sortIconG = (key) => (sortByG.value !== key ? "" : sortDirG.value === "asc" ? "▲" : "▼");
function deleteGroup(g) {
    if (confirm(`Delete group "${g.name}"?`)) {
        groups.value = groups.value.filter((x) => x.id !== g.id);
        if (paginatedG.value.length === 0 && pageG.value > 1) pageG.value--;
    }
}
</script>

<style scoped>
/* Minimal CSS; sisanya Tailwind */
.card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    overflow: hidden;
}
.th {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: rgb(64 64 64);
    white-space: nowrap;
}
.th-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: inherit;
    transition: color 0.2s;
}
.th-btn:hover {
    color: rgb(23 23 23);
}
.sort {
    font-size: 0.625rem;
    color: rgb(163 163 163);
}
.td {
    padding: 0.75rem 1rem;
    vertical-align: middle;
}

.input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;
}
.input:focus {
    border-color: #9ca3af;
    box-shadow: 0 0 0 2px rgb(23 23 23 / 0.1);
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background-color: rgb(23 23 23);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    transition: background-color 0.2s;
}
.btn-primary:hover {
    background-color: rgb(38 38 38);
}
.btn-primary:disabled {
    opacity: 0.5;
}

.btn-subtle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    transition: background-color 0.2s;
}
.btn-subtle:hover {
    background-color: rgb(250 250 250);
}

.btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid rgb(254 202 202);
    color: rgb(220 38 38);
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    transition: background-color 0.2s;
}
.btn-danger:hover {
    background-color: rgb(254 242 242);
}

.icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
}
.icon-btn:hover {
    background-color: rgb(245 245 245);
}
.icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Modal form bits */
.card-section {
    @apply rounded-xl border p-4 bg-white/70;
}
.sec-title {
    @apply mb-3 font-medium text-neutral-800;
}
.lbl {
    @apply block text-sm text-neutral-600 mb-1;
}
.req {
    @apply text-xs text-red-600 mt-1;
}
</style>
