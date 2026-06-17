const Product = require("../model/productmodel");

const createProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      subCategory = "",
      description,
      price,
      stock,
      rating = 0,
      isActive = true,
    } = req.body;

    if (!productName || !category || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "productName, category, description, and price are required",
      });
    }

    const image = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : "";

    const product = await Product.create({
      productName,
      category,
      subCategory,
      description,
      price,
      stock: stock ?? 0,
      rating,
      isActive,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = [
      {
        _id: "1",
        name: "Wheat Bread",
        description: "Fresh whole wheat bread",
        price: 40,
        rating: 4.5,
        category: "Bakery",
        image: "https://tse1.mm.bing.net/th/id/OIP.c4PxJllDgC8mmiJ057_0FwHaFW?pid=Api&P=0&h=180",
      },
      {
        _id: "2",
        name: "Coconut Milk",
        description: "Fresh coconut",
        price: 35,
        rating: 4.7,
        category: "Fruits",
        image: "https://tse4.mm.bing.net/th/id/OIP.3u-RLlgRwb1GCI8TIXUbOAHaE8?pid=Api&P=0&h=180",
      },
     
     
       {
  _id: "3",
  name: "Tuni Breads",
  description: "Fresh whole wheat bread",
  price: 40,
  rating: 4.5,
  category: "Bakery",
  image: "https://i.ibb.co/Lh0wt4GF/Screenshot-2026-06-17-174118.png",
}
    
    ];

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
};
