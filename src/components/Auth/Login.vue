<script lang="ts" setup>
import LogoText from "@icons/logo-text.svg";
import UButton from "@/components/UI/UButton.vue";
import UInput from "@/components/UI/UInput.vue";

import { ref, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store";

const route = useRoute();
const router = useRouter();

const username = ref("");
const password = ref("");
const loginError = ref("");
const loading = ref(false);

const isDisable = computed(() => {
  return !(username.value != "" && password.value.length >= 8);
});

const handleSubmitLogin = async () => {
  loading.value = true;

  const { login } = useUserStore();
  const data = await login(username.value, password.value);

  if (!data.success) {
    loginError.value = "Rất tiếc, mật khẩu của bạn không đúng.\nVui lòng kiểm tra lại mật khẩu.";
  } else {
    if (route.path != "/") router.push("/");
    else router.go(0);
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
      <form @submit.prevent="handleSubmitLogin" class="flex flex-col items-center w-full mt-10">
        <UInput
          class="mb-[6px]"
          name="username"
          placeholder="Số điện thoại, tên người dùng hoặc email"
          v-model:propValue="username"
        />
        <UInput
          class="mb-4"
          name="password"
          placeholder="Mật khẩu"
          type="password"
          v-model:propValue="password"
        />
        <UButton type="submit" class="w-full" primary :isLoading="loading" :isDisabled="isDisable"
          >Đăng nhập</UButton
        >
        <div class="flex w-full items-center my-4">
          <div class="w-full h-[1px] bg-borderColor"></div>
          <span class="mx-4 text-[13px] uppercase font-semibold text-textColor-secondary"
            >Hoặc</span
          >
          <div class="w-full h-[1px] bg-borderColor"></div>
        </div>
        <UButton variant="text">
          <div class="flex items-center">
            <div class="w-4 h-4 mr-2">
              <img src="@/assets/images/facebookIcon.png" alt="Facebook login" />
            </div>
            <span class="text-link">Đăng nhập bằng Facebook</span>
          </div>
        </UButton>
        <p v-if="loginError" class="text-error text-center my-2">
          {{ loginError }}
        </p>
        <RouterLink to="/" class="mt-3 text-xs text-link">Quên mật khẩu?</RouterLink>
      </form>
    </div>
    <div
      class="mt-3 flex flex-center py-6 border rounded-sm border-borderColor max-[450px]:border-none"
    >
      <span class="mr-1">Bạn chưa có tài khoản ư?</span>
      <RouterLink to="/accounts/emailsignup" class="font-semibold text-buttonColor-primary"
        >Đăng ký</RouterLink
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
