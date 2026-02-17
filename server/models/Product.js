import mongoose from "mongoose";

// import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: Array },
    category: { type: String },
    inStock: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
