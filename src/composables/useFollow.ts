import { ref, computed } from "vue";
import { useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { followUser, unfollowUser } from "@/services/user";

export const useFollow = () => {
  const { user } = storeToRefs(useUserStore());
  const { addUserFollowing, removeUserFollowing } = useUserStore();
  const isLoadingFollow = ref(false);

  const follow = async (userId: string, callback: () => void = () => {}) => {
    if (user.value) {
      isLoadingFollow.value = true;
      const data = await followUser(user.value.id, userId);
      if (data.success) {
        addUserFollowing(userId);
        callback();
      }

      isLoadingFollow.value = false;
    }
  };

  const unfollow = async (userId: string, callback: () => void = () => {}) => {
    if (user.value) {
      isLoadingFollow.value = true;
      const data = await unfollowUser(user.value.id, userId);
      if (data.success) {
        removeUserFollowing(userId);
        callback();
      }

      isLoadingFollow.value = false;
    }
  };

  return {
    isLoadingFollow,
    follow,
    unfollow,
  };
};
