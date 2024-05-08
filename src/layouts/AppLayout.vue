<script lang="ts" setup>
import LogoText from "@icons/logo-text.svg";
import Nav from "@/components/Layout/Nav/Nav.vue";
import UButton from "@/components/UI/UButton.vue";
import Footer from "@/components/Layout/Footer.vue";

import { useUserStore } from "@/store";
import { storeToRefs } from "pinia";

const { isLogged } = storeToRefs(useUserStore());
</script>

<template>
  <section class="dashboard w-full min-h-screen bg-bgColor-primary">
    <div v-if="isLogged">
      <Nav />
      <main
        class="flex min-h-[100vh] ml-0 pb-12 w-full tablet:ml-nav-narrow tablet:w-[calc(100%-theme(spacing.nav-narrow))] desktop:ml-nav-medium desktop:w-[calc(100%-theme(spacing.nav-medium))]"
      >
        <slot />
      </main>
    </div>
    <div v-else>
      <div class="border-b border-borderColor">
        <div
          class="flex items-center justify-between h-[60px] w-[calc(100%-40px)] max-w-[975px] px-5 mx-auto"
        >
          <RouterLink to="/">
            <LogoText
              class="opacity-100 parent-[.is-narrow]:opacity-0 w-[103px] transition-opacity duration-300"
            />
          </RouterLink>
          <div class="flex">
            <UButton primary><RouterLink :to="{ name: 'Login' }">Đăng nhập</RouterLink></UButton>
            <UButton variant="text">
              <RouterLink :to="{ name: 'Login' }">Đăng ký</RouterLink>
            </UButton>
          </div>
        </div>
      </div>
      <slot />
      <Footer />
    </div>
  </section>
</template>
