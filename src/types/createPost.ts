import type { ISize, IPoint } from "@/types";

export type ICreatePostTabName =
  | "UploadPost"
  | "CropPost"
  | "FilterPost"
  | "CaptionPost"
  | "SharePost";

export interface ICreatePostTab {
  tab: ICreatePostTabName;
  title: string;
  hasBack: boolean;
  nextButton: string | null;
}

export interface IFilters {
  background: string;
  filter: string;
}

export interface IAdjust {
  brightness?: number;
  contrast?: number;
  saturate?: number;
  blur?: number;
  grayscale?: number;
  sepia?: number;
  "hue-rotate"?: number;
  temperature?: number;
  // blurBorder: number
}

export interface IFilterTemplate {
  name: string;
  filter: any;
}

export interface IMedia {
  url: string;
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  size: ISize;
  translate: IPoint;
  scale: number;
  filters?: IFilters;
  adjust?: IAdjust;
  filterTemplate?: {
    name: string;
    filter: IAdjust;
  };
}
