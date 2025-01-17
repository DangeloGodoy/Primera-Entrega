import express from 'express';
import morgan from 'morgan';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';

import { productsRouter  } from './routes/products.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { viewsRoutes, products } from './routes/views.routes.js';
import { __dirname } from "./dirname.js";

const app = express();
const PORT = 8000;

// Express config
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars config
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",
    })
);
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", viewsRoutes);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

// Websocket config
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export const io = new Server(server);

io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    socket.emit("init", products);
})