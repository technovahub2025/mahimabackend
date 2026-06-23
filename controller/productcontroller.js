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
        productName: "Wheat Bread",
        description: "Fresh whole wheat bread",
        price: 40,
        rating: 4.5,
        category: "Bread",
        image:
          "https://res.cloudinary.com/dlepujzgc/image/upload/f_auto,q_auto/wheatbread_zn8qtf",
      },
      {
        _id: "2",
        productName: "White Bread",
        description: "Fresh soft white bread",
        price: 35,
        rating: 4.7,
        category: "Bread",
        image:
          "https://res.cloudinary.com/dlepujzgc/image/upload/v1782214135/white_bread_alb0xp.jpg",
      },
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
