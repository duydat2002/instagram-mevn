<script setup lang="ts">
import "swiper/css";
import "swiper/css/pagination";
import { computed } from "vue";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { IPost } from "@/types";

const props = defineProps<{
  post: IPost;
}>();

const postSwiperOptions = {
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 0,
  allowTouchMove: true,
  navigation: {
    nextEl: `#navigation-next-${props.post.id}`,
    prevEl: `#navigation-prev-${props.post.id}`,
    disabledClass: "disabled",
  },
  pagination: { clickable: true },
};

const ratio = computed(() => ({
  paddingBottom: `${(1 / props.post.ratio) * 100}%`,
}));
</script>

<template>
  <div
    class="relative w-full border border-borderColor rounded overflow-hidden"
    :instanceName="post.id"
  >
    <Swiper v-bind="postSwiperOptions">
      <SwiperSlide v-for="url in post!.contents" :key="url">
        <div class="relative w-full pb-[100%]" :style="ratio">
          <img :src="url" class="absolute top-0 left-0 w-full h-full object-cover" />
        </div>
        <!-- <div>
          <img :src="url" class="w-full object-cover" />
        </div> -->
      </SwiperSlide>
    </Swiper>
    <div>
      <div
        class="absolute px-2 py-4 top-1/2 left-0 -translate-y-1/2 opacity-60 cursor-pointer z-10 has-[disabled]:hidden navigation-prev drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        :id="`navigation-prev-${post.id}`"
      >
        <fa
          :icon="['fas', 'circle-chevron-left']"
          class="text-2xl text-white drop-shadow-[0_0_7px_rgba(0,0,0,0.1)]"
        />
      </div>
      <div
        class="absolute px-2 py-4 top-1/2 right-0 -translate-y-1/2 opacity-60 cursor-pointer z-10 has-[disabled]:hidden navigation-next drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        :id="`navigation-next-${post.id}`"
      >
        <fa
          :icon="['fas', 'circle-chevron-right']"
          class="text-2xl text-white drop-shadow-[0_0_7px_rgba(0,0,0,0.1)]"
        />
      </div>
    </div>
  </div>
</template>
