// /composables/useScheduleDb.js
// Schedules/Trips + CRUD, tanpa TypeScript. Terintegrasi dengan Customers, Drivers, dan Fleet.

import { computed, watch } from "vue";
import { useCustomersDb } from "./useCustomersDb";
import { useDriversDb } from "./useDriversDb";
import { useFleetDb } from "./useFleetDb";

/* ===== Master constants ===== */
const TRIP_TYPES = [
    "Coal Hauling (Single Trip)",
    "Coal Hauling (Round Trip)",
    "Overburden Removal",
];
const TRIP_STATUSES = ["Yet to Start", "Ongoing", "Completed", "Cancelled"];

/* ===== Initial data (seed) ===== */
const initialSchedules = [
    {
        id: 1,
        customer: "PT Bara Mega Quantum",
        vehicle: "Dump Truck CAT 785C",
        type: "Coal Hauling (Single Trip)",
        driver: "Andi Saputra",
        status: "Yet to Start",
        startLocation: "Pit A",
        endLocation: "ROM 1",
        startDate: "2025-10-01",
        endDate: "2025-10-01",
        tonnage: "120T",
        km: 12,
        email: "ops@baramega.co.id",
        sendEmail: false,
    },
    {
        id: 2,
        customer: "PT Nusantara Logistik",
        vehicle: "Dump Truck Komatsu HD785-7",
        type: "Coal Hauling (Round Trip)",
        driver: "Siti Nurdiana",
        status: "Ongoing",
        startLocation: "ROM 1",
        endLocation: "Stockpile B",
        startDate: "2025-10-02",
        endDate: "2025-10-02",
        tonnage: "85T",
        km: 18,
        email: "hello@nusantara.co.id",
        sendEmail: false,
    },
    {
        id: 3,
        customer: "CV Mitra Abadi",
        vehicle: "Dump Truck Hitachi EH5000AC-3",
        type: "Overburden Removal",
        driver: "Budi Santoso",
        status: "Completed",
        startLocation: "Pit C",
        endLocation: "OB Disposal Area",
        startDate: "2025-09-30",
        endDate: "2025-09-30",
        tonnage: "300T",
        km: 10,
        email: "sales@mitraabadi.id",
        sendEmail: false,
    },
];

/* ===== Helpers ===== */
const norm = (s) => (s || "").trim().toLowerCase();
const findByName = (arr, name) => arr.find((x) => norm(x.name) === norm(name));
const findByEmail = (arr, email) => arr.find((x) => norm(x.email || "") === norm(email || ""));

// Lengkapi ID berdasarkan nama (saat bootstrap awal)
function attachIdsFromNames(item, customers, vehicles, drivers) {
    const c = item.customer ? findByName(customers, item.customer) : null;
    const v = item.vehicle ? findByName(vehicles, item.vehicle) : null;
    const d = item.driver ? findByName(drivers, item.driver) : null;
    return {
        ...item,
        customerId: item.customerId ?? c?.id ?? null,
        vehicleId: item.vehicleId ?? v?.id ?? null,
        driverId: item.driverId ?? d?.id ?? null,
    };
}

// Terjemahkan ID → nama/email (saat create/update)
function hydrateFromIds(payload, customers, vehicles, drivers) {
    const p = { ...payload };

    if (!p.customer && p.customerId) {
        const c = customers.find((x) => x.id === p.customerId);
        if (c) {
            p.customer = c.name;
            if (!p.email) p.email = c.email || "";
        }
    }
    if (!p.vehicle && p.vehicleId) {
        const v = vehicles.find((x) => x.id === p.vehicleId);
        if (v) p.vehicle = v.name;
    }
    if (!p.driver && p.driverId) {
        const d = drivers.find((x) => x.id === p.driverId);
        if (d) p.driver = d.name;
    }
    return p;
}

/* Jika schedule lama belum punya ID, coba isi:
 * 1) customers: by email → by name
 * 2) vehicles/drivers: by name
 */
function ensureIdsForAll(schedules, customers, vehicles, drivers) {
    schedules.forEach((s) => {
        if (!s.customerId) {
            const cByEmail = s.email ? findByEmail(customers, s.email) : null;
            const c = cByEmail || (s.customer ? findByName(customers, s.customer) : null);
            if (c) s.customerId = c.id;
        }
        if (!s.vehicleId && s.vehicle) {
            const v = findByName(vehicles, s.vehicle);
            if (v) s.vehicleId = v.id;
        }
        if (!s.driverId && s.driver) {
            const d = findByName(drivers, s.driver);
            if (d) s.driverId = d.id;
        }
    });
}

/* ===== Composable ===== */
export const useScheduleDb = () => {
    // Master DBs
    const { customers } = useCustomersDb();
    const { drivers } = useDriversDb();
    const { vehicles } = useFleetDb();

    // State schedules: normalize awal → tambahkan ID berdasarkan nama
    const schedules = useState("schedules", () => {
        const cust = customers.value;
        const vehs = vehicles.value;
        const drvs = drivers.value;
        return initialSchedules.map((s) => attachIdsFromNames(s, cust, vehs, drvs));
    });

    const schNextId = useState(
        "sch-next-id",
        () => Math.max(0, ...initialSchedules.map((s) => s.id)) + 1
    );

    /* ===== Opsi dropdown (terupdate otomatis) ===== */
    const customerOptions = computed(() =>
        customers.value.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email || "",
            status: c.status,
        }))
    );
    const vehicleNames = computed(() => vehicles.value.map((v) => v.name));
    const driverNames = computed(() => drivers.value.map((d) => d.name));

    /* ===== Sinkronisasi saat master berubah =====
     * - Pastikan semua schedule punya ID (ensureIdsForAll)
     * - Selaraskan nama/email tampilan dari master berdasarkan ID
     * - Gunakan immediate: true agar langsung sinkron saat halaman dibuka
     */
    const syncFromCustomers = () => {
        ensureIdsForAll(schedules.value, customers.value, vehicles.value, drivers.value);
        const cmap = new Map(customers.value.map((c) => [c.id, c]));
        schedules.value.forEach((s) => {
            if (s.customerId && cmap.has(s.customerId)) {
                const c = cmap.get(s.customerId);
                s.customer = c.name; // nama di tabel ikut berubah
                if (!s.email) s.email = c.email || ""; // isi email jika belum ada
            }
        });
    };
    const syncFromVehicles = () => {
        ensureIdsForAll(schedules.value, customers.value, vehicles.value, drivers.value);
        const vmap = new Map(vehicles.value.map((v) => [v.id, v]));
        schedules.value.forEach((s) => {
            if (s.vehicleId && vmap.has(s.vehicleId)) {
                s.vehicle = vmap.get(s.vehicleId).name;
            }
        });
    };
    const syncFromDrivers = () => {
        ensureIdsForAll(schedules.value, customers.value, vehicles.value, drivers.value);
        const dmap = new Map(drivers.value.map((d) => [d.id, d]));
        schedules.value.forEach((s) => {
            if (s.driverId && dmap.has(s.driverId)) {
                s.driver = dmap.get(s.driverId).name;
            }
        });
    };

    watch(customers, syncFromCustomers, { deep: true, immediate: true });
    watch(vehicles, syncFromVehicles, { deep: true, immediate: true });
    watch(drivers, syncFromDrivers, { deep: true, immediate: true });

    /* ===== Queries ===== */
    const listSchedules = () => schedules.value;
    const getSchedule = (id) => schedules.value.find((s) => s.id === id);

    /* ===== Create ===== */
    const createSchedule = (payload = {}) => {
        let hydrated = { ...payload };

        // Jika user kirim nama, cari ID dari master
        if (!hydrated.customerId && hydrated.customer) {
            const c = findByName(customers.value, hydrated.customer);
            if (c) hydrated.customerId = c.id;
        }
        if (!hydrated.vehicleId && hydrated.vehicle) {
            const v = findByName(vehicles.value, hydrated.vehicle);
            if (v) hydrated.vehicleId = v.id;
        }
        if (!hydrated.driverId && hydrated.driver) {
            const d = findByName(drivers.value, hydrated.driver);
            if (d) hydrated.driverId = d.id;
        }

        // Isi nama/email dari ID agar seragam
        hydrated = hydrateFromIds(hydrated, customers.value, vehicles.value, drivers.value);

        const {
            customer = "",
            vehicle = "",
            driver = "",
            customerId = null,
            vehicleId = null,
            driverId = null,
            type = "",
            status = "Yet to Start",
            startLocation = "",
            endLocation = "",
            startDate = "",
            endDate = "",
            tonnage = "",
            km = undefined,
            email = "",
            sendEmail = false,
        } = hydrated;

        const item = {
            id: schNextId.value++,
            customerId,
            vehicleId,
            driverId,
            customer,
            vehicle,
            driver,
            type,
            status,
            startLocation,
            endLocation,
            startDate,
            endDate,
            tonnage,
            km,
            email,
            sendEmail,
        };

        schedules.value.unshift(item);
        return item;
    };

    /* ===== Update ===== */
    const updateSchedule = (id, patch = {}) => {
        const i = schedules.value.findIndex((s) => s.id === id);
        if (i === -1) return;

        let merged = { ...schedules.value[i], ...patch };

        // Normalisasi: kalau user patch nama tanpa ID, cari ID
        if (!merged.customerId && merged.customer) {
            const c = findByName(customers.value, merged.customer);
            if (c) merged.customerId = c.id;
        }
        if (!merged.vehicleId && merged.vehicle) {
            const v = findByName(vehicles.value, merged.vehicle);
            if (v) merged.vehicleId = v.id;
        }
        if (!merged.driverId && merged.driver) {
            const d = findByName(drivers.value, merged.driver);
            if (d) merged.driverId = d.id;
        }

        // Setelah punya ID, isi nama/email dari master agar sinkron
        merged = hydrateFromIds(merged, customers.value, vehicles.value, drivers.value);
        schedules.value[i] = merged;
    };

    /* ===== Delete ===== */
    const removeSchedule = (id) => {
        schedules.value = schedules.value.filter((s) => s.id !== id);
    };

    /* ===== Set status ===== */
    const setScheduleStatus = (id, status) => {
        if (!TRIP_STATUSES.includes(status)) return;
        const s = getSchedule(id);
        if (s) s.status = status;
    };

    /* ===== Reset ===== */
    const resetSchedules = () => {
        const cust = customers.value;
        const vehs = vehicles.value;
        const drvs = drivers.value;
        schedules.value = initialSchedules.map((s) => attachIdsFromNames(s, cust, vehs, drvs));
        schNextId.value = Math.max(0, ...schedules.value.map((s) => s.id)) + 1;
        // Pastikan langsung sinkron tampilan
        syncFromCustomers();
        syncFromVehicles();
        syncFromDrivers();
    };

    return {
        // state
        schedules,

        // master options
        tripTypes: TRIP_TYPES,
        tripStatuses: TRIP_STATUSES,
        customerOptions,
        vehicleNames,
        driverNames,

        // APIs
        listSchedules,
        getSchedule,
        createSchedule,
        updateSchedule,
        removeSchedule,
        setScheduleStatus,

        // utils
        resetSchedules,
    };
};
