<script setup lang="ts">
import MessengerIcon from "@icons/messenger.svg";
import UserPlusIcon from "@icons/user-plus.svg";
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import UserReviewSkeleton from "@/components/Skeleton/UserReviewSkeleton.vue";

import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useUserHoverStore, useUserStore } from "@/store";
import { IPost, IUser } from "@/types";
import { getUserPreview } from "@/services/user";
import { useHoverUser } from "@/composables";
import { formatNumberToSuffix } from "@/helpers";

const { user } = storeToRefs(useUserStore());
const { hoveredUserId, modalPosition, triggerRef } = storeToRefs(useUserHoverStore());
const { leaveTrigger } = useHoverUser();

const userReviewRef = ref<HTMLDivElement>();
const userReview = ref<IUser>();
const postsReview = ref<IPost[]>([]);

const position = computed(() => ({
  left: `${modalPosition.value.x}px`,
  top: `${modalPosition.value.y}px`,
}));

watch(
  hoveredUserId,
  async () => {
    if (hoveredUserId.value) {
      userReview.value = undefined;
      postsReview.value = [];
      const data = await getUserPreview(hoveredUserId.value!);
      if (data.success) {
        userReview.value = data.result!.user;
        postsReview.value = data.result!.posts;
      }
    }
  },
  { immediate: true }
);

const checkLeaveModal = (event: Event) => {
  const elMove = event.target as HTMLElement;
  if (!userReviewRef.value?.contains(elMove) && !triggerRef.value?.contains(elMove)) {
    leaveTrigger();
  }
};

onMounted(() => {
  document.body.addEventListener("mousemove", checkLeaveModal);
});

onBeforeUnmount(() => {
  document.body.removeEventListener("mousemove", checkLeaveModal);
});
</script>

<template>
  <div v-if="hoveredUserId" ref="userReviewRef" class="absolute pt-1 z-50" :style="position">
    <div
      class="flex gap-4 flex-col py-4 w-[366px] bg-bgColor-primary rounded-xl overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.2)]"
    >
      <UserReviewSkeleton v-if="!userReview" />
      <template v-else>
        <div class="flex items-center">
          <div class="w-full flex items-center px-4">
            <RouterLink :to="{ name: 'Profile', params: { username: userReview.username } }">
              <Avatar
                :hasStory="Math.random() > 0.5"
                :avatarUrl="userReview?.avatar"
                width="56"
                class="-ml-1 mr-2 flex-shrink-0"
              />
            </RouterLink>
            <div class="justify-center flex-1 overflow-hidden">
              <RouterLink :to="{ name: 'Profile', params: { username: userReview.username } }">
                <span class="block text-base text-textColor-primary font-bold text-dots">{{
                  userReview?.username
                }}</span>
              </RouterLink>
              <span
                v-if="userReview.fullname"
                class="block text-sm text-textColor-secondary text-dots flex-shrink-0"
                >{{ userReview.fullname }}</span
              >
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="w-1/3 px-2 text-sm text-center">
            <div>
              <span class="font-bold text-textColor-primary">{{
                formatNumberToSuffix(userReview.posts.length)
              }}</span>
            </div>
            <div><span>bài viết</span></div>
          </div>
          <div class="w-1/3 px-2 text-sm text-center">
            <div>
              <span class="font-bold text-textColor-primary">{{
                formatNumberToSuffix(userReview.followers.length)
              }}</span>
            </div>
            <div><span>người theo dõi</span></div>
          </div>
          <div class="w-1/3 px-2 text-sm text-center">
            <div>
              <span class="font-bold text-textColor-primary">{{
                formatNumberToSuffix(userReview.followings.length)
              }}</span>
            </div>
            <div><span>đang theo dõi</span></div>
          </div>
        </div>
        <div>
          <div v-if="postsReview.length > 0" class="flex">
            <RouterLink
              :to="{ name: 'Post', params: { postId: post.id } }"
              v-for="post in postsReview"
              :key="post.id"
              class="w-1/3 px-[2px]"
            >
              <img class="object-cover aspect-square" :src="post.contents[0]" />
            </RouterLink>
          </div>
          <div
            v-else
            class="flex flex-col items-center p-4 text-sm text-center border-y border-borderColor"
          >
            <img src="@/assets/images/CameraColor.png" />
            <span class="font-bold text-textColor-primary">Chưa có bài viết nào</span>
            <span class="text-textColor-secondary"
              >Khi {{ userReview.username }} chia sẻ, bạn sẽ thấy ảnh và thước phim của họ ở
              đây.</span
            >
          </div>
        </div>
        <div class="flex items-center gap-2 px-4">
          <UButton v-if="user?.id == userReview.id" secondary class="flex-1"
            ><span>Theo dõi</span></UButton
          >
          <template v-else-if="user?.followings.includes(userReview.id)">
            <UButton primary class="flex-1">
              <div class="flex items-center justify-center">
                <MessengerIcon class="mr-2 w-5 fill-white text-white" />
                <span>Nhắn tin</span>
              </div>
            </UButton>
            <UButton secondary class="flex-1"><span>Đang theo dõi</span></UButton>
          </template>
          <UButton v-else primary class="flex-1">
            <div class="flex items-center justify-center">
              <UserPlusIcon class="mr-2 w-5 fill-white text-white" />
              <span>Theo dõi</span>
            </div>
          </UButton>
        </div>
      </template>
    </div>
  </div>
</template>
