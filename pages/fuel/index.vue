<!-- File: pages/fuel.vue -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/" class="hover:underline">Dashboard</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Fuel Info</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Fuel Info</h1>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search…"
                    class="input h-9 w-[220px]"
                />
                <button class="btn-primary h-9" @click="scrollToForm">Add Fuel</button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <section class="lg:col-span-8 xl:col-span-8 card" aria-label="Fuel list">
                <div class="flex items-center justify-between p-3 border-b bg-neutral-50/60">
                    <h2 class="font-medium">Records</h2>
                    <span class="text-xs text-neutral-500"
                        >{{ filteredRows.length }} record(s)</span
                    >
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full w-full text-sm">
                        <thead class="bg-neutral-50 text-left text-neutral-700">
                            <tr>
                                <th class="th w-16">S.No</th>
                                <th class="th cursor-pointer" @click="toggleSort('date')">
                                    Fuel Fill Date
                                    <span class="sort" v-if="sort.key === 'date'">{{
                                        sort.dir === "asc" ? "▲" : "▼"
                                    }}</span>
                                </th>
                                <th class="th cursor-pointer" @click="toggleSort('vehicle')">
                                    Vehicle
                                    <span class="sort" v-if="sort.key === 'vehicle'">{{
                                        sort.dir === "asc" ? "▲" : "▼"
                                    }}</span>
                                </th>
                                <th class="th">Quantity</th>
                                <th class="th">Fuel Total Price</th>
                                <th class="th cursor-pointer" @click="toggleSort('driver')">
                                    Fuel Filled By
                                    <span class="sort" v-if="sort.key === 'driver'">{{
                                        sort.dir === "asc" ? "▲" : "▼"
                                    }}</span>
                                </th>
                                <th class="th">Odometer Reading</th>
                                <th class="th">Comments</th>
                                <th class="th text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!filteredRows.length">
                                <td class="td text-center text-neutral-500" colspan="9">
                                    No data available in table
                                </td>
                            </tr>
                            <tr
                                v-for="(row, i) in pageRows"
                                :key="row.id"
                                class="hover:bg-neutral-50"
                            >
                                <td class="td">{{ (page - 1) * pageSize + i + 1 }}</td>
                                <td class="td">{{ row.date }}</td>
                                <td class="td">{{ row.vehicle }}</td>
                                <td class="td">{{ row.quantity.toLocaleString() }} L</td>
                                <td class="td">{{ formatCurrency(row.amount) }}</td>
                                <td class="td">{{ row.driver }}</td>
                                <td class="td">{{ row.odometer.toLocaleString() }} km</td>
                                <td class="td">{{ row.comments }}</td>
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

            <section
                ref="formRef"
                class="lg:col-span-4 xl:col-span-4 card"
                aria-label="Add / Edit Fuel"
            >
                <div class="p-3 border-b bg-neutral-50/60 flex items-center justify-between">
                    <h2 class="font-medium">{{ editingId ? "Edit Fuel" : "Add Fuel" }}</h2>
                    <button v-if="editingId" class="btn-subtle" @click="resetForm">Cancel</button>
                </div>

                <form class="p-4 space-y-4" @submit.prevent="handleSubmit">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="lbl">Vehicle<span class="text-red-600">*</span></label>
                            <select v-model.number="form.vehicleId" class="input">
                                <option :value="0" disabled>Select Vehicle</option>
                                <option v-for="v in vehiclesOpts" :key="v.id" :value="v.id">
                                    {{ v.name }}
                                </option>
                            </select>
                            <p v-if="errors.vehicleId" class="req">{{ errors.vehicleId }}</p>
                        </div>

                        <div>
                            <label class="lbl"
                                >Added Driver<span class="text-red-600">*</span></label
                            >
                            <select v-model="form.driverName" class="input">
                                <option value="" disabled>Select Driver</option>
                                <option v-for="d in driversOpts" :key="d" :value="d">
                                    {{ d }}
                                </option>
                            </select>
                            <p v-if="errors.driverName" class="req">{{ errors.driverName }}</p>
                        </div>

                        <div>
                            <label class="lbl">Fill Date</label>
                            <input v-model="form.date" type="date" class="input" />
                        </div>

                        <div>
                            <label class="lbl"
                                >Quantity (L)<span class="text-red-600">*</span></label
                            >
                            <input
                                v-model.number="form.quantity"
                                type="number"
                                min="0"
                                step="0.01"
                                class="input"
                                placeholder="Quantity"
                            />
                            <p v-if="errors.quantity" class="req">{{ errors.quantity }}</p>
                        </div>

                        <div>
                            <label class="lbl">Odometer Reading</label>
                            <input
                                v-model.number="form.odometer"
                                type="number"
                                min="0"
                                step="1"
                                class="input"
                                placeholder="Odometer Reading"
                            />
                        </div>

                        <div>
                            <label class="lbl">Amount (total price)</label>
                            <input
                                v-model.number="form.amount"
                                type="number"
                                min="0"
                                step="0.01"
                                class="input"
                                placeholder="Amount"
                            />
                        </div>

                        <div class="sm:col-span-2">
                            <label class="lbl">Comment</label>
                            <input
                                v-model.trim="form.comments"
                                type="text"
                                class="input"
                                placeholder="Fuel Comments"
                            />
                        </div>
                    </div>

                    <label class="inline-flex items-center gap-2 text-sm">
                        <input v-model="form.addToExpense" type="checkbox" class="rounded" />
                        <span>Need to add in expense?</span>
                    </label>

                    <div class="pt-2">
                        <button type="submit" class="btn-primary">
                            {{ editingId ? "Update Fuel" : "Add Fuel" }}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

const {
    vehicles,
    drivers,
    fuelRows,
    fuelLogs,
    createFuelLog,
    updateFuelLog,
    removeFuelLog,
    DEFAULT_PRICE_PER_L,
    getCurrentOdo,
    createOdoReading,
} = useFleetDb();

const formRef = ref<HTMLElement | null>(null);
const search = ref("");
const pageSize = 10;
const page = ref(1);

type TableRow = {
    id: number;
    vehicleId: number | null;
    date: string;
    vehicle: string;
    quantity: number;
    amount: number;
    driver: string;
    odometer: number;
    comments: string;
};

const vehiclesOpts = computed(() => vehicles.value.map((v: any) => ({ id: v.id, name: v.name })));
const driversOpts = computed(() => drivers.value.map((d: any) => d.name));
const vehicleNameById = computed(() => {
    const m = new Map<number, string>();
    vehicles.value.forEach((v: any) => m.set(v.id, v.name));
    return m;
});

const tableRows = computed<TableRow[]>(() =>
    fuelRows.value.map((r: any) => {
        const odo = r.vehicleId ? getCurrentOdo(r.vehicleId) : null;
        return {
            id: r.id,
            vehicleId: r.vehicleId ?? null,
            date: "-",
            vehicle: r.name ?? "-",
            quantity: Number(r.tripFuel || 0),
            amount: Number(r.price || 0),
            driver: r.driver ?? "-",
            odometer: Number(odo?.readingKm ?? 0),
            comments: "",
        };
    })
);

const sort = reactive<{ key: keyof TableRow | ""; dir: "asc" | "desc" }>({ key: "", dir: "asc" });
function toggleSort(key: keyof TableRow) {
    if (sort.key === key) sort.dir = sort.dir === "asc" ? "desc" : "asc";
    else {
        sort.key = key;
        sort.dir = "asc";
    }
}

const filteredRows = computed(() => {
    const q = search.value.toLowerCase().trim();
    const base = [...tableRows.value];
    if (sort.key) {
        base.sort((a: any, b: any) => {
            const A = (a[sort.key] ?? "").toString().toLowerCase();
            const B = (b[sort.key] ?? "").toString().toLowerCase();
            if (typeof a[sort.key] === "number" && typeof b[sort.key] === "number") {
                return sort.dir === "asc"
                    ? (a[sort.key] as number) - (b[sort.key] as number)
                    : (b[sort.key] as number) - (a[sort.key] as number);
            }
            return sort.dir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        });
    }
    if (!q) return base;
    return base.filter((r) =>
        [r.date, r.vehicle, r.driver, r.comments].some((v) => v?.toLowerCase().includes(q))
    );
});
const pageRows = computed(() =>
    filteredRows.value.slice((page.value - 1) * pageSize, (page.value - 1) * pageSize + pageSize)
);

const emptyForm = () => ({
    vehicleId: 0 as number,
    driverName: "" as string,
    date: "" as string,
    quantity: undefined as number | undefined,
    amount: undefined as number | undefined,
    odometer: undefined as number | undefined,
    comments: "" as string,
    addToExpense: false as boolean,
});
const form = reactive<ReturnType<typeof emptyForm>>(emptyForm());
const errors = reactive<Record<string, string>>({});
let editingId: number | null = null;

function validate() {
    Object.keys(errors).forEach((k) => delete errors[k]);
    if (!form.vehicleId) errors.vehicleId = "Required";
    if (!form.driverName) errors.driverName = "Required";
    if (form.quantity == null || isNaN(form.quantity as number)) errors.quantity = "Required";
    return Object.keys(errors).length === 0;
}

function pricePerLFromForm() {
    const qty = Number(form.quantity || 0);
    const amt = Number(form.amount || 0);
    if (qty > 0 && amt > 0) return amt / qty;
    return DEFAULT_PRICE_PER_L;
}

function handleSubmit() {
    if (!validate()) return;

    const qty = Number(form.quantity || 0);
    const unitPrice = pricePerLFromForm();

    // cari log fuel existing per vehicle, lalu tambahkan
    const existing = fuelLogs.value.find((x: any) => x.vehicleId === form.vehicleId);
    if (existing) {
        const newQty = Number(existing.tripFuel || 0) + qty;
        const patch: any = { tripFuel: newQty };
        if (unitPrice) patch.pricePerL = unitPrice;
        updateFuelLog(existing.id, patch);
        editingId = existing.id;
    } else {
        createFuelLog({
            vehicleId: form.vehicleId,
            driverName: form.driverName || undefined,
            tripFuel: qty,
            pricePerL: unitPrice || DEFAULT_PRICE_PER_L,
        });
    }

    // catat ODO (hindari error TS dengan memakai vehicleName dan cast)
    const vName = vehicleNameById.value.get(form.vehicleId);
    if (vName && form.odometer != null && !isNaN(form.odometer as number)) {
        (createOdoReading as unknown as (p: any) => any)({
            vehicleName: vName,
            driverName: form.driverName,
            readingKm: Number(form.odometer || 0),
        });
    }

    resetForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function editRow(r: TableRow) {
    form.vehicleId = r.vehicleId || 0;
    form.driverName = r.driver || "";
    form.date = r.date && r.date !== "-" ? r.date : "";
    form.quantity = r.quantity;
    form.amount = r.amount;
    form.odometer = r.odometer || undefined;
    form.comments = r.comments || "";
    form.addToExpense = false;
    editingId = r.id;
    scrollToForm();
}

function removeRow(id: number) {
    removeFuelLog(id);
}

function resetForm() {
    Object.assign(form, emptyForm());
    editingId = null;
}

function scrollToForm() {
    formRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatCurrency(n: number) {
    return (n ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" });
}
</script>

<style scoped>
.card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
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
    background: transparent;
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
    background: transparent;
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
.sort {
    font-size: 10px;
    line-height: 1;
    color: #a3a3a3;
}
</style>
