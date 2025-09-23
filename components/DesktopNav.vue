<template>
    <nav class="hidden md:flex relative text-white items-center w-full justify-between pl-10">
        <div class="flex space-x-2">
            <!-- Dashboard -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                :class="
                    isActive('/dashboard/load-unload') || isActive('/dashboard/fuel')
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-orange-500'
                "
            >
                <NuxtLink
                    to="/dashboard/load-unload"
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
                            <NuxtLink
                                to="/dashboard/load-unload"
                                class="block px-4 py-2 hover:bg-white/10"
                            >
                                Load & Unload
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/dashboard/fuel"
                                class="block px-4 py-2 hover:bg-white/10"
                            >
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
                <NuxtLink
                    to="/vehicle"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img src="/assets/img/icon-svg/truck.svg" class="w-[30px] h-5" alt="vehicle" />
                    <p class="text-sm">Vehicle</p>
                </NuxtLink>
            </div>

            <!-- Driver (parent tidak navigate) -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md hover:bg-orange-500"
                :class="isActive('/driver') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
            >
                <NuxtLink
                    to="/driver"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img src="/assets/img/icon-svg/driver.svg" class="w-[30px] h-5" alt="driver" />
                    <p class="text-sm">Driver</p>
                </NuxtLink>
            </div>

            <!-- Schedule -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                :class="isActive('/schedule') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
            >
                <NuxtLink
                    to="/schedule"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img
                        src="/assets/img/icon-svg/schedule.svg"
                        class="w-[30px] h-5"
                        alt="vehicle"
                    />
                    <p class="text-sm">Schedule</p>
                </NuxtLink>
            </div>

            <!-- Customer -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                :class="isActive('/customer') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
            >
                <NuxtLink
                    to="/customer"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img
                        src="/assets/img/icon-svg/customer.svg"
                        class="w-[30px] h-5"
                        alt="vehicle"
                    />
                    <p class="text-sm">Customer</p>
                </NuxtLink>
            </div>

            <!-- Fuel -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                :class="isActive('/fuel') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
            >
                <NuxtLink
                    to="/fuel"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img src="/assets/img/icon-svg/fuel.svg" class="w-[30px] h-5" alt="vehicle" />
                    <p class="text-sm">Fuel</p>
                </NuxtLink>
            </div>

            <!-- Reminder -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                :class="isActive('/reminder') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
            >
                <NuxtLink
                    to="/reminder"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img
                        src="/assets/img/icon-svg/reminder.svg"
                        class="w-[30px] h-5"
                        alt="vehicle"
                    />
                    <p class="text-sm">Reminder</p>
                </NuxtLink>
            </div>

            <!-- Load & Unload -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                :class="
                    isActive('/load-unload') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
                "
            >
                <NuxtLink
                    to="/load-unload"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img src="/assets/img/icon-svg/load.svg" class="w-[30px] h-5" alt="vehicle" />
                    <p class="text-sm">Load & Unload</p>
                </NuxtLink>
            </div>

            <!-- Tracking -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                :class="isActive('/tracking') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
            >
                <NuxtLink
                    to="/tracking"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img
                        src="/assets/img/icon-svg/tracking.svg"
                        class="w-[30px] h-5"
                        alt="vehicle"
                    />
                    <p class="text-sm">Tracking</p>
                </NuxtLink>

                <div
                    class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
                >
                    <ul class="text-sm text-white py-1">
                        <li>
                            <NuxtLink to="/tracking" class="block px-4 py-2 hover:bg-white/10"
                                >Live Tracking</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink
                                to="/tracking/history"
                                class="block px-4 py-2 hover:bg-white/10"
                            >
                                Tracking History
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Geofence -->
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                :class="isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
            >
                <NuxtLink
                    to="/vehicle"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img
                        src="/assets/img/icon-svg/geofence.svg"
                        class="w-[30px] h-5"
                        alt="vehicle"
                    />
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
                <NuxtLink
                    to="/vehicle"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
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
        </div>
        <!-- USER SETTING -->
        <div class="flex">
            <div
                class="relative group flex flex-col items-center justify-center h-12 w-12 cursor-pointer transition-colors duration-300 rounded-md"
                :class="isActive('/setting') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'"
            >
                <NuxtLink
                    to="/setting"
                    class="flex flex-col items-center justify-center w-full h-full"
                >
                    <img
                        src="/assets/img/icon-svg/setting.svg"
                        class="w-[30px] h-5"
                        alt="vehicle"
                    />
                </NuxtLink>
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
