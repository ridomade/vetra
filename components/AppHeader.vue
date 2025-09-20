<template>
    <!-- Header -->
    <div class="bg-black flex justify-between items-center sticky top-0 z-10 p-2">
        <!-- Icon and Navigation Menu -->
        <div class="flex space-x-4">
            <!-- Icon -->
            <div class="flex items-center text-white space-x-2">
                <img src="/assets/img/icon-png/mitra-white.png" class="w-8" alt="vetra icon" />
                <p class="text-xl">Vetra</p>
            </div>

            <!-- Navigation Menu -->
            <div class="flex items-center justify-center text-white space-x-2 relative">
                <!-- Dashboard -->
                <NuxtLink
                    to="/dashboard"
                    class="relative group flex flex-col items-center justify-center h-12 w-20 cursor-pointer transition-colors duration-300 rounded-md"
                    :class="
                        isActive('/dashboard') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
                    "
                >
                    <img
                        src="/assets/img/icon-svg/dashboard.svg"
                        class="w-[30px] h-5"
                        alt="dashboard"
                    />
                    <p class="text-sm">Dashboard</p>

                    <!-- Sub Navigation -->
                    <div
                        class="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
                    >
                        <ul class="text-sm text-white">
                            <li>
                                <NuxtLink to="/dashboard" class="block px-4 py-2 hover:bg-white/10"
                                    >Load & Unload</NuxtLink
                                >
                            </li>
                            <li>
                                <NuxtLink
                                    to="/dashboard/fuel"
                                    class="block px-4 py-2 hover:bg-white/10"
                                    >Fuel</NuxtLink
                                >
                            </li>
                        </ul>
                    </div>
                </NuxtLink>

                <!-- Vehicle (with submenu) -->
                <NuxtLink
                    to="/vehicle"
                    class="relative group flex flex-col items-center justify-center h-12 w-20 cursor-pointer transition-colors duration-300 rounded-md"
                    :class="
                        isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
                    "
                >
                    <img src="/assets/img/icon-svg/truck.svg" class="w-[30px] h-5" alt="vehicle" />
                    <p class="text-sm">Vehicle</p>

                    <!-- Sub Navigation -->
                    <div
                        class="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
                    >
                        <ul class="text-sm text-white">
                            <li>
                                <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10"
                                    >List Vehicle</NuxtLink
                                >
                            </li>
                            <li>
                                <NuxtLink
                                    to="/vehicle/add"
                                    class="block px-4 py-2 hover:bg-white/10"
                                    >Add Vehicle</NuxtLink
                                >
                            </li>
                            <li>
                                <NuxtLink
                                    to="/vehicle/maintenance"
                                    class="block px-4 py-2 hover:bg-white/10"
                                    >Maintenance</NuxtLink
                                >
                            </li>
                        </ul>
                    </div>
                </NuxtLink>

                <!-- Driver (with submenu) -->
                <div
                    class="relative group flex flex-col items-center justify-center h-12 w-20 cursor-pointer transition-colors duration-300 rounded-md"
                >
                    <img src="/assets/img/icon-svg/driver.svg" class="w-[30px] h-5" alt="driver" />
                    <p class="text-sm">Driver</p>

                    <!-- Sub Navigation -->
                    <div
                        class="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
                    >
                        <ul class="text-sm text-white">
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
                                <NuxtLink
                                    to="/driver/license"
                                    class="block px-4 py-2 hover:bg-white/10"
                                    >License & Compliance</NuxtLink
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const isActive = (path) => route.path === path || route.path.startsWith(path + "/"); // match nested
</script>

<style scoped></style>
