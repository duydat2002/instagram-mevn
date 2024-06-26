<script lang="ts" setup>
import { type PropType, computed } from "vue";

const props = defineProps({
  type: {
    type: String as PropType<"button" | "submit" | "reset">,
    default: "button",
    validator: (value: string) => {
      return ["button", "submit", "reset"].includes(value);
    },
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String as PropType<"text" | "contained" | "outlined">,
    default: "contained",
    validator(value: string) {
      return ["text", "contained", "outlined"].includes(value);
    },
  },
  color: {
    type: String,
  },
  backgroundColor: {
    type: String,
  },
  size: {
    type: String as PropType<"small" | "medium" | "large" | "none">,
    default: "medium",
    validator: (value: string) => {
      return ["small", "medium", "large", "none"].includes(value);
    },
  },
  classProps: {
    type: String as PropType<string[] | string>,
  },
});

const classes = computed(() => {
  return [`button--size-${props.size}`, `button--variant-${props.variant}`];
});
</script>

<template>
  <button
    class="relative font-semibold select-none disabled:opacity-60 disabled:pointer-events-none"
    :class="[classes, classProps]"
    :style="{ color, backgroundColor }"
    :type="type"
    :disabled="isDisabled || isLoading"
  >
    <div v-if="isLoading" class="absolute-center">
      <fa class="animate-spin" :icon="['fas', 'spinner']" />
    </div>

    <div :class="{ 'opacity-0': isLoading }">
      <slot />
    </div>
  </button>
</template>

<style lang="postcss" scoped>
button[primary] {
  color: #fff;
  background: var(--primary-button-color);
}

button[primary]:hover {
  background: var(--primary-button-hover-color);
}

button[secondary] {
  color: var(--primary-text-color);
  background: var(--secondary-button-color);
}

button[secondary]:hover {
  background: var(--secondary-button-hover-color);
}

.button--variant-text {
  font-weight: 600;
  background: transparent !important;
}
.button--variant-text:hover {
}

.button--variant-text[primary] {
  color: var(--primary-button-color);
}
.button--variant-text[primary]:hover {
  color: var(--primary-button-hover-color);
}

.button--variant-text[secondary] {
  color: var(--primary-text-color);
}
.button--variant-text[secondary]:hover {
  opacity: 0.6;
}

.button--variant-contained {
}
.button--variant-contained:hover {
}

.button--variant-outlined {
}

.button--size-none {
  @apply text-xs rounded-md;
}
.button--size-small {
  @apply text-[13px] leading-[17px] py-[4px] px-[10px] rounded-md;
}
.button--size-medium {
  @apply text-sm py-[7px] px-4 rounded-lg;
}
.button--size-large {
  @apply text-[15px] leading-[19px] py-2 px-[22px] rounded-[10px];
}
</style>
