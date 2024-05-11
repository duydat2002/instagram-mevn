import { Directive, DirectiveBinding } from "vue";

interface ExtendHTMLElement extends HTMLElement {
  _intersectObserver?: IntersectionObserver;
}

export const Intersect: Directive = {
  mounted(el: ExtendHTMLElement, binding: DirectiveBinding) {
    let observer: IntersectionObserver = new IntersectionObserver(() => {});

    if (typeof binding.value == "function") {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            binding.value();
          }
        });
      });
    }

    if (typeof binding.value == "object") {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            binding.value.handle();
          }
        });
      }, binding.value.options);
    }

    observer.observe(el);

    el._intersectObserver = observer;
  },
  unmounted(el: ExtendHTMLElement, _binding: DirectiveBinding) {
    if (el._intersectObserver) {
      el._intersectObserver.disconnect();
      delete el._intersectObserver;
    }
  },
};
