import { ICreatePostTabName, ICreatePostTab } from "@/types";

export const CREATE_POST_TABS: ICreatePostTab[] = [
  {
    tab: "UploadPost",
    title: "Tạo bài viết mới",
    hasBack: false,
    nextButton: null,
  },
  {
    tab: "CropPost",
    title: "Cắt",
    hasBack: true,
    nextButton: "Tiếp",
  },
  {
    tab: "FilterPost",
    title: "Chỉnh sửa",
    hasBack: true,
    nextButton: "Tiếp",
  },
  {
    tab: "CaptionPost",
    title: "Tạo bài viết mới",
    hasBack: true,
    nextButton: "Chia sẻ",
  },
  {
    tab: "SharePost",
    title: "Đang chia sẻ",
    hasBack: false,
    nextButton: null,
  },
];
