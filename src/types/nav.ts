export type INavTab =
  | "Home"
  | "Search"
  | "Explore"
  | "Reels"
  | "Messenger"
  | "Notification"
  | "CreatePost"
  | "Profile"
  | "Bar";

export interface INav {
  name: INavTab;
  title: string;
  path?: string;
  icon?: any;
  iconActive?: any;
  hasExtend?: boolean;
}
