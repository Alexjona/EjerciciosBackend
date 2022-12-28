const fs = require("fs");

const writeFile = (path, products) =>
    fs.promises.writeFile(path, JSON.stringify({ products: products }));

const readFile = async(path) => {
    const asyncGetProducts = await fs.promises.readFile(path);
    const parseResult = JSON.parse(asyncGetProducts);

    return parseResult;
};

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    initialize = async() => {
        const existsFile = fs.existsSync(this.path);

        if (existsFile) {
            console.log("El archivo ya existía!");
            const { products } = await readFile(this.path);
            this.products = products;
        } else {
            await writeFile(this.path, this.products);
            console.log("El archivo se creó exitosamente!");
        }
    };

    getProducts = async() => {
        const fileData = await readFile(this.path);
        return fileData;
    };

    addProduct = async({ title, desc, price, thumbnail, code, stock }) => {
        // Aqui solo valido por el título o por el código, no hay problema que se repita cualquiera de los otros campos
        const findedProduct = this.products.find(
            (product) => product.title === title || product.code === code
        );

        if (findedProduct) {
            console.log(
                `Error ya existe un producto con ese titulo ${title} o código ${code} `
            );
        } else {
            const id = this.products.length + 1;
            this.products.push({
                id,
                title,
                desc,
                price,
                thumbnail,
                code,
                stock,
            });
            await writeFile(this.path, this.products);
            console.log("Producto creado exitosamente");
        }
    };

    getProductById = (id) => {
        const findedProduct = this.products.find(
            (product) => product.id === id
        );

        if (findedProduct) {
            return findedProduct;
        } else {
            console.log("No se encuentra un producto con ese id");
            return null;
        }
    };

    updateProduct = async(id, newProduct) => {
        const findIndexProduct = this.products.findIndex(
            (product) => product.id === id
        );

        if (findIndexProduct !== -1) {
            const id = this.products[findIndexProduct].id;

            this.products[findIndexProduct] = {
                id,
                ...newProduct,
            };
            await writeFile(this.path, this.products);
            console.log("Actualizado correctamente");
        } else {
            console.log("No se encuentra un producto con ese id");
        }
    };

    deleteProduct = async(id) => {
        const findIndexProduct = this.products.findIndex(
            (product) => product.id === id
        );

        if (findIndexProduct !== -1) {
            const newProducts = this.products.filter(
                (product) => product.id !== id
            );
            await writeFile(this.path, newProducts);
            console.log("Eliminado correctamente");
        } else {
            console.log("No se encuentra un producto con ese id");
        }
    };
}

async function main() {
    const productManger = new ProductManager("./data.json");
    await productManger.initialize();

    let products = await productManger.getProducts();
    console.log(products);

    const newProduct = {
        title: "Celular Nokia 5",
        desc: "Celular",
        price: "5000",
        thumbnail: "asdasd",
        code: "1234",
        stock: "10",
    };

    await productManger.addProduct(newProduct);

    products = await productManger.getProducts();
    console.log(products);

    const productToUpdate = {
        title: "Celular Nokia 6",
        desc: "Celular",
        price: "7000",
        thumbnail: "asdasd",
        code: "1234",
        stock: "12",
    };

    await productManger.updateProduct(1, productToUpdate);

    products = await productManger.getProducts();
    console.log(products);

    await productManger.deleteProduct(1);

    products = await productManger.getProducts();
    console.log(products);
}

main();