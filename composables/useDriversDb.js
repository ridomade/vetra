// /composables/useDriversDb.js
// Drivers (tanpa TypeScript)

const initialDrivers = [
    {
        id: 1,
        name: "Andi Saputra",
        mobile: "08123123123",
        age: 34,
        licenseNo: "6201123456789012",
        licenseExpDate: "2025-11-20",
        dateOfJoining: "2024-03-15",
        address: "Bandung",
        experience: 8,
        notes: "Night shift",
        status: "Active",
    },
    {
        id: 2,
        name: "Siti Nurdiana",
        mobile: "08129876543",
        age: 30,
        licenseNo: "3175098765432100",
        licenseExpDate: "2026-02-11",
        dateOfJoining: "2024-06-01",
        address: "Samarinda",
        experience: 6,
        notes: "Day shift",
        status: "Active",
    },
    {
        id: 3,
        name: "Budi Santoso",
        mobile: "085712345678",
        age: 37,
        licenseNo: "6472098765432199",
        licenseExpDate: "2025-12-30",
        dateOfJoining: "2023-11-20",
        address: "Kutai Kartanegara",
        experience: 10,
        notes: "Berpengalaman di HD785-7 & EH5000",
        status: "Active",
    },
];

const DRIVER_STATUSES = ["Active", "Inactive"];

export const useDriversDb = () => {
    const drivers = useState("drivers", () => [...initialDrivers]);
    const drvNextId = useState(
        "drv-next-id",
        () => Math.max(0, ...initialDrivers.map((d) => d.id)) + 1
    );

    const listDrivers = () => drivers.value;
    const getDriver = (id) => drivers.value.find((d) => d.id === id);
    const createDriver = (payload = {}) => {
        const {
            name = "",
            mobile = "",
            age = undefined,
            licenseNo = "",
            licenseExpDate = "",
            dateOfJoining = "",
            address = "",
            experience = undefined,
            notes = "",
            status = "Active",
        } = payload;
        const item = {
            id: drvNextId.value++,
            name,
            mobile,
            age,
            licenseNo,
            licenseExpDate,
            dateOfJoining,
            address,
            experience,
            notes,
            status,
        };
        drivers.value.unshift(item); // tampilkan terbaru di atas
        return item;
    };
    const updateDriver = (id, patch = {}) => {
        const i = drivers.value.findIndex((d) => d.id === id);
        if (i !== -1) drivers.value[i] = { ...drivers.value[i], ...patch };
    };
    const removeDriver = (id) => {
        drivers.value = drivers.value.filter((d) => d.id !== id);
    };
    const toggleDriverStatus = (id) => {
        const d = getDriver(id);
        if (d) d.status = d.status === "Active" ? "Inactive" : "Active";
    };

    const resetDrivers = () => {
        drivers.value = [...initialDrivers];
        drvNextId.value = Math.max(0, ...drivers.value.map((d) => d.id)) + 1;
    };

    return {
        // state
        drivers,
        driverStatuses: DRIVER_STATUSES,
        // APIs
        listDrivers,
        getDriver,
        createDriver,
        updateDriver,
        removeDriver,
        toggleDriverStatus,
        // utils
        resetDrivers,
    };
};
