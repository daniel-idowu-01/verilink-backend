import { RequestHandler } from "express";

export interface IAuthController {
  registerUser: RequestHandler;
  registerVendor: RequestHandler;
  login: RequestHandler;
}
