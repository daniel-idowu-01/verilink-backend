import { v4 as uuidv4 } from "uuid";

export function generateExitToken(): string {
  return uuidv4();
}
