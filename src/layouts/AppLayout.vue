<script lang="ts" setup>
import Nav from "@/components/Layout/Nav/Nav.vue";
</script>

<template>
  <section class="dashboard w-full min-h-screen bg-bgColor-primary">
    <Nav />
    <main
      class="ml-0 w-full min-[768px]:ml-nav-narrow min-[768px]:w-[calc(100%-theme(spacing.nav-narrow))] min-[1264px]:ml-nav-medium min-[1264px]:w-[calc(100%-theme(spacing.nav-medium))]"
    >
      <slot />
    </main>
  </section>
</template>
