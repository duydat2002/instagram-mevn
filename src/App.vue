<script lang="ts" setup>
import { RouterView, useRoute } from "vue-router";
import Test from "@/components/Test.vue";

const route = useRoute();
</script>

<template>
  <div>
    <KeepAlive>
      <component :is="route.meta.layout || 'div'">
        <RouterView />
      </component>
    </KeepAlive>
  </div>
</template>

<style lang="css" scoped></style>
