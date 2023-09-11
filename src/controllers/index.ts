import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import service from "../services";
import UpdateItem from "../utils";

async function validateChanges(req: Request, res: Response, next: NextFunction) {
   const updateList: number[][] = req.body;
    try {      
        const result = await service.validateChanges(updateList);
        return res.send(result).status(httpStatus.OK);
    } catch (error) {
        return res.send(error).status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function updateProducts(req: Request, res: Response, next: NextFunction) {
    const updateList: UpdateItem[] = req.body;
    try {      
        const updatedList = await service.updateProducts(updateList);
        return res.send(updatedList).status(httpStatus.OK);
    } catch (error) {
        return res.send(error).status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

const controller ={
    validateChanges,
    updateProducts
}

export default controller;

