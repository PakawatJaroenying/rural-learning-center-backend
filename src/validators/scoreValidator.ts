import { query } from "express-validator";

export const scoreGetByIdValidator = [
    query("id").notEmpty().withMessage("ID is required"),
];