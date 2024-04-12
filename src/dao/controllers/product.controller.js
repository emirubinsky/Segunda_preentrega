import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const productController = {
    getProducts: async (req, res) => {
        const { category, brand, sort } = req.query;
        let currentPage = req.query.page || 1;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;

        try {
            const carts = await Cart.find({}).lean();

            let query = {};

            if (category) {
                query.category = category;
            }

            if (brand) {
                query.brand = brand;
            }

            const options = {
                limit: 10,
                page: currentPage,
                sort: { price: sort === 'asc' ? 1 : -1 }
            };

            const filter = await Product.paginate(query, options);
            const products = filter.docs.map(product => product.toObject());

            /*
            if (req.accepts('html')) {
                return res.render('realTimeProducts', { Products: products, Query: filter, Carts: carts, user, isAuthenticated });
            
            }*/
            res.json({ Products: products, Query: filter, Carts: carts });
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductDetail: async (req, res) => {
        const productId = req.params.pid;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;

        try {
            const productDetail = await Product.findOne({ _id: productId }).lean();

            /* HTML
            if (req.accepts('html')) {
                return res.render('product', { Product: productDetail, user, isAuthenticated });
            
            }*/
            res.json(productDetail, user, isAuthenticated);
        }
        catch (err) {
            console.error("Error al ver los detalles:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductCategory: async (req, res) => {
        const category = req.params.category;
        const { brand, sort } = req.query;
        let currentPage = req.query.page || 1;
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;

        try {
            const options = {
                page: currentPage,
                limit: 10,
                sort: { price: sort === 'asc' ? 1 : -1 }
            };

            let query = { category };

            if (brand) {
                query.brand = brand;
            }

            // Paginar los productos de la categoría
            const filter = await Product.paginate(query, options);
            const filterDoc = filter.docs.map(product => product.toObject());

            /* HTML   
            if (req.accepts('html')) {
                return res.render('category', {
                    Category: filterDoc,
                    Query: filter,
                    user,
                    isAuthenticated,
                });
            }*/

            res.json({
                Category: filterDoc,
                Query: filter,
                user,
                isAuthenticated,
            });
        } catch (err) {
            console.error("Error al ver la categoria:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addProduct: async (req, res) => {
        const { title, brand, description, price, stock, category } = req.body;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const newProduct = new Product({
                title,
                brand,
                description,
                price,
                stock,
                category,
                image: imageName,
            });

            await newProduct.save();

            return res.json({
                message: "Producto creado!!!",
                Product: newProduct,
            });
        } catch (err) {
            console.error("Error al guardar el Producto:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    deleteProduct: async (req, res) => {
        const productId = req.params.pid;

        try {
            const deleteProduct = await Product.deleteOne({ _id: productId }).lean();

            const products = await Product.find().lean();

            if (deleteProduct.deletedCount === 0) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            return res.json({ message: "Producto eliminado!", listProduct: products });
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    }
}

export default productController;