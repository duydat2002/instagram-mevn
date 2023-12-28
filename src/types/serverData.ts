export interface IServerData<T = any> {
  success: boolean;
  result: T;
  message: string | any[];
  keyValue?: string | string[];
}
