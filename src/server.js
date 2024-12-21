import express from 'express';
import { productsRouter } from './routes/products.routes.js';
import { cartRouter } from './routes/cart.routes.js';

const app = express();
const PORT = 8000;

// Express configuracion
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

// Inicializador de servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});