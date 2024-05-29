<script lang="ts" setup>
import { useUsersOnlineStore } from "@/store";
import { ref, onBeforeMount } from "vue";
import { socket } from "@/plugins/socket";

const { bindEvents } = useUsersOnlineStore();

const handleConnect = () => {
  socket.connect();
};

const handleDisconnect = () => {
  socket.disconnect();
};

onBeforeMount(() => {
  socket.connect();
  bindEvents();
});
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-4">Connect</div>
    <div class="flex gap-10">
      <button @click="handleConnect()">Connect</button>
      <button @click="handleDisconnect()">Disconnect</button>
    </div>
  </div>
</template>
