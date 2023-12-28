import { defineStore } from "pinia";
import type { ISize } from "@/types";

interface IState {
  screen: "mobile" | "tablet" | "desktop";
  dimensions: ISize;
  timeout: {
    width: NodeJS.Timeout | null;
    height: NodeJS.Timeout | null;
  };
}

export const useResizeStore = defineStore("resize", {
  state: (): IState => ({
    screen: "desktop",
    dimensions: {
      width: 0,
      height: 0,
    },
    timeout: {
      width: null,
      height: null,
    },
  }),
  actions: {
    setDimensions(width: number, height: number) {
      this.dimensions.width = width;
      this.dimensions.height = height;

      if (this.dimensions.width < 768) {
        this.screen = "mobile";
      } else if (this.dimensions.width < 1264) {
        this.screen = "tablet";
      } else {
        this.screen = "desktop";
      }

      // //Debounced
      // if (this.timeout.width) clearTimeout(this.timeout.width)
      // this.timeout.width = setTimeout(() => {
      //   this.dimensions.width = width
      // }, 300)

      // if (this.timeout.height) clearTimeout(this.timeout.height)
      // this.timeout.height = setTimeout(() => {
      //   this.dimensions.height = height
      // }, 300)
    },
  },
});
