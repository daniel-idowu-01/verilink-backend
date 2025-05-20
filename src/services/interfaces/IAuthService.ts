import { IUser } from "../../models/interfaces/IUser";

export interface IAuthService {
  registerUser(email: string, password: string): Promise<IUser>;

  registerVendor(
    email: string,
    password: string,
    vendorData: Partial<IUser>
  ): Promise<IUser>;

  login(email: string, password: string): Promise<IUser>;
}
