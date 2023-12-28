import Home from "@icons/home.svg";
import HomeActive from "@icons/home-active.svg";
import Search from "@icons/glass.svg";
import SearchActive from "@icons/glass-active.svg";
import Explore from "@icons/explore.svg";
import ExploreActive from "@icons/explore-active.svg";
import Reel from "@icons/reel.svg";
import ReelActive from "@icons/reel-active.svg";
import Messenger from "@icons/messenger.svg";
import MessengerActive from "@icons/messenger-active.svg";
import Heart from "@icons/heart.svg";
import HeartActive from "@icons/heart-active.svg";
import Plus from "@icons/plus-square.svg";
import PlusActive from "@icons/plus-square-active.svg";
import Bar from "@icons/bar.svg";
import BarActive from "@icons/bar-active.svg";

import { shallowRef, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore, useResizeStore } from "@/store";
import { type INav, ENavTab } from "@/types";

export const useNav = () => {
  const { user } = useUserStore();

  const NAVS: INav[] = [
    { icon: Home, iconActive: HomeActive, title: "Trang chủ", name: ENavTab.Home, path: "/" },
    {
      icon: Search,
      iconActive: SearchActive,
      title: "Tìm kiếm",
      name: ENavTab.Search,
    },
    {
      icon: Explore,
      iconActive: ExploreActive,
      title: "Khám phá",
      name: ENavTab.Explore,
      path: "/explore",
    },
    { icon: Reel, iconActive: ReelActive, title: "Reels", name: ENavTab.Reels, path: "/reels" },
    {
      icon: Messenger,
      iconActive: MessengerActive,
      title: "Tin nhắn",
      name: ENavTab.Messenger,
      path: "/inbox",
    },
    {
      icon: Heart,
      iconActive: HeartActive,
      title: "Thông báo",
      name: ENavTab.Notification,
    },
    { icon: Plus, iconActive: PlusActive, title: "Tạo", name: ENavTab.CreatePost },
    { title: "Trang cá nhân", name: ENavTab.Profile, path: `/${user?.username}` },
  ];

  const NAVS_MOBILE: INav[] = [
    {
      icon: Home,
      iconActive: HomeActive,
      title: "Trang chủ",
      name: ENavTab.Home,
      path: "/",
    },
    {
      icon: Explore,
      iconActive: ExploreActive,
      title: "Khám phá",
      name: ENavTab.Explore,
      path: "/explore",
    },
    { icon: Reel, iconActive: ReelActive, title: "Reels", name: ENavTab.Reels, path: "/reels" },
    { icon: Plus, iconActive: PlusActive, title: "Tạo", name: ENavTab.CreatePost },
    {
      icon: Messenger,
      iconActive: MessengerActive,
      title: "Tin nhắn",
      name: ENavTab.Messenger,
      path: "/inbox",
    },
    { title: "Trang cá nhân", name: ENavTab.Profile, path: `/${user?.username}` },
  ];

  const bottomNav: INav[] = [
    {
      name: ENavTab.Bar,
      title: "Xem thêm",
      icon: Bar,
      iconActive: BarActive,
    },
  ];

  const navs = shallowRef<INav[]>([]);
  const { screen } = storeToRefs(useResizeStore());

  watch(
    screen,
    (newValue) => {
      if (newValue == "mobile") navs.value = NAVS_MOBILE;
      else navs.value = NAVS;
    },
    {
      immediate: true,
    }
  );

  return {
    navs,
    bottomNav,
  };
};
