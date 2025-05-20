import { Model } from "mongoose";
import { IUser } from "../models/interfaces/IUser";

export class UserRepository {
  constructor(private model: Model<IUser>) {}

  async findByEmail(email: string) {
    return this.model.findOne({ email });
  }

  async create(userData: Partial<IUser>) {
    return this.model.create(userData);
  }

  async findById(id: string) {
    return this.model.findById(id);
  }
}
