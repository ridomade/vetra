// /composables/useCustomersDb.js
// Customers + fungsi CRUD, tanpa TypeScript.

const initialCustomers = [
    {
        id: 1,
        name: "PT Mitra Batunusa",
        mobile: "08123847234",
        email: "made@gmail.com",
        address: "Jl. Soekarno-Hatta No. 120, Kiaracondong, Bandung",
        status: "Inactive",
    },
    {
        id: 2,
        name: "PT Nusantara Logistik",
        mobile: "08153018321",
        email: "hello@nusantara.co.id",
        address: "Jl. Jend. Sudirman Kav. 52-53, Tanah Abang, Jakarta Pusat",
        status: "Active",
    },
    {
        id: 3,
        name: "CV Mitra Abadi",
        mobile: "082198765432",
        email: "sales@mitraabadi.id",
        address: "Jl. Pangeran Antasari No. 45, Samarinda Ulu, Samarinda",
        status: "Active",
    },
    {
        id: 4,
        name: "PT Bara Mega Quantum",
        mobile: "081355577788",
        email: "ops@baramega.co.id",
        address: "Jl. MT Haryono No. 88, Balikpapan Selatan, Balikpapan",
        status: "Active",
    },
];

const CUSTOMER_STATUSES = ["Active", "Inactive"];

export const useCustomersDb = () => {
    // state global per sesi SPA
    const customers = useState("customers", () => [...initialCustomers]);
    const custNextId = useState(
        "cust-next-id",
        () => Math.max(0, ...initialCustomers.map((c) => c.id)) + 1
    );

    // Queries
    const listCustomers = () => customers.value;
    const getCustomer = (id) => customers.value.find((c) => c.id === id);

    // Create
    const createCustomer = (payload = {}) => {
        const { name = "", mobile = "", email = "", address = "", status = "Active" } = payload;

        const item = { id: custNextId.value++, name, mobile, email, address, status };
        customers.value.unshift(item); // tampilkan terbaru di atas
        return item;
    };

    // Update
    const updateCustomer = (id, patch = {}) => {
        const i = customers.value.findIndex((c) => c.id === id);
        if (i !== -1) customers.value[i] = { ...customers.value[i], ...patch };
    };

    // Delete
    const removeCustomer = (id) => {
        customers.value = customers.value.filter((c) => c.id !== id);
    };

    // Toggle status
    const toggleCustomerStatus = (id) => {
        const c = getCustomer(id);
        if (!c) return;
        c.status = c.status === "Active" ? "Inactive" : "Active";
    };

    // Reset opsional
    const resetCustomers = () => {
        customers.value = [...initialCustomers];
        custNextId.value = Math.max(0, ...customers.value.map((c) => c.id)) + 1;
    };

    return {
        // state
        customers,
        customerStatuses: CUSTOMER_STATUSES,
        // APIs
        listCustomers,
        getCustomer,
        createCustomer,
        updateCustomer,
        removeCustomer,
        toggleCustomerStatus,
        // utils
        resetCustomers,
    };
};
