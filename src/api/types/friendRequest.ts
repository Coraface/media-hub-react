import { User } from "./user";

export interface FriendRequest {
  requester: User;
  recipient: User;
  status: string;
}
