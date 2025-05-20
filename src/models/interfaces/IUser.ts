import { Document, Types  } from "mongoose";

export enum UserRole {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  ADMIN = "admin",
  MANAGER = "manager",
  SALES = "sales",
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles: UserRole[];
  vendorId?: Types.ObjectId;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  generateAuthToken(): string;
  matchPassword(password: string): Promise<boolean>;
  generateVerificationToken(): string;
  generatePasswordResetToken(): string;
}
