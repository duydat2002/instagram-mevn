<script setup lang="ts">
import EmojiIcon from "@icons/emoji.svg";
import LocationIcon from "@icons/location.svg";

import Avatar from "@/components/Common/Avatar.vue";
import EmojiPicker from "@/components/Common/EmojiPicker.vue";
import Modal from "@/components/Modal/Modal.vue";
import UButton from "@/components/UI/UButton.vue";
import { ref, computed, watch } from "vue";
import { updatePost } from "@/services/post";
import { storeToRefs } from "pinia";
import { usePostStore } from "@/store";

const emit = defineEmits(["cancel"]);

const { post } = storeToRefs(usePostStore());

const currentMediaIndex = ref(0);
const medias = ref(post.value!.contents);
const caption = ref(post.value!.caption);
const captionInputRef = ref<HTMLTextAreaElement>();
const activeEmojiTooltip = ref(false);
const activeCharactersTooltip = ref(false);
const activeAccessibility = ref(false);

const characterCount = computed(() => {
  return caption.value.length.toLocaleString("en-US").replace(",", ".");
});

const cancelUpdate = () => {
  emit("cancel");
};

const confirmUpdate = async () => {
  const data = await updatePost(post.value!.id, caption.value);
  if (data.success) {
    post.value = data.result!.post;
  }
  emit("cancel");
};

const handlePrevMedia = () => {
  if (currentMediaIndex.value > 0) currentMediaIndex.value -= 1;
};

const handleNextMedia = () => {
  if (currentMediaIndex.value < medias.value.length - 1) currentMediaIndex.value += 1;
};

const handleClickEmoji = (emoji: string) => {
  if (captionInputRef.value) {
    captionInputRef.value.setRangeText(
      emoji,
      captionInputRef.value.selectionStart!,
      captionInputRef.value.selectionEnd!,
      "end"
    );
    caption.value = captionInputRef.value.value;
    captionInputRef.value.focus();
  }
};

watch(caption, (newCaption, oldCaption) => {
  if (newCaption.length >= 2200) {
    caption.value = newCaption.slice(0, oldCaption.length);
  }
});
</script>

<template>
  <Modal isShow @click-outside="cancelUpdate">
    <div
      class="flex flex-col flex-nowrap w-full h-[calc(100vh-40px)] max-h-[442px] bg-modal rounded-xl overflow-hidden select-none"
    >
      <div
        class="relative flex items-center justify-between h-[42px] border-b border-separator-modal"
      >
        <UButton variant="text" @click="cancelUpdate">
          <span class="text-textColor-primary select-none">Hủy</span>
        </UButton>
        <span class="absolute-center text-base font-semibold whitespace-nowrap"
          >Chỉnh sửa thông tin</span
        >
        <UButton variant="text" @click="confirmUpdate">
          <span class="text-buttonColor-primary select-none hover:text-link">Xong</span>
        </UButton>
      </div>
      <div class="max-h-[400px] h-screen">
        <div class="flex flex-nowrap w-full h-full">
          <div class="relative w-[400px] h-full select-none">
            <div class="w-full h-full flex flex-center bg-bgColor-primary">
              <div class="w-full h-full">
                <img class="w-full h-full" :src="medias[currentMediaIndex]" />
              </div>
              <div>
                <div
                  v-if="currentMediaIndex != 0"
                  class="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1acc] rounded-full flex flex-center p-2 transition-opacity duration-200 hover:opacity-60 cursor-pointer z-[1] left-2"
                  @click="handlePrevMedia"
                >
                  <fa :icon="['fas', 'chevron-left']" class="text-base text-white fill-white" />
                </div>
                <div
                  v-if="currentMediaIndex != medias.length - 1"
                  class="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1acc] rounded-full flex flex-center p-2 transition-opacity duration-200 hover:opacity-60 cursor-pointer z-[1] right-2"
                  @click="handleNextMedia"
                >
                  <fa :icon="['fas', 'chevron-right']" class="text-base text-white fill-white" />
                </div>
              </div>
              <div
                v-if="medias.length > 1"
                class="absolute flex left-1/2 -translate-x-1/2 bottom-[30px] pointer-events-none z-[1]"
              >
                <div
                  v-for="(url, index) in medias"
                  :key="url"
                  :class="[
                    'w-[6px] h-[6px] bg-borderColor-dark has-[active]:bg-bgColor-primary dark:has-[active]:bg-buttonColor-primary rounded-full mx-[2px] transition-colors duration-200 ease-in-out',
                    { active: index == currentMediaIndex },
                  ]"
                ></div>
              </div>
            </div>
          </div>
          <div class="flex flex-nowrap flex-col w-[340px] h-full pb-6 overflow-y-scroll">
            <div class="flex items-center my-3 ml-3">
              <Avatar
                width="28"
                :avatar-url="post!.author.avatar"
                border-color="border-transparent"
              />
              <div class="ml-2 font-semibold">{{ post!.author.username }}</div>
            </div>
            <div class="flex flex-col">
              <div class="h-[168px]">
                <textarea
                  class="w-full h-full px-4 text-base resize-none placeholder:text-placeholder"
                  v-model="caption"
                  ref="captionInputRef"
                  placeholder="Viết chú thích..."
                  name="caption"
                ></textarea>
              </div>
              <div class="flex items-center justify-between px-2 flex-shrink-0">
                <div
                  class="relative"
                  v-click-outside="
                    () => {
                      activeEmojiTooltip = false;
                    }
                  "
                >
                  <div class="p-2 cursor-pointer" @click="activeEmojiTooltip = !activeEmojiTooltip">
                    <EmojiIcon
                      width="20"
                      height="20"
                      class="text-textColor-secondary fill-textColor-secondary align-middle"
                    />
                  </div>
                  <EmojiPicker
                    v-if="activeEmojiTooltip"
                    class="emoji-picker absolute top-full mt-1 min-[380px]:w-[300px]"
                    @clicked="handleClickEmoji"
                  />
                </div>
                <div
                  class="maximum-characters relative mr-2"
                  :class="{ active: activeCharactersTooltip }"
                  v-click-outside.short="
                    () => {
                      activeCharactersTooltip = false;
                    }
                  "
                >
                  <span
                    class="text-xs text-textColor-secondary cursor-pointer parent-[.maximum-characters.active]:text-textColor-primary"
                    @click="activeCharactersTooltip = !activeCharactersTooltip"
                    >{{ characterCount }}/2.200</span
                  >
                  <div
                    v-if="activeCharactersTooltip"
                    class="maximum-characters-tolltip absolute mt-[10px] p-3 top-full right-0 w-[291px] text-center text-white bg-black rounded-lg drop-shadow-[0_0_7px_rgba(0,0,0,0.1)] z-[1]"
                  >
                    <span>Chú thích dài hơn 125 ký tự sẽ bị cắt bớt trên bảng feed.</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex items-center justify-between relative w-full px-4 text-base border-t border-separator-modal"
            >
              <input
                type="text"
                class="flex-grow text-base leading-[30px] py-[7px]"
                placeholder="Thêm vị trí"
              />
              <div class="ml-2">
                <LocationIcon v-if="true" />
                <fa v-else :icon="['far', 'circle-xmark']" />
              </div>
            </div>
            <div class="flex flex-col w-full px-4 text-base border-t border-separator-modal">
              <div
                class="flex items-center justify-between w-full cursor-pointer"
                @click="activeAccessibility = !activeAccessibility"
              >
                <span class="py-3 leading-[20px]">Trợ năng</span>
                <div>
                  <fa v-if="!activeAccessibility" :icon="['fas', 'chevron-down']" />
                  <fa v-else :icon="['fas', 'chevron-up']" />
                </div>
              </div>
              <div v-if="activeAccessibility">
                <div>
                  <span class="block text-xs text-textColor-secondary text-left"
                    >Văn bản thay thế mô tả ảnh cho những người suy giảm thị lực. Văn bản thay thế
                    sẽ được tạo tự động cho ảnh của bạn hoặc bạn có thể tự viết.</span
                  >
                  <div class="mt-3">
                    <div v-for="url in medias" :key="url" class="flex mb-4">
                      <div class="w-11 h-11 mr-2">
                        <img :src="url" />
                      </div>
                      <div
                        class="flex-grow border border-separator-modal rounded-md overflow-hidden"
                      >
                        <input
                          class="w-full h-full px-3 py-1 text-sm"
                          type="text"
                          placeholder="Viết văn bản thay thế..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
