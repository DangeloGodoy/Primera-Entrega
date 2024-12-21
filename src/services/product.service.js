import fs from "node:fs";
import { v4 as uidd } from "uuid";

class ProductService {
    path;
    product = [];

    constructor(path) {
        this.path = path;

        if (fs.existsSync(path)) {
            try {
                this.product = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (error) {
                this.product = [];
            }
        } else {
            this.product = [];
        }
    }

    async getAll() {
        return this.product;
    }

    async getById({ id }) {
        if (id === ":id") {
            throw new Error("El ID es rquerido para buscar el producto")
        }

        return this.product.find((product) => product.id === id) || null;
    }

    async createProduct({ title, description, code, price, status, stock, category, thumbnails }) {
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error("Todos los campos son requeridos")
        }

        if (typeof price !== "number" || typeof stock !== "number") {
            throw new Error("El precio y el stock deben ser un número")
        }

        if (!Array.isArray(thumbnails)) {
            throw new Error("Las imagenes deben ser un array")
        }

        const product = {
            id: uidd(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || []
        };

        this.product.push(product);

        try {
            await this.saveOnFile();
            return product;
        } catch (error) {
            throw new Error("Error al guardar el nuevo producto en el archivo");
        }
    }

    async update({ id , title, description, code, price, status, stock, category, thumbnails }) {
        if (id === ":id") {
            throw new Error("El ID es requerido para actualizar un producto");
        }

        const index = this.product.findIndex((product) => product.id === id);

        if (index === -1) {
            return null;
        }

        if (price !== undefined && typeof price !== "number") {
            throw new Error("El precio debe ser un número");
        }
    
        if (stock !== undefined && typeof stock !== "number") {
            throw new Error("El stock debe ser un número");
        }
    
        if (thumbnails !== undefined && !Array.isArray(thumbnails)) {
            throw new Error("Las imágenes deben ser un array");
        }

        this.product[index] = {
            ...this.product[index],
            title: title ?? this.product[index].title,
            description: description ?? this.product[index].description,
            code: code ?? this.product[index].code,
            price: price ?? this.product[index].price,
            status: status ?? this.product[index].status,
            stock: stock ?? this.product[index].stock,
            category: category ?? this.product[index].category,
            thumbnails: thumbnails ?? this.product[index].thumbnails
        };

        try {
            await this.saveOnFile();
            return this.product[index];
        } catch (error) {
            throw new Error(`Error al actualizar el producto en el archivo: ${error.message}`);
        }
    }

    async delete({ id }) {
        if (!id) {
            throw new Error("El ID es requerido para actualizar un producto");
        }

        const index = this.product.findIndex((product) => product.id === id);

        if (index === -1) {
            return null;
        }

        const deleteProduct = this.product.splice(index, 1)[0];

        try {
            await this.saveOnFile();
            return deleteProduct;
        } catch (error) {
            throw new Error("Error al eliminar el producto en el archivo")
        }
    }

    async saveOnFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.product, null, 2));
        } catch (error) {
            throw new Error(`Error al guardar el archivo: ${error.message}`);
        }
    }
}

export const productService = new ProductService("./src/db/products.json");