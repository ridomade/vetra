<template>
    <nav class="hidden md:flex items-center justify-center text-white space-x-2 relative">
        <!-- Dashboard -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/dashboard') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink
                to="/dashboard"
                class="flex flex-col items-center justify-center w-full h-full"
            >
                <img
                    src="/assets/img/icon-svg/dashboard.svg"
                    class="w-[30px] h-5"
                    alt="dashboard"
                />
                <p class="text-sm">Dashboard</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/dashboard" class="block px-4 py-2 hover:bg-white/10">
                            Load & Unload
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/dashboard/fuel" class="block px-4 py-2 hover:bg-white/10">
                            Fuel
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Vehicle -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/truck.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Vehicle</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10"
                            >List Vehicle</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Add Vehicle</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Driver (parent tidak navigate) -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md hover:bg-orange-500"
        >
            <NuxtLink to="/driver" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/driver.svg" class="w-[30px] h-5" alt="driver" />
                <p class="text-sm">Driver</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-52 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/driver" class="block px-4 py-2 hover:bg-white/10"
                            >List Driver</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/driver/add" class="block px-4 py-2 hover:bg-white/10"
                            >Add Driver</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/driver/license" class="block px-4 py-2 hover:bg-white/10">
                            License & Compliance
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Schedule -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/schedule.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Schedule</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10"
                            >Schedule List</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Add Schedule</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Customer -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/customer.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Customer</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10">
                            Customer Management
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Add Customer</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Fuel -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/fuel.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Fuel</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10"
                            >Fuel Management</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Add Fuel</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Reminder -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/reminder.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Reminder</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10">
                            Reminder Management
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Add Reminder</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Load & Unload -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/load.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Load & Unload</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10">
                            Load & Unload Management
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10">
                            Add Load & Unload
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Tracking -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/tracking.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Tracking</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10"
                            >History Tracking</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Live Location</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Geofence -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/geofence.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Geofence</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10"
                            >Add Geofence</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10">
                            Geofence Management
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Geofence Events</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Reports -->
        <div
            class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
            :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
        >
            <NuxtLink to="/vehicle" class="flex flex-col items-center justify-center w-full h-full">
                <img src="/assets/img/icon-svg/report.svg" class="w-[30px] h-5" alt="vehicle" />
                <p class="text-sm">Reports</p>
            </NuxtLink>

            <!-- Sub (hover) -->
            <div
                class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
            >
                <ul class="text-sm text-white py-1">
                    <li>
                        <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10"
                            >Schedule</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Load & Unload</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink to="/vehicle/add" class="block px-4 py-2 hover:bg-white/10"
                            >Fuel</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
const props = defineProps({
    activePath: { type: String, default: "" },
});
const isActive = (path) => props.activePath === path || props.activePath.startsWith(path + "/");
</script>
