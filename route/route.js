const express = require("express");
const router = express.Router();

const register  = require("../controller/userregister");
const  login  = require("../controller/userlogin");
const { sendOtp } = require("../controller/sendotp");
const { verifyOtp } = require("../controller/verifyotp");
const authMiddleware = require("../middleware/authmiddleware");
const {
  addToCart,
  getCart,
  updateCartItem,
  clearCart,
  removeFromCart,
} = require("../controller/cartcontroller");
const upload = require("../middleware/upload");
const { checkout } = require("../controller/checkout");
const adminlogin = require("../controller/adminlogin");
const { createProduct, getProducts } = require("../controller/productcontroller");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/odercontroller");

// Register Route
router.post("/userregister", register);

// Login Route
// Admin login is handled first; if not admin, it falls through to user login.
router.post("/login", adminlogin, login);


router.post("/sendotp", sendOtp);

router.post("/verifyotp",verifyOtp);
router.post(
  "/products",
  authMiddleware,
  upload.single("image"),
  createProduct
);

router.get("/products", getProducts);
router.get("/getproducts", getProducts);

// NOT deleteProduct
router.post("/cart", addToCart);
router.get("/cart", getCart);
router.put("/cart/:productId", updateCartItem);
router.delete("/cart/:productId", removeFromCart);
router.delete("/cart", clearCart);

router.post("/checkout", checkout);
router.post("/orders/checkout", checkout);
router.post("/orders", authMiddleware, createOrder);
router.get("/orders", authMiddleware, getOrders);
router.get("/orders/:id", authMiddleware, getOrderById);
router.put("/orders/:id", authMiddleware, updateOrder);
router.patch("/orders/:id/status", authMiddleware, updateOrderStatus);
router.delete("/orders/:id", authMiddleware, deleteOrder);


module.exports = router;
