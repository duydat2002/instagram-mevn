import { defineStore } from "pinia";
import { ICreatePostTab, IMedia, ISize, IFilters } from "@/types";
import { CREATE_POST_TABS } from "@/constants";
import { DEFAULT_ADJUST, DEFAULT_FILTER } from "@/constants/filter";
import { drawInitCanvas, getImage } from "@/helpers";

interface IState {
  isShowModal: boolean;
  title: string;
  removePostPopupShow: boolean;
  removeMediaPopupShow: boolean;
  currentTabIndex: number;
  currentTab: ICreatePostTab;
  medias: IMedia[];
  currentMedia: Nullable<IMedia>;
  currentMediaIndex: number;
  currentRatio: string;
  containerSize: ISize;
  cropperSize: ISize;
  filter: IFilters;
  caption: string;
}

const defaultMedia = {
  url: "null",
  image: null,
  canvas: null,
  size: {
    width: 0,
    height: 0,
  },
  translate: {
    x: 0,
    y: 0,
  },
  scale: 1,
  filters: {
    background: "",
    filter: "",
  },
  adjust: DEFAULT_ADJUST,
  filterTemplate: {
    name: "Normal",
    filter: DEFAULT_FILTER,
  },
};

export const useCreatePostStore = defineStore("createPost", {
  state: (): IState => ({
    isShowModal: false,
    title: CREATE_POST_TABS[0].title,
    removePostPopupShow: false,
    removeMediaPopupShow: false,
    currentTabIndex: 0,
    currentTab: CREATE_POST_TABS[0],
    medias: [],
    currentMedia: null,
    currentMediaIndex: 0,
    currentRatio: "1:1",
    containerSize: {
      height: 0,
      width: 0,
    },
    cropperSize: {
      height: 0,
      width: 0,
    },
    filter: {} as IFilters,
    caption: "",
  }),
  actions: {
    setTitle(title: string) {
      this.title = title;
    },
    nextTab() {
      if (this.currentTabIndex < CREATE_POST_TABS.length - 1) {
        this.currentTabIndex++;
        this.currentTab = CREATE_POST_TABS[this.currentTabIndex];
      }
    },
    prevTab() {
      if (this.currentTabIndex > 0) {
        this.currentTabIndex--;
        this.currentTab = CREATE_POST_TABS[this.currentTabIndex];
      }
    },
    addMedia(media: IMedia) {
      this.medias.push(media);
    },
    updateMedia(payload: { index: number; data: IMedia }) {
      const { index, data } = payload;
      if (index != -1) {
        Object.assign(this.medias[index], data);
        Object.assign(this.currentMedia!, data);
      }
    },
    deleteMedia(mediaIndex: number) {
      this.medias.splice(mediaIndex, 1);
      this.currentMedia = this.medias[0];
    },
    setCurrentMedia(currentMedia: IMedia) {
      this.currentMedia = currentMedia;
      this.currentMediaIndex = this.medias.findIndex((media) => {
        return media.url == this.currentMedia?.url;
      });
    },
    setCurrentRatio(currentRatio: string) {
      this.currentRatio = currentRatio;
    },
    setContainerSize(containerSize: ISize) {
      this.containerSize = containerSize;
    },
    setFilter(filter: IFilters) {
      this.filter = filter;
    },
    setCaption(caption: string) {
      this.caption = caption;
    },
    nextMedia() {
      if (this.currentMediaIndex < this.medias.length - 1) {
        this.currentMediaIndex += 1;
        this.currentMedia = this.medias[this.currentMediaIndex];
      }
    },
    prevMedia() {
      if (this.currentMediaIndex > 0) {
        this.currentMediaIndex -= 1;
        this.currentMedia = this.medias[this.currentMediaIndex];
      }
    },
    uploadMedias(files: FileList) {
      const medias: IMedia[] = [];
      const promises = [];

      for (const file of files) {
        const url = URL.createObjectURL(file);

        const promise = getImage(url).then((img) => {
          const canvas = document.createElement("canvas");

          drawInitCanvas(canvas, img, this.containerSize);

          const media = {
            ...defaultMedia,
            url,
            image: img,
            canvas,
            size: {
              width: img.width,
              height: img.height,
            },
          };
          medias.push(media);
        });

        promises.push(promise);
      }

      return Promise.all(promises).then(() => {
        this.medias = medias;
        this.currentMedia = medias[0];
        this.nextTab();
      });
    },
    addMedias(files: FileList) {
      const promises = [];

      for (const file of files) {
        const url = URL.createObjectURL(file);

        const promise = getImage(url).then((img) => {
          const canvas = document.createElement("canvas");

          drawInitCanvas(canvas, img, this.containerSize);

          const media = {
            ...defaultMedia,
            url,
            image: img,
            canvas,
            size: {
              width: img.width,
              height: img.height,
            },
          };
          this.medias.push(media);
        });

        promises.push(promise);
      }

      return Promise.all(promises);
    },
    resetCreatePost() {
      this.currentTabIndex = 0;
      this.currentTab = CREATE_POST_TABS[0];
      this.title = this.currentTab.title;
      this.medias = [];
      this.currentMedia = null;
      this.currentRatio = "1:1";
      this.filter = {} as IFilters;
    },
  },
});
