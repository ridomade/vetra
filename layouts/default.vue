<template>
    <div class="min-h-screen bg-neutral-50">
        <AppHeader />
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup>
import AppHeader from "~/components/AppHeader.vue";
</script>

<style scoped></style>
