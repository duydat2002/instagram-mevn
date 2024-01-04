export interface IServerData<T = any> {
  success: boolean;
  result: Nullable<T>;
  message: string | any[];
  keyValue?: string | string[];
}
