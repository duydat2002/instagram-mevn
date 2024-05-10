import { ref } from "vue";
import { useUserReviewStore } from "@/store";

export const useHoverUser = () => {
  const { setHoveredUserId, setModalPosition, resetAll, setTriggerRef } = useUserReviewStore();

  const MODAL_WIDTH = 366;
  const maxRectLeft = window.innerWidth - MODAL_WIDTH - 20;

  const hoverTrigger = (event: Event, userId: string) => {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();

    console.log({
      x: rect.left - bodyRect.left,
      y: rect.top + rect.height - bodyRect.top,
    });

    setModalPosition({
      x: Math.min(rect.left - bodyRect.left, maxRectLeft),
      y: rect.top + rect.height - bodyRect.top,
    });
    setHoveredUserId(userId);
    setTriggerRef(target);
  };

  const leaveTrigger = () => {
    resetAll();
  };

  return {
    hoverTrigger,
    leaveTrigger,
  };
};
