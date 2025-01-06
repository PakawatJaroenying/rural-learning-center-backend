import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application, Express } from "express";
import oas from "express-oas-generator";


export const setupSwagger = (app: any): void => {
    oas.init(app, {});
};
