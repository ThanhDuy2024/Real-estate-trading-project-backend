import { Request, Response } from "express";

export const registerAdmin = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json({
    code: "success"
  });
}