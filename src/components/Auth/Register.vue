<script lang="ts" setup>
import LogoText from "@icons/logo-text.svg";
import UButton from "../UI/UButton.vue";

import { ref, computed } from "vue";
import UInput from "../UI/UInput.vue";
import { useUserStore } from "@/store";
import { checkRegister } from "@/services/auth";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const email = ref("");
const fullname = ref("");
const username = ref("");
const password = ref("");
const registerError = ref("");

const keyErrors = ref<string[]>([]);

const checkEmail = computed(() => {
  return !keyErrors.value.includes("email");
});
const checkUsername = computed(() => {
  return !keyErrors.value.includes("username");
});
const checkPassword = computed(() => {
  return !keyErrors.value.includes("password");
});

const loading = ref(false);
const isDisable = computed(() => {
  return email.value == "" || username.value == "" || password.value.length < 8;
});

const handleBlur = async () => {
  const data = await checkRegister(email.value, fullname.value, username.value, password.value);

  if (!data.success && data.keyValue) {
    keyErrors.value = Array.isArray(data.keyValue) ? data.keyValue : [data.keyValue];
    console.log(data);
  } else {
    keyErrors.value = [];
  }
};

const handleSubmitRegister = async () => {
  loading.value = true;
  registerError.value = "";

  const { register } = useUserStore();
  const data = await register(email.value, fullname.value, username.value, password.value);

  if (!data.success) {
    registerError.value = !Array.isArray(data.message) ? data.message : data.message[0].message;
    console.log(data);
  } else {
    if (route.path != "/") router.push("/");
  }

  loading.value = false;
};
</script>

<template>
  <div class="no-dark w-[350px] mt-3 mb-10 flex flex-col max-[450px]:mt-0 max-[450px]:w-full">
    <div
      class="flex flex-col items-center px-10 py-5 border rounded-sm border-borderColor max-[450px]:border-none"
    >
      <RouterLink to="/" class="w-[175px] mt-[26px]">
        <LogoText />
      </RouterLink>
      <p class="mt-4 text-base leading-5 text-textColor-secondary font-semibold text-center">
        Đăng ký để xem ảnh và video từ bạn bè.
      </p>
      <form @submit.prevent="handleSubmitRegister" class="flex flex-col items-center w-full mb-5">
        <UButton primary class="w-full mt-4">
          <div class="flex flex-center">
            <div class="w-[18px] h-[18px] mr-2">
              <fa class="w-full h-full" :icon="['fab', 'square-facebook']" style="color: #ffffff" />
            </div>
            <span class="text-white">Đăng nhập bằng Facebook</span>
          </div>
        </UButton>
        <div class="flex w-full items-center my-4">
          <div class="w-full h-[1px] bg-borderColor"></div>
          <span class="mx-4 text-[13px] uppercase font-semibold text-textColor-secondary"
            >Hoặc</span
          >
          <div class="w-full h-[1px] bg-borderColor"></div>
        </div>
        <UInput
          class="mb-[6px]"
          name="email"
          type="email"
          placeholder="Số điện thoại hoặc email"
          v-model:propValue="email"
          :checkValue="checkEmail"
          @blur="handleBlur"
        />
        <UInput
          class="mb-[6px]"
          name="fullname"
          placeholder="Tên đầy đủ"
          v-model:propValue="fullname"
        />
        <UInput
          class="mb-[6px]"
          name="username"
          placeholder="Tên người dùng"
          v-model:propValue="username"
          :checkValue="checkUsername"
          @blur="handleBlur"
        />
        <UInput
          class="mb-4"
          name="password"
          placeholder="Mật khẩu"
          type="password"
          v-model:propValue="password"
          :checkValue="checkPassword"
          @blur="handleBlur"
        />
        <span class="mb-4 text-xs text-center text-textColor-secondary">
          Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên
          Instagram.
          <RouterLink to="/" class="text-link inline">Tìm hiểu thêm</RouterLink>
        </span>
        <span class="mb-4 text-xs text-center text-textColor-secondary">
          Bằng cách đăng ký, bạn đồng ý với
          <RouterLink to="/" class="text-link inline"
            >Điều khoản, Chính sách quyền riêng tư</RouterLink
          >
          và
          <RouterLink to="/" class="text-link inline">Chính sách cookie</RouterLink>
          của chúng tôi.
        </span>
        <UButton type="submit" class="w-full" primary :isLoading="loading" :isDisabled="isDisable"
          >Đăng ký</UButton
        >
        <p v-if="registerError" class="text-error text-center mb-2 mt-6">
          {{ registerError }}
        </p>
      </form>
    </div>
    <div
      class="mt-3 flex flex-center py-6 border rounded-sm border-borderColor max-[450px]:border-none"
    >
      <span class="mr-1">Bạn có tài khoản?</span>
      <RouterLink to="/accounts/login" class="font-semibold text-buttonColor-primary"
        >Đăng nhập</RouterLink
      >
    </div>
    <div class="text-center">
      <p class="text-sm my-4">Tải ứng dụng.</p>
      <div class="flex flex-center gap-2">
        <RouterLink to="/" class="">
          <img src="@/assets/images/downloadOnGooglePlay.png" class="h-10" />
        </RouterLink>
        <RouterLink to="/" class="">
          <img src="@/assets/images/downloadOnMicrosoft.png" class="h-10" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
