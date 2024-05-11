import { Directive, DirectiveBinding } from "vue";
import { debounce } from "@/helpers";

interface ExtendHTMLElement extends HTMLElement {
  _handleScroll: () => void;
}

export const InfiniteScroll: Directive = {
  mounted(el: ExtendHTMLElement, binding: DirectiveBinding) {
    el._handleScroll = async () => {
      debounce(async () => {
        if (el.getBoundingClientRect().bottom < window.innerHeight) {
          await binding.value();
        }
      }, 200);
    };

    window.addEventListener("scroll", el._handleScroll);
  },
  unmounted(el: ExtendHTMLElement, _binding: DirectiveBinding) {
    window.removeEventListener("scroll", el._handleScroll);
  },
};
