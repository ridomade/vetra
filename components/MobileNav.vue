<template>
    <transition name="fade">
        <nav
            v-if="open"
            id="mobile-nav"
            class="md:hidden border-t border-white/10 bg-neutral-950 text-white"
        >
            <ul class="py-2">
                <!-- Dashboard -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'dashboard')"
                        :aria-expanded="openKey === 'dashboard' ? 'true' : 'false'"
                        aria-controls="sub-dashboard"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/dashboard.svg"
                                class="w-[30px] h-5"
                                alt="dashboard"
                            />
                            <span>Dashboard</span>
                        </span>
                        <span>{{ openKey === "dashboard" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-dashboard"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'dashboard' ? 'max-h-64' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/dashboard"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Load & Unload
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/dashboard/fuel"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Fuel
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Vehicle -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'vehicle')"
                        :aria-expanded="openKey === 'vehicle' ? 'true' : 'false'"
                        aria-controls="sub-vehicle"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/truck.svg"
                                class="w-[30px] h-5"
                                alt="vehicle"
                            />
                            <span>Vehicle</span>
                        </span>
                        <span>{{ openKey === "vehicle" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-vehicle"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'vehicle' ? 'max-h-72' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/vehicle"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Vehicle Management
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Driver -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'driver')"
                        :aria-expanded="openKey === 'driver' ? 'true' : 'false'"
                        aria-controls="sub-driver"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/driver.svg"
                                class="w-[30px] h-5"
                                alt="driver"
                            />
                            <span>Driver</span>
                        </span>
                        <span>{{ openKey === "driver" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-driver"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'driver' ? 'max-h-72' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/driver"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    List Driver
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Schedule -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'schedule')"
                        :aria-expanded="openKey === 'schedule' ? 'true' : 'false'"
                        aria-controls="sub-schedule"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/schedule.svg"
                                class="w-[30px] h-5"
                                alt="schedule"
                            />
                            <span>Schedule</span>
                        </span>
                        <span>{{ openKey === "schedule" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-schedule"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'schedule' ? 'max-h-64' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/schedule"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Schedule Management
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Customer -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'customer')"
                        :aria-expanded="openKey === 'customer' ? 'true' : 'false'"
                        aria-controls="sub-customer"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/customer.svg"
                                class="w-[30px] h-5"
                                alt="customer"
                            />
                            <span>Customer</span>
                        </span>
                        <span>{{ openKey === "customer" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-customer"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'customer' ? 'max-h-64' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/customer"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Customer Management
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Fuel -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'fuel')"
                        :aria-expanded="openKey === 'fuel' ? 'true' : 'false'"
                        aria-controls="sub-fuel"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/fuel.svg"
                                class="w-[30px] h-5"
                                alt="fuel"
                            />
                            <span>Fuel</span>
                        </span>
                        <span>{{ openKey === "fuel" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-fuel"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'fuel' ? 'max-h-64' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/fuel"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Fuel Management
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Reminder -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'reminder')"
                        :aria-expanded="openKey === 'reminder' ? 'true' : 'false'"
                        aria-controls="sub-reminder"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/reminder.svg"
                                class="w-[30px] h-5"
                                alt="reminder"
                            />
                            <span>Reminder</span>
                        </span>
                        <span>{{ openKey === "reminder" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-reminder"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'reminder' ? 'max-h-64' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/reminder"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Reminder Management
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Load & Unload -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'load-unload')"
                        :aria-expanded="openKey === 'load-unload' ? 'true' : 'false'"
                        aria-controls="sub-load-unload"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/load.svg"
                                class="w-[30px] h-5"
                                alt="load-unload"
                            />
                            <span>Load & Unload</span>
                        </span>
                        <span>{{ openKey === "load-unload" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-load-unload"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'load-unload' ? 'max-h-64' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/load-unload"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Load & Unload Management
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Tracking -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'tracking')"
                        :aria-expanded="openKey === 'tracking' ? 'true' : 'false'"
                        aria-controls="sub-tracking"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/tracking.svg"
                                class="w-[30px] h-5"
                                alt="tracking"
                            />
                            <span>Tracking</span>
                        </span>
                        <span>{{ openKey === "tracking" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-tracking"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'tracking' ? 'max-h-64' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/tracking"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Live Tracking
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/tracking/history"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Tracking History
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Geofence -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'geofence')"
                        :aria-expanded="openKey === 'geofence' ? 'true' : 'false'"
                        aria-controls="sub-geofence"
                    >
                        <span class="flex items-center gap-2">
                            <img
                                src="/assets/img/icon-svg/geofence.svg"
                                class="w-[30px] h-5"
                                alt="geofence"
                            />
                            <span>Geofence</span>
                        </span>
                        <span>{{ openKey === "geofence" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-geofence"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'geofence' ? 'max-h-72' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/geofence/add"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Add Geofence
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/geofence"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Geofence Management
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/geofence/events"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Geofence Events
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Reports -->
                <li>
                    <button
                        class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                        @click="$emit('toggle-sub', 'reports')"
                        :aria-expanded="openKey === 'reports' ? 'true' : 'false'"
                        aria-controls="sub-reports"
                    >
                        <span class="flex items-center gap-2">
                            <!-- Pastikan nama file icon sesuai case di filesystem (report.svg vs Report.svg) -->
                            <img
                                src="/assets/img/icon-svg/report.svg"
                                class="w-[30px] h-5"
                                alt="reports"
                            />
                            <span>Reports</span>
                        </span>
                        <span>{{ openKey === "reports" ? "−" : "+" }}</span>
                    </button>
                    <div
                        id="sub-reports"
                        class="overflow-hidden transition-all duration-300"
                        :class="openKey === 'reports' ? 'max-h-72' : 'max-h-0'"
                    >
                        <ul class="text-sm">
                            <li>
                                <NuxtLink
                                    to="/reports/schedule"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Schedule
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/reports/load-unload"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Load & Unload
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/reports/fuel"
                                    class="block px-12 py-2 hover:bg-white/10"
                                    @click="$emit('select')"
                                >
                                    Fuel
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </nav>
    </transition>
</template>

<script setup>
defineProps({
    open: { type: Boolean, default: false },
    openKey: { type: String, default: null },
});
defineEmits(["toggle-sub", "select"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
