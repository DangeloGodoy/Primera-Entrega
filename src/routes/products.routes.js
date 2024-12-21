import { Router } from 'express';
import { productService } from '../services/product.service.js';

export const productsRouter = Router();

// -----------------
// GET /api/products
// -----------------

productsRouter.get("/", async (req, res) => {
    try {
        const products = await productService.getAll();
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: `Error al obtener los productos: ${error.message}` })
    }
});

// -----------------
// GET /api/product/:id
// -----------------

productsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: "Debe proporcionar un id" });
        }
        
        const product = await productService.getById({ id });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: `Error al obtener el producto: ${error.message}` });
    }
});

// -----------------
// POST /api/product
// -----------------

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Faltan campos por completar o son inválidos" });
    }

    try {
        const product = await productService.createProduct({ 
            title, 
            description, 
            code, 
            price, 
            status: status ?? true, 
            stock, 
            category, 
            thumbnails: thumbnails ?? [] 
        });

        return res.status(201).json({ message: "Producto creado", product });
    } catch (error) {
        return res.status(500).json({ message: `Error al crear el producto: ${error.message}` });
    }
})

// -----------------
// PUT /api/product/:id
// -----------------

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title && !description && !code && !price && !status && !stock && !category && !thumbnails) {
        return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
    }

    try {
        const product = await productService.update({ id, title, description, code, price, status, stock, category, thumbnails });

        return res.status(200).json({ message: "Producto actualizado", product });
    } catch (error) {
        return res.status(500).json({ message: `Error al actualizar el producto: ${error.message}` });        
    }
});

// -----------------
// DELETE /api/product/:id
// -----------------

productsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productService.delete({ id });

        if (!product) {
            return res.status(400).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json({ message: "Producto eliminado", product });
    } catch (error) {
        return res.status(500).json({ message: `Error al eliminar el producto: ${error.message}` });
    }   
});