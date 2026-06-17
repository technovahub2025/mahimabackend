const Cart = require("../model/cartmodel");

const normalizeQuantity = (quantity) => {
  const parsed = Number(quantity);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

const getCartId = (req) =>
  String(req.body?.cartId || req.query?.cartId || req.headers["x-cart-id"] || "default");

const getCartSummary = (cart) => {
  const items = cart?.items || [];

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return { items, totalQuantity, totalAmount };
};

const validateProductPayload = (body) => {
  const { productId, name, price } = body;

  if (!productId || !name || price === undefined) {
    return "productId, name, and price are required";
  }

  return null;
};

const addToCart = async (req, res) => {
  try {
    const cartId = getCartId(req);
    const validationError = validateProductPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const {
      productId,
      name,
      description = "",
      price,
      rating = 0,
      category = "",
      image = "",
    } = req.body;

    const quantity = normalizeQuantity(req.body.quantity);

    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      cart = new Cart({
        cartId,
        items: [
          {
            productId: String(productId),
            name,
            description,
            price: Number(price),
            rating: Number(rating),
            category,
            image,
            quantity,
          },
        ],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId === String(productId)
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({
          productId: String(productId),
          name,
          description,
          price: Number(price),
          rating: Number(rating),
          category,
          image,
          quantity,
        });
      }
    }

    await cart.save();

    const summary = getCartSummary(cart);

    res.status(200).json({
      message: "Added to cart",
      cart: summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cartId = getCartId(req);
    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: {
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        },
      });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      cart: getCartSummary(cart),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartId = getCartId(req);
    const { productId } = req.params;
    const quantity = normalizeQuantity(req.body.quantity);

    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((entry) => entry.productId === String(productId));

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Cart item updated",
      cart: getCartSummary(cart),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartId = getCartId(req);
    const { productId } = req.params;

    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== String(productId)
    );

    await cart.save();

    res.status(200).json({
      message: "Removed from cart",
      cart: getCartSummary(cart),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cartId = getCartId(req);

    await Cart.findOneAndDelete({ cartId });

    res.status(200).json({
      message: "Cart cleared",
      cart: {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
