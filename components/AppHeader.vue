<template>
    <header ref="headerRef" class="bg-black sticky top-0 z-50">
        <!-- TOP BAR -->
        <div class="flex items-center md:justify-normal justify-between p-2">
            <!-- Navbar -->

            <!-- Brand -->
            <NuxtLink to="/" class="flex items-center space-x-2 text-white">
                <img
                    src="/assets/img/icon-png/mitra-white.png"
                    class="md:w-8 w-6"
                    alt="vetra icon"
                />
                <p class="hidden md:flex text-xl">Vetra</p>
            </NuxtLink>

            <!-- Hamburger (mobile) -->
            <button
                class="md:hidden inline-flex items-center justify-center w-10 h-10 text-white rounded hover:bg-white/10"
                @click.stop="toggleMobile()"
                :aria-expanded="mobileNavOpen ? 'true' : 'false'"
                aria-controls="mobile-nav"
                data-toggle="mobile-nav"
                title="Toggle navigation"
            >
                <span v-if="!mobileNavOpen" class="text-2xl">≡</span>
                <span v-else class="text-2xl">✕</span>
            </button>

            <!-- DESKTOP NAV -->
            <nav class="hidden md:flex items-center justify-center text-white space-x-2 relative">
                <!-- Dashboard -->
                <div
                    class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md"
                    :class="
                        isActive('/dashboard') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
                    "
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
                    :class="
                        isActive('/vehicle') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
                    "
                >
                    <NuxtLink
                        to="/vehicle"
                        class="flex flex-col items-center justify-center w-full h-full"
                    >
                        <img
                            src="/assets/img/icon-svg/truck.svg"
                            class="w-[30px] h-5"
                            alt="vehicle"
                        />
                        <p class="text-sm">Vehicle</p>
                    </NuxtLink>

                    <!-- Sub (hover) -->
                    <div
                        class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-44 pointer-events-none group-hover:pointer-events-auto"
                    >
                        <ul class="text-sm text-white py-1">
                            <li>
                                <NuxtLink to="/vehicle" class="block px-4 py-2 hover:bg-white/10">
                                    List Vehicle
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/vehicle/add"
                                    class="block px-4 py-2 hover:bg-white/10"
                                >
                                    Add Vehicle
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Driver (parent tidak navigate) -->
                <div
                    class="relative group flex flex-col items-center justify-center h-12 w-24 cursor-pointer transition-colors duration-300 rounded-md hover:bg-orange-500"
                >
                    <div class="flex flex-col items-center justify-center w-full h-full">
                        <img
                            src="/assets/img/icon-svg/driver.svg"
                            class="w-[30px] h-5"
                            alt="driver"
                        />
                        <p class="text-sm">Driver</p>
                    </div>

                    <!-- Sub (hover) -->
                    <div
                        class="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-neutral-900 rounded-lg shadow-lg border border-white/10 backdrop-blur-md w-52 pointer-events-none group-hover:pointer-events-auto"
                    >
                        <ul class="text-sm text-white py-1">
                            <li>
                                <NuxtLink to="/driver" class="block px-4 py-2 hover:bg-white/10">
                                    List Driver
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/driver/add"
                                    class="block px-4 py-2 hover:bg-white/10"
                                >
                                    Add Driver
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/driver/license"
                                    class="block px-4 py-2 hover:bg-white/10"
                                >
                                    License & Compliance
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

        <!-- MOBILE NAV -->
        <transition name="fade">
            <nav
                v-if="mobileNavOpen"
                id="mobile-nav"
                class="md:hidden border-t border-white/10 bg-neutral-950 text-white"
            >
                <ul class="py-2">
                    <!-- Dashboard -->
                    <li>
                        <button
                            class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                            @click="toggleSub('dashboard')"
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
                                        @click="handleSubItemClick()"
                                    >
                                        Load & Unload
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink
                                        to="/dashboard/fuel"
                                        class="block px-12 py-2 hover:bg-white/10"
                                        @click="handleSubItemClick()"
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
                            @click="toggleSub('vehicle')"
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
                                        @click="handleSubItemClick()"
                                    >
                                        List Vehicle
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink
                                        to="/vehicle/add"
                                        class="block px-12 py-2 hover:bg-white/10"
                                        @click="handleSubItemClick()"
                                    >
                                        Add Vehicle
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <!-- Driver -->
                    <li>
                        <button
                            class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10"
                            @click="toggleSub('driver')"
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
                                        @click="handleSubItemClick()"
                                    >
                                        List Driver
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink
                                        to="/driver/add"
                                        class="block px-12 py-2 hover:bg-white/10"
                                        @click="handleSubItemClick()"
                                    >
                                        Add Driver
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink
                                        to="/driver/license"
                                        class="block px-12 py-2 hover:bg-white/10"
                                        @click="handleSubItemClick()"
                                    >
                                        License & Compliance
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </transition>
    </header>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const headerRef = ref(null);
const mobileNavOpen = ref(false);
const openKey = ref(null); // 'dashboard' | 'vehicle' | 'driver' | null

const isActive = (path) => route.path === path || route.path.startsWith(path + "/");

function toggleMobile() {
    mobileNavOpen.value = !mobileNavOpen.value;
    if (!mobileNavOpen.value) openKey.value = null;
}

function toggleSub(key) {
    openKey.value = openKey.value === key ? null : key;
}

function handleSubItemClick() {
    mobileNavOpen.value = false;
    openKey.value = null;
}

// Tutup saat route berubah
watch(
    () => route.fullPath,
    () => {
        mobileNavOpen.value = false;
        openKey.value = null;
    }
);

// Klik di luar: jangan tutup jika klik pada tombol toggle atau di dalam header
function onDocClick(e) {
    if (!mobileNavOpen.value) return;

    const headerEl = headerRef.value;
    const navEl = document.getElementById("mobile-nav");
    const path = e.composedPath?.() || [];

    // klik pada tombol hamburger?
    const clickedToggle = !!path.find(
        (el) => el && el.dataset && el.dataset.toggle === "mobile-nav"
    );
    if (clickedToggle) return;

    // klik di dalam header (brand/topbar/nav)?
    if (headerEl && headerEl.contains(e.target)) {
        // jika klik di dalam mobile nav, biarkan terbuka
        if (navEl && navEl.contains(e.target)) return;
        // jika bukan di dalam nav, boleh biarkan (user mungkin akan klik link brand yang mengubah route)
        // route change sudah menutup menu via watcher
        return;
    }

    // klik di luar semuanya -> tutup
    mobileNavOpen.value = false;
    openKey.value = null;
}

// Tutup pakai Escape
function onKeyDown(e) {
    if (e.key === "Escape" && mobileNavOpen.value) {
        mobileNavOpen.value = false;
        openKey.value = null;
    }
}

onMounted(() => {
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("keydown", onKeyDown);
});
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
