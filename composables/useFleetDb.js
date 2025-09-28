// /composables/useFleetDb.js
// Fleet (Vehicles + Groups) + Fuel + Load/Unload + ODO Readings — tanpa TypeScript

import { computed } from "vue";
import { useCustomersDb } from "./useCustomersDb";
import { useDriversDb } from "./useDriversDb";

/* ===== Initial data: Fleet ===== */
const initialVehicles = [
    {
        id: 1,
        name: "Dump Truck CAT 785C",
        regNo: "KTG-4521",
        model: "Caterpillar 785C",
        manufacturer: "Caterpillar",
        engineNo: "",
        chassisNo: "CAT785C-001",
        truckIndex: "",
        group: "Overburden Removal",
        regExpiry: "",
        color: "#F399EB",
        apiUrl: "",
        apiUsername: "",
        apiPassword: "",
        active: true,
    },
    {
        id: 2,
        name: "Dump Truck Komatsu HD785-7",
        regNo: "BJM-8732",
        model: "Komatsu HD785-7",
        manufacturer: "Komatsu",
        engineNo: "",
        chassisNo: "KMT-HD7857-014",
        truckIndex: "",
        group: "Coal Hauling",
        regExpiry: "",
        color: "#F399EB",
        apiUrl: "",
        apiUsername: "",
        apiPassword: "",
        active: true,
    },
    {
        id: 3,
        name: "Dump Truck Hitachi EH5000AC-3",
        regNo: "SMG-3298",
        model: "Hitachi EH5000AC-3",
        manufacturer: "Hitachi",
        engineNo: "",
        chassisNo: "HTC-EH5000-027",
        truckIndex: "",
        group: "Coal Hauling",
        regExpiry: "",
        color: "#F399EB",
        apiUrl: "",
        apiUsername: "",
        apiPassword: "",
        active: true,
    },
    {
        id: 4,
        name: "Dump Truck BelAZ 75710",
        regNo: "PKB-6745",
        model: "BelAZ 75710",
        manufacturer: "BelAZ",
        engineNo: "",
        chassisNo: "BLZ-75710-003",
        truckIndex: "",
        group: "Coal Hauling",
        regExpiry: "",
        color: "#F399EB",
        apiUrl: "",
        apiUsername: "",
        apiPassword: "",
        active: false,
    },
];

const initialGroups = [
    {
        id: 1,
        name: "Coal Hauling",
        desc: "Unit untuk mengangkut batubara dari pit ke ROM atau stockpile.",
        createdAt: "2022-07-20 03:48:25",
    },
    {
        id: 2,
        name: "Overburden Removal",
        desc: "Unit untuk mengupas dan memindahkan lapisan tanah penutup (OB).",
        createdAt: "2024-01-05 14:22:19",
    },
];

/* ===== Utils umum ===== */
const nowStr = () => {
    const pad = (n) => String(n).padStart(2, "0");
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const norm = (s) => (s || "").trim().toLowerCase();
const findByName = (arr, name) => arr.find((x) => norm(x.name) === norm(name));

/* ===== Konstanta Fuel ===== */
const DEFAULT_PRICE_PER_L = 13500;

/* ===== Seed Fuel (berdasar NAMA → dipetakan ke ID di init) ===== */
const initialFuelLogsByName = [
    {
        vehicle: "Dump Truck CAT 785C",
        driver: "Andi Saputra",
        customer: "PT Bara Mega Quantum",
        tripFuel: 1500,
        pricePerL: 13200,
    },
    {
        vehicle: "Dump Truck Komatsu HD785-7",
        driver: "Siti Nurdiana",
        customer: "PT Nusantara Logistik",
        tripFuel: 1100,
        pricePerL: 13500,
    },
    {
        vehicle: "Dump Truck Hitachi EH5000AC-3",
        driver: "Budi Santoso",
        customer: "CV Mitra Abadi",
        tripFuel: 3200,
        pricePerL: 13000,
    },
];

function seedFuelToIds(seed, vehicles, drivers, customers) {
    return seed.map((row, i) => {
        const v = row.vehicle ? findByName(vehicles, row.vehicle) : null;
        const d = row.driver ? findByName(drivers, row.driver) : null;
        const c = row.customer ? findByName(customers, row.customer) : null;
        return {
            id: i + 1,
            vehicleId: v?.id ?? null,
            driverId: d?.id ?? null,
            customerId: c?.id ?? null,
            tripFuel: Number(row.tripFuel ?? 0),
            pricePerL: Number(row.pricePerL ?? DEFAULT_PRICE_PER_L),
        };
    });
}

/* ===== Load/Unload helper ===== */
const TON_IN_KG = 1000;
function tonnageToKg(val) {
    if (val == null) return 0;
    if (typeof val === "number") return Math.max(0, Math.round(val));
    const s = String(val).trim();
    const m = s.match(/([\d.,]+)/);
    const num = m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : 0;
    if (/kg\b/i.test(s)) return Math.max(0, Math.round(num));
    if (/t\b/i.test(s)) return Math.max(0, Math.round(num * TON_IN_KG));
    return Math.max(0, Math.round(num * TON_IN_KG)); // fallback: ton
}

/* ===== Seed Load/Unload (NAMA → ID di init) ===== */
const initialLoadSummaryByName = [
    {
        vehicle: "Dump Truck CAT 785C",
        driver: "Andi Saputra",
        customer: "PT Bara Mega Quantum",
        loadsKg: 14 * TON_IN_KG,
        unloadsKg: 0 * TON_IN_KG,
    },
    {
        vehicle: "Dump Truck Komatsu HD785-7",
        driver: "Siti Nurdiana",
        customer: "PT Nusantara Logistik",
        loadsKg: 12 * TON_IN_KG,
        unloadsKg: 9 * TON_IN_KG,
    },
    {
        vehicle: "Dump Truck Hitachi EH5000AC-3",
        driver: "Budi Santoso",
        customer: "CV Mitra Abadi",
        loadsKg: 18 * TON_IN_KG,
        unloadsKg: 18 * TON_IN_KG,
    },
];

function seedLoadToIds(seed, vehicles, drivers, customers) {
    return seed.map((row, i) => {
        const v = row.vehicle ? findByName(vehicles, row.vehicle) : null;
        const d = row.driver ? findByName(drivers, row.driver) : null;
        const c = row.customer ? findByName(customers, row.customer) : null;
        return {
            id: i + 1,
            vehicleId: v?.id ?? null,
            driverId: d?.id ?? null,
            customerId: c?.id ?? null,
            loadsKg: Math.max(0, Number(row.loadsKg ?? 0)),
            unloadsKg: Math.max(0, Number(row.unloadsKg ?? 0)),
        };
    });
}

/* ===== Seed ODO (NAMA → ID di init) ===== */
const initialOdoByName = [
    {
        vehicle: "Dump Truck CAT 785C",
        driver: "Andi Saputra",
        readingKm: 120_000,
        recordedAt: "2025-09-29T08:00:00Z",
    },
    {
        vehicle: "Dump Truck Komatsu HD785-7",
        driver: "Siti Nurdiana",
        readingKm: 85_500,
        recordedAt: "2025-09-29T09:30:00Z",
    },
    {
        vehicle: "Dump Truck Hitachi EH5000AC-3",
        driver: "Budi Santoso",
        readingKm: 210_300,
        recordedAt: "2025-09-29T10:15:00Z",
    },
];

function seedOdoToIds(seed, vehicles, drivers) {
    return seed.map((row, i) => {
        const v = row.vehicle ? findByName(vehicles, row.vehicle) : null;
        const d = row.driver ? findByName(drivers, row.driver) : null;
        return {
            id: i + 1,
            vehicleId: v?.id ?? null,
            driverId: d?.id ?? null,
            readingKm: Math.max(0, Number(row.readingKm ?? 0)),
            recordedAt: row.recordedAt || new Date().toISOString(),
        };
    });
}

/* ===== Composable ===== */
export const useFleetDb = () => {
    /* ========= Master: customers & drivers ========= */
    const { customers } = useCustomersDb();
    const { drivers } = useDriversDb();

    /* ========= Fleet state ========= */
    const vehicles = useState("vehicles", () => [...initialVehicles]);
    const groups = useState("groups", () => [...initialGroups]);

    const vehNextId = useState(
        "veh-next-id",
        () => Math.max(0, ...initialVehicles.map((v) => v.id)) + 1
    );
    const grpNextId = useState(
        "grp-next-id",
        () => Math.max(0, ...initialGroups.map((g) => g.id)) + 1
    );

    /* ========= Fuel state (ID-based) ========= */
    const fuelLogs = useState("fuel-logs", () => {
        const seeded = seedFuelToIds(
            initialFuelLogsByName,
            initialVehicles, // mapping awal pakai initial
            drivers.value,
            customers.value
        );
        const next = seeded.length ? Math.max(...seeded.map((x) => x.id)) + 1 : 1;
        useState("fuel-next-id", () => next);
        return seeded;
    });
    const fuelNextId = useState("fuel-next-id", () => 1);

    /* ========= Load/Unload state ========= */
    const loadEntries = useState("load-entries", () => {
        const seeded = seedLoadToIds(
            initialLoadSummaryByName,
            initialVehicles,
            drivers.value,
            customers.value
        );
        const next = seeded.length ? Math.max(...seeded.map((x) => x.id)) + 1 : 1;
        useState("load-next-id", () => next);
        return seeded;
    });
    const loadNextId = useState("load-next-id", () => 1);

    /* ========= ODO state ========= */
    const odoLogs = useState("odo-logs", () => {
        const seeded = seedOdoToIds(initialOdoByName, initialVehicles, drivers.value);
        const next = seeded.length ? Math.max(...seeded.map((x) => x.id)) + 1 : 1;
        useState("odo-next-id", () => next);
        return seeded;
    });
    const odoNextId = useState("odo-next-id", () => 1);

    /* ========= Master maps ========= */
    const vehicleMap = computed(() => {
        const m = new Map();
        vehicles.value.forEach((v) => m.set(v.id, v));
        return m;
    });
    const driverMap = computed(() => {
        const m = new Map();
        drivers.value.forEach((d) => m.set(d.id, d));
        return m;
    });
    const customerMap = computed(() => {
        const m = new Map();
        customers.value.forEach((c) => m.set(c.id, c));
        return m;
    });

    /* ========= Fuel rows & totals ========= */
    const fuelRows = computed(() =>
        fuelLogs.value.map((log) => {
            const v = vehicleMap.value.get(log.vehicleId) || {};
            const d = driverMap.value.get(log.driverId) || {};
            const c = customerMap.value.get(log.customerId) || {};

            const tripFuel = Math.max(0, Number(log.tripFuel ?? 0));
            const pricePerL = Math.max(0, Number(log.pricePerL ?? DEFAULT_PRICE_PER_L));
            const price = Math.round(tripFuel * pricePerL);

            return {
                id: log.id,
                vehicleId: log.vehicleId ?? null, // <— tambahkan: untuk filter per kendaraan
                id_customer: c?.id ?? null,
                name: v?.name ?? "-", // vehicle name
                driver: d?.name ?? "-", // driver name
                tripFuel,
                pricePerL,
                price,
            };
        })
    );

    const totalTripFuel = computed(() =>
        fuelRows.value.reduce((acc, r) => acc + (r.tripFuel || 0), 0)
    );
    const totalPrice = computed(() => fuelRows.value.reduce((acc, r) => acc + (r.price || 0), 0));

    /* ========= Load/Unload rows & stats ========= */
    const loadRows = computed(() =>
        loadEntries.value.map((row) => {
            const v = vehicleMap.value.get(row.vehicleId) || {};
            const d = driverMap.value.get(row.driverId) || {};
            const c = customerMap.value.get(row.customerId) || {};

            const loads = Math.max(0, Number(row.loadsKg || 0));
            const unloads = Math.max(0, Number(row.unloadsKg || 0));
            const backlog = Math.max(0, loads - unloads);
            const completion = loads > 0 ? (unloads / loads) * 100 : 0;

            return {
                id: row.id,
                vehicleId: row.vehicleId ?? null, // <— untuk filter per kendaraan
                id_customer: c?.id ?? null,
                name: v?.name ?? "-",
                driver: d?.name ?? "-",
                loads,
                unloads,
                backlog,
                completion,
            };
        })
    );

    const totalVehicle = computed(() => loadRows.value.length);
    const totalLoads = computed(() => loadRows.value.reduce((s, r) => s + (r.loads || 0), 0));
    const totalUnloads = computed(() => loadRows.value.reduce((s, r) => s + (r.unloads || 0), 0));
    const avgCompletion = computed(() => {
        const list = loadRows.value;
        return list.length ? list.reduce((s, r) => s + (r.completion || 0), 0) / list.length : 0;
    });

    /* ========= ODO rows & helpers ========= */
    const odoRows = computed(() =>
        odoLogs.value
            .map((row) => {
                const v = vehicleMap.value.get(row.vehicleId) || {};
                const d = driverMap.value.get(row.driverId) || {};
                const readingKm = Math.max(0, Number(row.readingKm || 0));
                return {
                    id: row.id,
                    vehicleId: row.vehicleId ?? null,
                    name: v?.name ?? "-",
                    driver: d?.name ?? "-",
                    readingKm,
                    recordedAt: row.recordedAt || new Date().toISOString(),
                };
            })
            // urut terbaru dulu (recordedAt desc, lalu id desc)
            .sort((a, b) => {
                const ta = +new Date(a.recordedAt);
                const tb = +new Date(b.recordedAt);
                if (tb !== ta) return tb - ta;
                return (b.id || 0) - (a.id || 0);
            })
    );

    // Map: vehicleId -> reading ODO terkini
    const currentOdoMap = computed(() => {
        const m = new Map();
        for (const r of odoRows.value) {
            if (!r.vehicleId) continue;
            if (!m.has(r.vehicleId)) m.set(r.vehicleId, r);
        }
        return m;
    });

    const getCurrentOdo = (vehicleId) => currentOdoMap.value.get(vehicleId) || null;

    /* ========= Vehicles API ========= */
    const listVehicles = () => vehicles.value;
    const getVehicle = (id) => vehicles.value.find((v) => v.id === id);
    const createVehicle = (payload = {}) => {
        const {
            regNo = "",
            name = "",
            model = "",
            manufacturer = "",
            engineNo = "",
            chassisNo = "",
            truckIndex = "",
            group = "",
            regExpiry = "",
            color = "#F399EB",
            apiUrl = "",
            apiUsername = "",
            apiPassword = "",
            active = true,
        } = payload;
        const item = {
            id: vehNextId.value++,
            regNo,
            name,
            model,
            manufacturer,
            engineNo,
            chassisNo,
            truckIndex,
            group,
            regExpiry,
            color,
            apiUrl,
            apiUsername,
            apiPassword,
            active,
        };
        vehicles.value.push(item);
        return item;
    };
    const updateVehicle = (id, patch = {}) => {
        const i = vehicles.value.findIndex((v) => v.id === id);
        if (i !== -1) vehicles.value[i] = { ...vehicles.value[i], ...patch };
    };
    const removeVehicle = (id) => {
        vehicles.value = vehicles.value.filter((v) => v.id !== id);
        fuelLogs.value = fuelLogs.value.filter((x) => x.vehicleId !== id);
        loadEntries.value = loadEntries.value.filter((x) => x.vehicleId !== id);
        odoLogs.value = odoLogs.value.filter((x) => x.vehicleId !== id);
    };
    const toggleVehicleActive = (id) => {
        const v = getVehicle(id);
        if (v) v.active = !v.active;
    };

    /* ========= Groups API ========= */
    const listGroups = () => groups.value;
    const getGroup = (id) => groups.value.find((g) => g.id === id);
    const createGroup = (payload = {}) => {
        const { name = "", desc = "", createdAt = nowStr() } = payload;
        const g = { id: grpNextId.value++, name, desc, createdAt };
        groups.value.push(g);
        return g;
    };
    const updateGroup = (id, patch = {}) => {
        const i = groups.value.findIndex((g) => g.id === id);
        if (i !== -1) groups.value[i] = { ...groups.value[i], ...patch };
    };
    const removeGroup = (id) => {
        groups.value = groups.value.filter((g) => g.id !== id);
    };

    /* ========= Fuel CRUD ========= */
    const createFuelLog = (payload = {}) => {
        const {
            vehicleId = null,
            driverId = null,
            customerId = null,
            tripFuel = 0,
            pricePerL = DEFAULT_PRICE_PER_L,
            vehicleName,
            driverName,
            customerName,
        } = payload;

        let vId = vehicleId;
        let dId = driverId;
        let cId = customerId;

        if (!vId && vehicleName) {
            const v = findByName(vehicles.value, vehicleName);
            if (v) vId = v.id;
        }
        if (!dId && driverName) {
            const d = findByName(drivers.value, driverName);
            if (d) dId = d.id;
        }
        if (!cId && customerName) {
            const c = findByName(customers.value, customerName);
            if (c) cId = c.id;
        }

        const item = {
            id: fuelNextId.value++,
            vehicleId: vId,
            driverId: dId,
            customerId: cId,
            tripFuel: Number(tripFuel ?? 0),
            pricePerL: Number(pricePerL ?? DEFAULT_PRICE_PER_L),
        };
        fuelLogs.value.unshift(item);
        return item;
    };

    const updateFuelLog = (id, patch = {}) => {
        const i = fuelLogs.value.findIndex((x) => x.id === id);
        if (i === -1) return;

        let merged = { ...fuelLogs.value[i], ...patch };

        if (patch.vehicleName && !patch.vehicleId) {
            const v = findByName(vehicles.value, patch.vehicleName);
            if (v) merged.vehicleId = v.id;
        }
        if (patch.driverName && !patch.driverId) {
            const d = findByName(drivers.value, patch.driverName);
            if (d) merged.driverId = d.id;
        }
        if (patch.customerName && !patch.customerId) {
            const c = findByName(customers.value, patch.customerName);
            if (c) merged.customerId = c.id;
        }

        if ("tripFuel" in merged) merged.tripFuel = Number(merged.tripFuel ?? 0);
        if ("pricePerL" in merged)
            merged.pricePerL = Number(merged.pricePerL ?? DEFAULT_PRICE_PER_L);

        fuelLogs.value[i] = merged;
    };

    const removeFuelLog = (id) => {
        fuelLogs.value = fuelLogs.value.filter((x) => x.id !== id);
    };

    /* ========= Load/Unload CRUD / Utils ========= */
    const findLoadEntryIndex = (vehicleId, customerId) =>
        loadEntries.value.findIndex(
            (x) => x.vehicleId === vehicleId && x.customerId === customerId
        );

    const setLoadSummary = ({
        vehicleId,
        customerId,
        driverId = null,
        loadsKg = 0,
        unloadsKg = 0,
        vehicleName,
        customerName,
        driverName,
    } = {}) => {
        let vId = vehicleId;
        let cId = customerId;
        let dId = driverId;

        if (!vId && vehicleName) {
            const v = findByName(vehicles.value, vehicleName);
            if (v) vId = v.id;
        }
        if (!cId && customerName) {
            const c = findByName(customers.value, customerName);
            if (c) cId = c.id;
        }
        if (!dId && driverName) {
            const d = findByName(drivers.value, driverName);
            if (d) dId = d.id;
        }

        const idx = findLoadEntryIndex(vId, cId);
        const payload = {
            id: idx === -1 ? loadNextId.value++ : loadEntries.value[idx].id,
            vehicleId: vId,
            customerId: cId,
            driverId: dId,
            loadsKg: Math.max(0, Number(loadsKg || 0)),
            unloadsKg: Math.max(0, Number(unloadsKg || 0)),
        };

        if (idx === -1) loadEntries.value.unshift(payload);
        else loadEntries.value[idx] = payload;

        return payload;
    };

    const recordLoad = ({
        vehicleId,
        customerId,
        driverId = null,
        tonnage,
        vehicleName,
        customerName,
        driverName,
    } = {}) => {
        const kg = tonnageToKg(tonnage);
        const idx = setLoadSummary({
            vehicleId,
            customerId,
            driverId,
            vehicleName,
            customerName,
            driverName,
            loadsKg: 0,
            unloadsKg: 0,
        });
        const i = findLoadEntryIndex(idx.vehicleId ?? vehicleId, idx.customerId ?? customerId);
        if (i !== -1) loadEntries.value[i].loadsKg += kg;
    };

    const recordUnload = ({
        vehicleId,
        customerId,
        driverId = null,
        tonnage,
        vehicleName,
        customerName,
        driverName,
    } = {}) => {
        const kg = tonnageToKg(tonnage);
        const idx = setLoadSummary({
            vehicleId,
            customerId,
            driverId,
            vehicleName,
            customerName,
            driverName,
            loadsKg: 0,
            unloadsKg: 0,
        });
        const i = findLoadEntryIndex(idx.vehicleId ?? vehicleId, idx.customerId ?? customerId);
        if (i !== -1) loadEntries.value[i].unloadsKg += kg;
    };

    const removeLoadEntry = (id) => {
        loadEntries.value = loadEntries.value.filter((x) => x.id !== id);
    };

    /* ========= ODO CRUD ========= */
    const createOdoReading = ({
        vehicleId = null,
        driverId = null,
        readingKm = 0,
        recordedAt = new Date().toISOString(),
        vehicleName,
        driverName,
        force = false, // jika false, cegah turun dibanding current
    } = {}) => {
        let vId = vehicleId;
        let dId = driverId;

        if (!vId && vehicleName) {
            const v = findByName(vehicles.value, vehicleName);
            if (v) vId = v.id;
        }
        if (!dId && driverName) {
            const d = findByName(drivers.value, driverName);
            if (d) dId = d.id;
        }

        const current = getCurrentOdo(vId);
        let value = Math.max(0, Number(readingKm || 0));
        if (current && !force) value = Math.max(current.readingKm || 0, value);

        const item = {
            id: odoNextId.value++,
            vehicleId: vId,
            driverId: dId,
            readingKm: value,
            recordedAt: recordedAt || new Date().toISOString(),
        };
        odoLogs.value.unshift(item);
        return item;
    };

    const updateOdoReading = (id, patch = {}) => {
        const i = odoLogs.value.findIndex((x) => x.id === id);
        if (i === -1) return;

        let merged = { ...odoLogs.value[i], ...patch };

        if (patch.vehicleName && !patch.vehicleId) {
            const v = findByName(vehicles.value, patch.vehicleName);
            if (v) merged.vehicleId = v.id;
        }
        if (patch.driverName && !patch.driverId) {
            const d = findByName(drivers.value, patch.driverName);
            if (d) merged.driverId = d.id;
        }
        if ("readingKm" in merged) merged.readingKm = Math.max(0, Number(merged.readingKm || 0));
        if (!merged.recordedAt) merged.recordedAt = new Date().toISOString();

        odoLogs.value[i] = merged;
    };

    const removeOdoReading = (id) => {
        odoLogs.value = odoLogs.value.filter((x) => x.id !== id);
    };

    /* ========= Reset ========= */
    const resetFleet = () => {
        vehicles.value = [...initialVehicles];
        groups.value = [...initialGroups];
        vehNextId.value = Math.max(0, ...vehicles.value.map((v) => v.id)) + 1;
        grpNextId.value = Math.max(0, ...groups.value.map((g) => g.id)) + 1;

        const seededFuel = seedFuelToIds(
            initialFuelLogsByName,
            vehicles.value,
            drivers.value,
            customers.value
        );
        fuelLogs.value = seededFuel;
        fuelNextId.value = (seededFuel.length ? Math.max(...seededFuel.map((x) => x.id)) : 0) + 1;

        const seededLoad = seedLoadToIds(
            initialLoadSummaryByName,
            vehicles.value,
            drivers.value,
            customers.value
        );
        loadEntries.value = seededLoad;
        loadNextId.value = (seededLoad.length ? Math.max(...seededLoad.map((x) => x.id)) : 0) + 1;

        const seededOdo = seedOdoToIds(initialOdoByName, vehicles.value, drivers.value);
        odoLogs.value = seededOdo;
        odoNextId.value = (seededOdo.length ? Math.max(...seededOdo.map((x) => x.id)) : 0) + 1;
    };

    /* ========= Expose ========= */
    return {
        // master
        customers,
        drivers,

        // state
        vehicles,
        groups,

        // Vehicles API
        listVehicles,
        getVehicle,
        createVehicle,
        updateVehicle,
        removeVehicle,
        toggleVehicleActive,

        // Groups API
        listGroups,
        getGroup,
        createGroup,
        updateGroup,
        removeGroup,

        // Fuel
        fuelLogs,
        fuelRows,
        createFuelLog,
        updateFuelLog,
        removeFuelLog,
        totalTripFuel,
        totalPrice,
        DEFAULT_PRICE_PER_L,

        // Load/Unload
        loadRows,
        totalVehicle,
        totalLoads,
        totalUnloads,
        avgCompletion,
        setLoadSummary,
        recordLoad,
        recordUnload,
        removeLoadEntry,

        // ODO
        odoLogs,
        odoRows,
        createOdoReading,
        updateOdoReading,
        removeOdoReading,
        getCurrentOdo,

        // Utils
        resetFleet,
    };
};
