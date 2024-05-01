import { IUser } from "./user";

export interface ISearch {
  id: string;
  user: string;
  search: IUser;
  searchAt: string;
}
