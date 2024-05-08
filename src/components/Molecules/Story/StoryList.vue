<script lang="ts" setup>
import "swiper/css";
import PlusIcon from "@icons/plus.svg";
import StoryItem from "@/components/Molecules/Story/StoryItem.vue";

import { computed } from "vue";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";

const props = withDefaults(
  defineProps<{
    imageSize?: string;
    slidesPerView?: number;
    spaceBetween?: number;
    hasAddStory?: boolean;
  }>(),
  {
    hasAddStory: false,
    slidesPerView: 8,
    spaceBetween: 16,
  }
);

const { user } = storeToRefs(useUserStore());

const optionsComp = computed(() => ({
  modules: [Navigation],
  slidesPerView: props.slidesPerView,
  slidesPerGroup: 4,
  spaceBetween: props.spaceBetween,
  allowTouchMove: true,
  navigation: {
    nextEl: ".navigation-next",
    prevEl: ".navigation-prev",
    disabledClass: "disabled",
  },
}));

const addSizeComp = computed(() => {
  let widthCom = props.imageSize;
  if (!!props.imageSize && !isNaN(Number(props.imageSize))) widthCom = widthCom + "px";
  return widthCom;
});

const addStory = () => {
  console.log("object");
};
</script>

<template>
  <div class="">
    <div class="relative w-full">
      <Swiper v-bind="optionsComp">
        <SwiperSlide v-for="n in 10" :key="n">
          <StoryItem :user="user!" size="56" />
        </SwiperSlide>
        <SwiperSlide v-if="hasAddStory">
          <div class="flex flex-col flex-center cursor-pointer" @click="addStory">
            <div class="border border-separate rounded-full">
              <div
                class="m-[2px] flex flex-center bg-bgColor-secondary rounded-full"
                :style="{ width: addSizeComp, height: addSizeComp }"
              >
                <PlusIcon />
              </div>
            </div>
            <span class="mt-[12px] text-xs font-semibold">Mới</span>
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="hidden navigations min-[736px]:block">
        <div
          class="absolute px-2 py-4 top-1/2 left-0 -translate-y-1/2 opacity-80 cursor-pointer z-10 has-[disabled]:hidden navigation-prev"
        >
          <fa :icon="['fas', 'circle-chevron-left']" class="text-2xl text-white" />
        </div>
        <div
          class="absolute px-2 py-4 top-1/2 right-0 -translate-y-1/2 opacity-80 cursor-pointer z-10 has-[disabled]:hidden navigation-next"
        >
          <fa :icon="['fas', 'circle-chevron-right']" class="text-2xl text-white" />
        </div>
      </div>
    </div>
  </div>
</template>
