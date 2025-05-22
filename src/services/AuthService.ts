import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
// import { User } from "../models/User";
// import { Vendor } from "../models/Vendor";
import { BadRequestError } from "../utils/errors";
import { UserRole } from "../models/interfaces/IUser";
import { UserRepository } from "../repositories/UserRepository";
import { VendorRepository } from "../repositories/VendorRepository";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private vendorRepository: VendorRepository  
  ) {}

  async registerUser(email: string, password: string) {
    const exists = await this.userRepository.findByEmail(email);
    if (exists) throw new BadRequestError("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      roles: [UserRole.CUSTOMER],
    });

    return {
      user,
      token: user.generateAuthToken(),
    };
  }

  async registerVendor(email: string, password: string, vendorData: any) {
    const userResult = await this.registerUser(email, password);
    userResult.user.roles.push(UserRole.VENDOR);
    await userResult.user.save();

    const vendor = await this.vendorRepository.create({
      ...vendorData,
      userId: userResult.user._id,
    });

    userResult.user.vendorId = vendor._id as ObjectId;
    await userResult.user.save();

    return {
      ...userResult,
      vendor,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new BadRequestError("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestError("Invalid credentials");

    return {
      user,
      token: user.generateAuthToken(),
    };
  }
}
