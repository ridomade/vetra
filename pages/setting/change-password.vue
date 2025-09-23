<template>
    <div class="page-center">
        <div class="w-full max-w-3xl">
            <!-- header -->
            <div class="text-center mb-4">
                <nav class="text-sm text-neutral-500 mb-1">
                    <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
                    <span class="mx-1">/</span>
                    <span class="text-neutral-900">Change Admin Password</span>
                </nav>
                <h1 class="text-2xl font-semibold tracking-tight">Change Admin Password</h1>
                <p class="text-sm text-neutral-500 mt-1">Masukkan password baru dan konfirmasi.</p>
            </div>
        </div>

        <!-- Card -->
        <div class="card p-4 md:p-6 max-w-3xl">
            <form class="grid gap-5" @submit.prevent="submit">
                <!-- New password -->
                <div>
                    <label class="lbl">Password Baru</label>
                    <div class="relative">
                        <input
                            :type="showNew ? 'text' : 'password'"
                            v-model="form.newPassword"
                            class="input pr-10"
                            placeholder="Masukkan password baru"
                            autocomplete="new-password"
                            @input="touched = true"
                        />
                        <button type="button" class="eye-btn" @click="showNew = !showNew">
                            {{ showNew ? "🙈" : "👁️" }}
                        </button>
                    </div>

                    <!-- Strength meter -->
                    <div class="mt-3">
                        <div class="h-2 rounded-full bg-neutral-100 overflow-hidden">
                            <div
                                class="h-full transition-all duration-300"
                                :style="{ width: strengthPct + '%', background: strengthColor }"
                            />
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                            <Req :ok="lenOK" label="≥ 8 karakter" />
                            <Req :ok="upperOK" label="Huruf besar" />
                            <Req :ok="lowerOK" label="Huruf kecil" />
                            <Req :ok="numOK" label="Angka" />
                            <Req :ok="symOK" label="Simbol" />
                        </div>
                    </div>
                </div>

                <!-- Confirm -->
                <div>
                    <label class="lbl">Konfirmasi Password</label>
                    <div class="relative">
                        <input
                            :type="showConfirm ? 'text' : 'password'"
                            v-model="form.confirm"
                            class="input pr-10"
                            placeholder="Ulangi password baru"
                            autocomplete="new-password"
                            @input="touched = true"
                        />
                        <button type="button" class="eye-btn" @click="showConfirm = !showConfirm">
                            {{ showConfirm ? "🙈" : "👁️" }}
                        </button>
                    </div>
                    <p v-if="touched && !matchOK" class="text-xs text-red-600 mt-1">
                        Konfirmasi tidak sama dengan password baru.
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-end gap-2">
                    <button type="button" class="btn-subtle" @click="reset">Reset</button>
                    <button type="submit" class="btn-primary" :disabled="!canSubmit || loading">
                        <span v-if="loading" class="animate-pulse">Menyimpan…</span>
                        <span v-else>Submit</span>
                    </button>
                </div>

                <!-- Result -->
                <p v-if="message" :class="msgClass" class="text-sm">
                    {{ message }}
                </p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, defineComponent, h } from "vue";

/** Komponen kecil untuk item requirement (inline, tidak perlu <script> kedua) */
const Req = defineComponent({
    props: { ok: { type: Boolean, required: true }, label: { type: String, required: true } },
    setup(props) {
        return () =>
            h(
                "div",
                {
                    class: [
                        "flex items-center gap-2 rounded-lg border px-2 py-1",
                        props.ok
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-neutral-200 text-neutral-600",
                    ],
                },
                [
                    h("span", null, props.ok ? "✔️" : "•"),
                    h("span", { class: "truncate" }, props.label),
                ]
            );
    },
});

/** ====== STATE ====== */
const form = reactive({ newPassword: "", confirm: "" });
const showNew = ref(false);
const showConfirm = ref(false);
const touched = ref(false);
const loading = ref(false);
const message = ref("");

/** ====== VALIDATION ====== */
const lenOK = computed(() => form.newPassword.length >= 8);
const upperOK = computed(() => /[A-Z]/.test(form.newPassword));
const lowerOK = computed(() => /[a-z]/.test(form.newPassword));
const numOK = computed(() => /\d/.test(form.newPassword));
const symOK = computed(() => /[^A-Za-z0-9]/.test(form.newPassword));
const matchOK = computed(() => form.newPassword !== "" && form.newPassword === form.confirm);

const checksCount = computed(
    () => [lenOK, upperOK, lowerOK, numOK, symOK].filter((c) => c.value).length
);
const strengthPct = computed(() => (checksCount.value / 5) * 100);
const strengthColor = computed(() => {
    const p = strengthPct.value;
    if (p < 40) return "#ef4444"; // red-500
    if (p < 60) return "#f59e0b"; // amber-500
    if (p < 80) return "#10b981"; // emerald-500
    return "#0ea5e9"; // sky-500
});
const canSubmit = computed(
    () =>
        lenOK.value && upperOK.value && lowerOK.value && numOK.value && symOK.value && matchOK.value
);

/** ====== ACTIONS ====== */
function reset() {
    form.newPassword = "";
    form.confirm = "";
    touched.value = false;
    message.value = "";
}
const msgClass = computed(() =>
    message.value.startsWith("Berhasil") ? "text-green-600" : "text-red-600"
);

async function submit() {
    touched.value = true;
    message.value = "";
    if (!canSubmit.value) return;
    try {
        loading.value = true;
        // TODO: ganti dengan API milikmu:
        // await $fetch('/api/admin/change-password', { method: 'POST', body: { password: form.newPassword } })
        await new Promise((r) => setTimeout(r, 900)); // simulasi
        message.value = "Berhasil memperbarui password.";
        reset();
    } catch (e) {
        message.value = "Gagal memperbarui password.";
    } finally {
        loading.value = false;
    }
}
</script>
<style scoped>
/* pusatkan seluruh halaman */
.page-center {
    /* min-h-[100dvh] */
    display: grid; /* grid */
    place-items: center; /* place-items-center */
    background-color: #f5f5f5; /* bg-neutral-50 */
    padding: 1rem; /* p-4 */
}
@media (min-width: 768px) {
    /* md: */
    .page-center {
        padding: 1.5rem;
    } /* md:p-6 */
}

/* card tetap center & punya lebar maksimum */
.card {
    width: 100%; /* w-full */
    max-width: 48rem; /* max-w-3xl (48rem) */
    margin-left: auto; /* mx-auto */
    margin-right: auto;
    border-radius: 1rem; /* rounded-2xl */
    border: 1px solid #e5e7eb; /* border / neutral-200 */
    background-color: #ffffff; /* bg-white */
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
}

/* inputs */
.input {
    width: 100%; /* w-full */
    border-radius: 0.75rem; /* rounded-xl */
    border: 1px solid #e5e7eb; /* border-neutral-200 */
    background-color: #ffffff; /* bg-white */
    padding: 0.5rem 0.75rem; /* px-3 py-2 */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    outline: none; /* outline-none */
    transition: all 0.2s ease-in-out; /* transition */
}
.input:focus {
    border-color: #9ca3af; /* focus:border-neutral-400 */
    box-shadow: 0 0 0 2px rgb(23 23 23 / 0.1); /* focus:ring-2 ring-neutral-900/10 */
}

/* labels */
.lbl {
    display: block; /* block */
    font-size: 0.875rem; /* text-sm */
    color: #404040; /* text-neutral-700 */
    margin-bottom: 0.25rem; /* mb-1 */
}

/* buttons */
.btn-primary {
    display: inline-flex; /* inline-flex */
    align-items: center; /* items-center */
    justify-content: center; /* justify-center */
    border-radius: 0.75rem; /* rounded-xl */
    background-color: #171717; /* bg-neutral-900 */
    padding: 0.5rem 1rem; /* px-4 py-2 */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    color: #ffffff; /* text-white */
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-primary:hover {
    background-color: #262626;
} /* hover:bg-neutral-800 */
.btn-primary:disabled {
    opacity: 0.5;
} /* disabled:opacity-50 */

.btn-subtle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem; /* rounded-xl */
    border: 1px solid #e5e7eb; /* border */
    padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
    font-size: 0.75rem; /* text-xs */
    font-weight: 500; /* font-medium */
    background-color: #ffffff;
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.btn-subtle:hover {
    background-color: #fafafa;
} /* hover:bg-neutral-50 */
.btn-subtle:disabled {
    opacity: 0.5;
} /* disabled:opacity-50 */

/* tombol mata (toggle password) */
.eye-btn {
    position: absolute; /* absolute */
    right: 0.5rem; /* right-2 */
    top: 50%; /* top-1/2 */
    transform: translateY(-50%); /* -translate-y-1/2 */
    font-size: 0.875rem; /* text-sm */
    padding: 0.125rem 0.375rem; /* py-0.5 px-1.5 */
    border-radius: 0.375rem; /* rounded-md */
    background-color: transparent;
    transition: background-color 0.2s ease-in-out;
}
.eye-btn:hover {
    background-color: #fafafa;
} /* hover:bg-neutral-50 */
</style>
