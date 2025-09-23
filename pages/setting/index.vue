<!-- pages/settings/index.vue -->
<template>
    <div class="min-h-[100dvh] bg-gradient-to-b from-neutral-50 to-neutral-100 p-4 md:p-6">
        <div class="mx-auto w-full max-w-xl">
            <!-- Card -->
            <section class="rounded-2xl border bg-white/80 backdrop-blur shadow-lg">
                <!-- Header -->
                <div class="border-b bg-white/60 rounded-t-2xl px-5 py-4">
                    <h1 class="text-2xl font-semibold tracking-tight text-neutral-900">Settings</h1>
                    <p class="text-sm text-neutral-500">
                        Kelola preferensi website, profil pengguna, dan keamanan kata sandi Anda.
                    </p>
                </div>

                <!-- Actions (vertical buttons) -->
                <div class="p-5 md:p-6 space-y-3">
                    <!-- Settings -->
                    <NuxtLink
                        to="/settings/general"
                        class="group block w-full rounded-2xl border bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10"
                        aria-label="Buka halaman Settings"
                    >
                        <div class="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-4">
                            <span
                                class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-inset ring-blue-200 group-hover:ring-blue-300"
                            >
                                <!-- icon gear -->
                                <svg viewBox="0 0 24 24" class="h-5 w-5 text-blue-600">
                                    <path
                                        fill="currentColor"
                                        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8.94-3.28a7.94 7.94 0 0 0 0-.44l2.04-1.59a.5.5 0 0 0 .12-.65l-1.93-3.34a.5.5 0 0 0-.6-.23l-2.4.97a7.75 7.75 0 0 0-.77-.44l-.36-2.57a.5.5 0 0 0-.5-.43h-3.86a.5.5 0 0 0-.5.43l-.36 2.57c-.27.12-.53.26-.77.43l-2.4-.96a.5.5 0 0 0-.6.23L.9 8.04a.5.5 0 0 0 .12.65l2.04 1.59c-.02.15-.02.29-.02.44s0 .29.02.44L1.02 12.74a.5.5 0 0 0-.12.65l1.93 3.34a.5.5 0 0 0 .6.23l2.4-.97c.24.17.5.32.77.44l.36 2.57a.5.5 0 0 0 .5.43h3.86a.5.5 0 0 0 .5-.43l.36-2.57c.27-.12.53-.26.77-.44l2.4.97a.5.5 0 0 0 .6-.23l1.93-3.34a.5.5 0 0 0-.12-.65l-2.04-1.59Z"
                                    />
                                </svg>
                            </span>

                            <div>
                                <p class="font-medium text-neutral-900">Settings</p>
                                <p class="text-sm text-neutral-500">
                                    General Setting, SMTP Configuration, dan Email Template.
                                </p>
                            </div>

                            <svg
                                viewBox="0 0 24 24"
                                class="h-5 w-5 text-neutral-400 group-hover:text-neutral-500"
                            >
                                <path fill="currentColor" d="M9 18l6-6-6-6v12z" />
                            </svg>
                        </div>
                    </NuxtLink>

                    <!-- User -->
                    <NuxtLink
                        to="/setting/user"
                        class="group block w-full rounded-2xl border bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10"
                        aria-label="Buka halaman User"
                    >
                        <div class="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-4">
                            <span
                                class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 ring-1 ring-inset ring-violet-200 group-hover:ring-violet-300"
                            >
                                <!-- icon user -->
                                <svg viewBox="0 0 24 24" class="h-5 w-5 text-violet-600">
                                    <path
                                        fill="currentColor"
                                        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14Z"
                                    />
                                </svg>
                            </span>

                            <div>
                                <p class="font-medium text-neutral-900">User</p>
                                <p class="text-sm text-neutral-500">User Management, Add User.</p>
                            </div>

                            <svg
                                viewBox="0 0 24 24"
                                class="h-5 w-5 text-neutral-400 group-hover:text-neutral-500"
                            >
                                <path fill="currentColor" d="M9 18l6-6-6-6v12z" />
                            </svg>
                        </div>
                    </NuxtLink>

                    <!-- Change Password -->
                    <NuxtLink
                        to="/setting/change-password"
                        class="group block w-full rounded-2xl border bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10"
                        aria-label="Buka halaman Change Password"
                    >
                        <div class="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-4">
                            <span
                                class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-inset ring-amber-200 group-hover:ring-amber-300"
                            >
                                <!-- icon lock -->
                                <svg viewBox="0 0 24 24" class="h-5 w-5 text-amber-600">
                                    <path
                                        fill="currentColor"
                                        d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9Zm8 13H7v-9h10Zm-5-3a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z"
                                    />
                                </svg>
                            </span>

                            <div>
                                <p class="font-medium text-neutral-900">Change Password</p>
                                <p class="text-sm text-neutral-500">Ubah kata sandi.</p>
                            </div>

                            <svg
                                viewBox="0 0 24 24"
                                class="h-5 w-5 text-neutral-400 group-hover:text-neutral-500"
                            >
                                <path fill="currentColor" d="M9 18l6-6-6-6v12z" />
                            </svg>
                        </div>
                    </NuxtLink>
                </div>
            </section>
        </div>
    </div>
</template>
