import { Directive, DirectiveBinding } from "vue";
import { debounce } from "@/helpers";

interface ExtendHTMLElement extends HTMLElement {
  _handleScroll: () => void;
}
type CallbackFunction = () => void;
type ScrollDirection = "up" | "down";

interface InfinityScrollOptions {
  callback: CallbackFunction;
  distance?: number;
}

export const InfiniteScroll: Directive = {
  mounted(
    el: ExtendHTMLElement,
    binding: DirectiveBinding<CallbackFunction | InfinityScrollOptions>
  ) {
    let callback: CallbackFunction;
    let distance: number = 0;
    let direction: ScrollDirection = binding.modifiers.up ? "up" : "down";

    if (typeof binding.value == "function") {
      callback = binding.value;
    } else {
      callback = binding.value.callback;
      distance = binding.value.distance ?? 0;
    }

    el._handleScroll = async () => {
      debounce(async () => {
        const containerHeight = el.clientHeight;
        const scrollHeight = el.scrollHeight;
        const scrollTop = binding.modifiers.self
          ? el.scrollTop
          : window.scrollY || document.documentElement.scrollTop;

        if (direction == "down") {
          if (containerHeight + scrollTop + distance >= scrollHeight) {
            await callback();
          }
        } else {
          if (scrollTop <= distance) {
            await callback();
          }
        }
      }, 200);
    };

    if (binding.modifiers.self) {
      el.addEventListener("scroll", el._handleScroll);
    } else {
      window.addEventListener("scroll", el._handleScroll);
    }
  },
  unmounted(el: ExtendHTMLElement, _binding: DirectiveBinding) {
    el.removeEventListener("scroll", el._handleScroll);
    window.removeEventListener("scroll", el._handleScroll);
  },
};
