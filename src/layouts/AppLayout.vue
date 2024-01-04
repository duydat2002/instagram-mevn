<script lang="ts" setup>
import Nav from "@/components/Layout/Nav/Nav.vue";
</script>

<template>
  <section class="dashboard w-full min-h-screen bg-bgColor-primary">
    <Nav />
    <main
      class="flex min-h-[100vh] ml-0 w-full tablet:ml-nav-narrow tablet:w-[calc(100%-theme(spacing.nav-narrow))] desktop:ml-nav-medium desktop:w-[calc(100%-theme(spacing.nav-medium))]"
    >
      <slot />
    </main>
  </section>
</template>
