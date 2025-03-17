import { IUser } from "./User";

export interface GraphQLContext {
  user: IUser | null;
}
