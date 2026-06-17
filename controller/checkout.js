const Cart = require("../model/cartmodel");
const Order = require("../model/ordermodel");

const buildOrderItems = (items) =>
  items.map((item) => ({
    productId: item.productId,
    name: item.name,
    description: item.description || "",
    price: Number(item.price),
    rating: Number(item.rating || 0),
    category: item.category || "",
    image: item.image || "",
    quantity: Number(item.quantity),
    total: Number(item.price) * Number(item.quantity),
  }));

const checkout = async (req, res) => {
  try {
    const cartId = String(
      req.body?.cartId || req.query?.cartId || req.headers["x-cart-id"] || "default"
    );
    const { customerName, email = "", phone, address } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        message: "customerName, phone, and address are required",
      });
    }

    const cart = await Cart.findOne({ cartId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const items = buildOrderItems(cart.items);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const order = await Order.create({
      cartId,
      customerName,
      email,
      phone,
      address,
      items,
      totalQuantity,
      totalAmount,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    await Cart.findOneAndDelete({ cartId });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { checkout };
