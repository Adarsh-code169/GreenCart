import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/Product';


export const addProduct = async (req, res) => {
    try{
        let productData =JSON.parse(req.body.productData);  

        const image = req.files;

        let imagesUrl = await Promise.all(
            images.map(async (item=>{
                let result = await cloudinary.uploader.upload(item.path,
                {resource_type: "iamge"});
                return result.secure_url;
            }))
        ) 
        await Product.create({...productData, image:imagesUrl});
        res.json({success:true, message:"Product Added Successfully"}) 
    }catch(error){
        console.log(error.message);
        res.json({success:false, message:error.message})
    }

}

export const productList = async (req, res) => {
    try{
        const products = await Product.find({});
        res.json({success:true, products})
    }catch(error){
        console.log(error.message);
        res.json({success:false, message:error.message})
    }

}

export const productById = async (req, res) => {

}

export const changeStock = async (req, res) => {

}