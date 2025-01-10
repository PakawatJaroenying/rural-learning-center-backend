import { body, query } from "express-validator";

export const scoreGetByIdValidator = [
    query("id").notEmpty().withMessage("ID is required"),
];

export const scoreUpdateValidator= [
    body("id").notEmpty().withMessage("ID is required"),
]