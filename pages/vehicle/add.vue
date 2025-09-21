<!-- pages/vehicle/add.vue -->
<template>
    <div class="min-h-[100dvh] bg-neutral-50 p-4 md:p-6">
        <!-- Header -->
        <div class="mb-4 flex items-center justify-between gap-3">
            <div>
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/vehicle" class="hover:underline">Vehicle</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Add</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Add Vehicle</h1>
                <p class="text-sm text-neutral-500">Create a new vehicle profile.</p>
            </div>

            <!-- Desktop actions -->
            <div class="hidden md:flex gap-2">
                <NuxtLink to="/vehicle" class="btn-primary h-9"> Vehicle List </NuxtLink>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <!-- LEFT: main form -->
                <div class="xl:col-span-2 space-y-4">
                    <!-- General -->
                    <section class="card">
                        <div class="card-hd">
                            <h2 class="card-title">General Information</h2>
                        </div>
                        <div class="card-bd grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Row 1 -->
                            <div>
                                <label class="lbl">Registration Number</label>
                                <input
                                    v-model.trim="form.regNo"
                                    @input="form.regNo = form.regNo.toUpperCase()"
                                    placeholder="Registration Number"
                                    class="input"
                                />
                                <p v-if="errors.regNo" class="err">{{ errors.regNo }}</p>
                            </div>

                            <div>
                                <label class="lbl">Vehicle Name</label>
                                <input
                                    v-model.trim="form.name"
                                    placeholder="Vehicle Name"
                                    class="input"
                                />
                                <p v-if="errors.name" class="err">{{ errors.name }}</p>
                            </div>

                            <!-- Row 2 -->
                            <div>
                                <label class="lbl">Model</label>
                                <input
                                    v-model.trim="form.model"
                                    placeholder="Model"
                                    class="input"
                                />
                                <p v-if="errors.model" class="err">{{ errors.model }}</p>
                            </div>

                            <div>
                                <label class="lbl">Manufactured By</label>
                                <input
                                    v-model.trim="form.manufacturedBy"
                                    placeholder="Manufacturer"
                                    class="input"
                                />
                            </div>

                            <!-- Row 3 -->
                            <div>
                                <label class="lbl">Chassis No</label>
                                <input
                                    v-model.trim="form.chassisNo"
                                    placeholder="Chassis No"
                                    class="input"
                                />
                            </div>

                            <div>
                                <label class="lbl">Engine No</label>
                                <input
                                    v-model.trim="form.engineNo"
                                    placeholder="Engine No"
                                    class="input"
                                />
                            </div>

                            <!-- Row 4 -->
                            <div>
                                <label class="lbl">Truck Index</label>
                                <select v-model="form.truckIndex" class="input">
                                    <option value="" disabled>Select truck index</option>
                                    <option
                                        v-for="opt in truckIndexOptions"
                                        :key="opt"
                                        :value="opt"
                                    >
                                        {{ opt }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label class="lbl">Registration Expiry Date</label>
                                <input type="date" v-model="form.regExpiry" class="input" />
                            </div>

                            <!-- Row 5 -->
                            <div>
                                <label class="lbl">Vehicle Group</label>
                                <select v-model="form.group" class="input">
                                    <option value="" disabled>Select vehicle group</option>
                                    <option v-for="opt in groupOptions" :key="opt" :value="opt">
                                        {{ opt }}
                                    </option>
                                </select>
                            </div>

                            <!-- Color -->
                            <div>
                                <label class="lbl"
                                    >Vehicle Color
                                    <span class="text-xs text-neutral-500">(map pin)</span></label
                                >
                                <div class="flex items-center gap-3">
                                    <input
                                        type="color"
                                        v-model="form.color"
                                        class="h-10 w-14 rounded-md border cursor-pointer"
                                    />
                                    <div class="flex-1 flex items-center gap-2">
                                        <span
                                            class="h-8 w-8 rounded-lg border"
                                            :style="{ background: form.color }"
                                        ></span>
                                        <input
                                            v-model="form.color"
                                            placeholder="#F399EB"
                                            class="input font-mono"
                                        />
                                        <button
                                            type="button"
                                            class="btn-outline px-3"
                                            @click="randomizeColor"
                                        >
                                            Random
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- GPS API -->
                    <section class="card">
                        <div class="card-hd">
                            <h2 class="card-title">
                                GPS API Details
                                <span class="text-xs text-neutral-500">(feed GPS data)</span>
                            </h2>
                        </div>
                        <div class="card-bd grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="md:col-span-2">
                                <label class="lbl">API URL</label>
                                <input
                                    v-model.trim="form.apiUrl"
                                    placeholder="https://localhost:8080/api"
                                    class="input font-mono"
                                />
                                <p class="hint" v-if="!errors.apiUrl">
                                    e.g., https://gps.vendor.com/api
                                </p>
                                <p v-if="errors.apiUrl" class="err">{{ errors.apiUrl }}</p>
                            </div>

                            <div>
                                <label class="lbl">API Password</label>
                                <div class="relative">
                                    <input
                                        :type="showPass ? 'text' : 'password'"
                                        v-model="form.apiPassword"
                                        placeholder="••••••••"
                                        autocomplete="current-password"
                                        class="input pr-12"
                                    />
                                    <button
                                        type="button"
                                        class="abs-toggle"
                                        @click="showPass = !showPass"
                                    >
                                        {{ showPass ? "Hide" : "Show" }}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label class="lbl">API Username</label>
                                <input
                                    v-model.trim="form.apiUsername"
                                    placeholder="API Username"
                                    autocomplete="username"
                                    class="input"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <!-- RIGHT: preview + actions -->
                <aside class="space-y-4">
                    <section class="card p-4 md:p-6">
                        <div class="flex items-center gap-3">
                            <div
                                class="h-12 w-12 rounded-xl border"
                                :style="{ background: form.color }"
                            ></div>
                            <div>
                                <p class="font-medium leading-tight">
                                    {{ form.name || "Vehicle Name" }}
                                </p>
                                <p class="text-xs text-neutral-500">
                                    {{ form.regNo || "REG-0000" }} · {{ form.model || "Model" }}
                                </p>
                            </div>
                        </div>
                        <dl class="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <dt class="text-neutral-500">Truck Index</dt>
                                <dd class="font-medium">{{ form.truckIndex || "-" }}</dd>
                            </div>
                            <div>
                                <dt class="text-neutral-500">Group</dt>
                                <dd class="font-medium">{{ form.group || "-" }}</dd>
                            </div>
                            <div class="col-span-2">
                                <dt class="text-neutral-500">Registration Expiry</dt>
                                <dd class="font-medium">{{ form.regExpiry || "-" }}</dd>
                            </div>
                        </dl>
                    </section>

                    <section class="card p-4 md:p-6">
                        <button
                            type="button"
                            class="btn-primary w-full"
                            :disabled="isSubmitting || !isValid"
                            @click="handleSubmit"
                        >
                            Add Vehicle
                        </button>
                        <button type="button" class="btn-outline w-full mt-2" @click="resetForm">
                            Reset
                        </button>
                    </section>
                </aside>
            </div>

            <!-- Sticky submit (mobile) -->
            <div class="md:hidden sticky bottom-0 inset-x-0 border-t bg-white/80 backdrop-blur p-3">
                <button
                    class="btn-primary w-full"
                    type="submit"
                    :disabled="isSubmitting || !isValid"
                >
                    Add Vehicle
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";

const truckIndexOptions = ["A1", "B2", "C3", "D4"];
const groupOptions = ["Dump Truck", "Excavator", "Pickup", "Dozer"];

const form = reactive({
    regNo: "",
    name: "",
    model: "",
    manufacturedBy: "",
    chassisNo: "",
    engineNo: "",
    truckIndex: "",
    group: "",
    color: "#F399EB",
    regExpiry: "",
    apiUrl: "",
    apiUsername: "",
    apiPassword: "",
});

const showPass = ref(false);
const isSubmitting = ref(false);
const errors = reactive({ regNo: "", name: "", model: "", apiUrl: "" });

const isValid = computed(() => {
    errors.regNo = form.regNo ? "" : "Required";
    errors.name = form.name ? "" : "Required";
    errors.model = form.model ? "" : "Required";
    errors.apiUrl = form.apiUrl
        ? /^https?:\/\/.+/i.test(form.apiUrl)
            ? ""
            : "Valid URL required"
        : "";
    return Object.values(errors).every((v) => !v);
});

function randomizeColor() {
    form.color =
        "#" +
        Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0")
            .toUpperCase();
}

function resetForm() {
    Object.assign(form, {
        regNo: "",
        name: "",
        model: "",
        manufacturedBy: "",
        chassisNo: "",
        engineNo: "",
        truckIndex: "",
        group: "",
        color: "#F399EB",
        regExpiry: "",
        apiUrl: "",
        apiUsername: "",
        apiPassword: "",
    });
}

async function handleSubmit() {
    if (!isValid.value) return;
    isSubmitting.value = true;
    try {
        // TODO: ganti dengan API riil
        const payload = { ...form };
        console.log("Submitting:", payload);
        await new Promise((r) => setTimeout(r, 500));
        alert("Vehicle added!");
        resetForm();
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style scoped>
/* Hanya sedikit CSS; sisanya Tailwind */
.card {
    @apply bg-white rounded-2xl border shadow-sm;
}
.card-hd {
    @apply px-4 md:px-6 pt-4 md:pt-6;
}
.card-bd {
    @apply p-4 md:p-6;
}
.card-title {
    @apply text-base font-semibold;
}

.lbl {
    @apply block text-sm font-medium mb-1;
}
.hint {
    @apply mt-1 text-xs text-neutral-500;
}
.err {
    @apply mt-1 text-xs text-red-600;
}

.input {
    @apply w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition;
}
.btn-primary {
    @apply inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50;
}
.btn-outline {
    @apply inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-neutral-50;
}
.abs-toggle {
    @apply absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-800;
}
</style>
