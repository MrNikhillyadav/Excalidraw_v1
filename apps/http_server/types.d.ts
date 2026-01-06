export { };
import { Request } from "express";

declare global {
  namespace express {
    interface Reques {
      userId? : String
      use?: String
    }
  }
}