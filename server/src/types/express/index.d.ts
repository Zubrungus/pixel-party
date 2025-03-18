import { ObjectId } from "mongoose";

import { Request } from "express"

declare module "express" { 
  export interface Request {
        user?: {
            _id: string | ObjectId;
            username: string;
            password: string;
            createdAt: Date;
        };
    }
}