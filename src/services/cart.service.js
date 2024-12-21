import fs from "node:fs";
import { v4 as uidd } from "uuid";

class CartService {
    path;
    cart = [];

    constructor (path) {
        this.path = path;

        if (fs.existsSync(path)) {
            try {
                this.cart = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (error) {
                this.cart = [];               
            }
        } else {
            this.cart = [];
        }
    };

    async createCart() {
        const cart = {
            id: uidd(),
            products: []
        }

        this.cart.push(cart);

        try {
            await this.saveOnFile();
            return cart;
        } catch (error) {
            throw new Error("Error al guardar el carrito en el archivo");
        }
    }

    async getByCid({ cid }) {
        if(!cid) {
            throw new Error("El ID es requerido para buscar el carrito")
        }

        return this.cart.find((cart) => cart.id === cid) || null;
    }

    async addProductCart({ cid, pid }) {
        if (cid === ":cid") {
            throw new Error("El ID es requerido para buscar el carrito")
        }

        const cart = this.cart.find((cart) => cart.id === cid);

        if (!cart) {
            throw new Error("Carrito no encontrado")
        }

        if (pid === ":pid") {
            throw new Error("El producto es requerido")
        }

        let products = [];
        try {
            const productsData = fs.readFileSync("./src/db/products.json", "utf-8");
            products = JSON.parse(productsData);
        } catch (error) {
            throw new Error("Error al leer los productos")
        }

        const productExists = products.find((product) => product.id === pid);

        if (!productExists) {
            throw new Error(`El producto ID ${pid} no existe`)
        }

        const productIndex = cart.products.findIndex((product) => product.product === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        try {
            await this.saveOnFile();
            return cart;
        } catch (error) {
            throw new Error("Error al guardar el carrito en el archivo");
        }
    }

    async saveOnFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, 2))
        } catch (error) {
            throw new Error("Error al guardar en el archivo");
        }
    }
}

export const cartService = new CartService("./src/db/carts.json");