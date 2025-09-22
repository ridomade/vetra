<template>
    <header ref="headerRef" class="bg-black sticky top-0 z-50">
        <!-- TOP BAR -->
        <div class="flex items-center md:justify-normal justify-between p-2">
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
            <DesktopNav :active-path="route.path" />
        </div>

        <!-- MOBILE NAV -->
        <MobileNav
            :open="mobileNavOpen"
            :open-key="openKey"
            @toggle-sub="toggleSub"
            @select="handleSubItemClick"
        />
    </header>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import DesktopNav from "~/components/DesktopNav.vue";
import MobileNav from "~/components/MobileNav.vue";

const route = useRoute();

const headerRef = ref(null);
const mobileNavOpen = ref(false);
const openKey = ref(null); // 'dashboard' | 'vehicle' | 'driver' | dst

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

// Klik di luar (untuk menutup mobile nav)
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

    // klik di dalam header?
    if (headerEl && headerEl.contains(e.target)) {
        if (navEl && navEl.contains(e.target)) return; // di dalam nav: biarkan
        return; // klik lain di header: watcher route akan menutup bila berpindah
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
