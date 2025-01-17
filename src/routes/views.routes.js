import { Router } from "express";
import fs from "fs";

export const products = JSON.parse(fs.readFileSync("./src/db/products.json", "utf-8"));

export const viewsRoutes = Router();

viewsRoutes.get("/", (req, res) => {
    res.render("home", { products });
});

viewsRoutes.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});