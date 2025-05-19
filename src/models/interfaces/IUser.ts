import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  roles: string[];
  vendorId?: Schema.Types.ObjectId;
  generateAuthToken(): string;
  matchPassword(password: string): Promise<boolean>;
}
