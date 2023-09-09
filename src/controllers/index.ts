import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import service from "../services";

export default async function updateProducts(req: Request, res: Response, next: NextFunction) {
   const updateList: number[][] = req.body;
    try {      
        const result = await service.validateChanges(updateList);
        return res.send(result).status(httpStatus.OK);
    } catch (error) {
        return res.send(error).status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

