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



        price: 160,



        rating: 4.9,



        category: "Bread",



        image:

"https://cdn.phototourl.com/free/2026-09-09-a2ba6e73-4b73-47b5-a98d-00257d9c2c97.jpg",



      },



      {



        _id: "2",



        productName: "White Bread",



        description: "Fresh soft white bread",



        price: 110,



        rating: 4.8,



        category: "Bread",



        image:



          "https://cdn.phototourl.com/free/2026-09-09-5df1e17a-680c-4e63-97a6-b32b627dac1a.jpg",


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
