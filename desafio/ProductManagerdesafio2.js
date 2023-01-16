import fs from 'fs';
export default class ProductManager {
    constructor() {
        this.id = 0;
        this.path = './products.json';
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        if (title && description && price && thumbnail && code && stock != undefined) {
            const productsDocument = await fs.promises.readFile(this.path);
            const productsJSON = JSON.parse(productsDocument);
            if (productsJSON.products.find((product) => product.code === code)) {
                return console.log('Error al agregar el producto, el producto ya esta en el arreglo');
            } else {
                this.id = productsJSON.products.length;
                const product = {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    id: this.id,
                };
                productsJSON.products.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(productsJSON));
                console.log('El producto se agrego al arreglo correctamente');
            }
        } else {
            return console.log('Error al agregar el producto, hubo parametros sin completar');
        }
    }
    async getProducts() {
        const productsDocument = await fs.promises.readFile(this.path);
        const productsJSON = JSON.parse(productsDocument);
        const respuesta = [];
        if (productsJSON.products.length > 0) {
            productsJSON.products.forEach((product) => respuesta.push(product))
        }
        return respuesta
    }
    getProductById = async(id) => {
        if (fs.existsSync(`./products.json`)) {
            const objects = await JSON.parse(fs.readFileSync(this.path));

            let idToSearch = (element) => element.id === id;
            let position = await objects.products.findIndex(idToSearch);
            if (position == -1) {
                return "No se encuentra ningún producto con ese ID"
            } else {
                return objects[position];
            }
        } else {
            console.log("No se encontró el archivo");        
        }    
    }


    async updateProducts(id, object) {
        if (id || object != undefined) {
            const productsDocument = await fs.promises.readFile(this.path);
            const productsJSON = JSON.parse(productsDocument);
            if (productsJSON.products.find((product) => product.id === id)) {
                let productIndex = productsJSON.products.findIndex((product) => product.id === id);
                let productFilter = productsJSON.products.filter((product) => product.id === id);
                productFilter = {...productFilter[0], ...object };
                productsJSON.product.splice(productIndex, 1, productFilter);
                await fs.promises.writeFile(this.path, JSON.stringify(productsJSON));
                console.log('El producto fue actualizado correctamente');
            } else {
                return console.log('No se encontro el producto con el id ingresado');
            }
        } else {
            return console.log('Error al actualizar producto, hubo parametros sin completar');
        }
    }

    async deleteProduct(id) {
        if (id != undefined) {
            const productsDocument = await fs.promises.readFile(this.path);
            const productsJSON = JSON.parse(productsDocument);
            if (productsJSON.products.find((product) => product.id === id)) {
                const productIndex = productsJSON.products.findIndex((product) => product.id === id);
                productsJSON.products.splice(productIndex, 1);
                productsJSON.products.forEach((product) => product.id--);
                await fs.promises.writeFile(this.path, JSON.stringify(productsJSON));
                console.log('Producto Eliminado Exitosamente');
            }
        } else {
            return console.log('Error,hubo parametros sin completar');
        }
    }
}