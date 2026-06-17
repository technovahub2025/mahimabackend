const Order = require("../model/ordermodel");
const Product = require("../model/productmodel");
const Quotation = require("../model/quotationmodel");

// DASHBOARD
const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalQuotations = await Quotation.countDocuments();

    const sales = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalQuantity: { $sum: "$totalQuantity" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalQuotations,
        totalRevenue: sales[0]?.totalRevenue || 0,
        totalQuantity: sales[0]?.totalQuantity || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CATEGORY SALES PERCENTAGE
const getCategorySalesPercentage = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.category",
          totalSold: { $sum: "$items.quantity" },
          totalAmount: { $sum: "$items.total" },
        },
      },
    ]);

    const totalSold = result.reduce((sum, item) => sum + item.totalSold, 0);

    const percentage = result.map((item) => ({
      category: item._id,
      totalSold: item.totalSold,
      totalAmount: item.totalAmount,
      percentage:
        totalSold === 0 ? 0 : ((item.totalSold / totalSold) * 100).toFixed(2),
    }));

    res.status(200).json({
      success: true,
      data: percentage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PRODUCT-WISE SALES
const getProductSales = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          category: { $first: "$items.category" },
          totalSold: { $sum: "$items.quantity" },
          totalAmount: { $sum: "$items.total" },
        },
      },
      { $sort: { totalSold: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SALES GRAPH DAY / WEEK / MONTH
const getSalesGraph = async (req, res) => {
  try {
    const { type, date } = req.query;

    let startDate;
    let endDate = new Date();

    if (date) {
      startDate = new Date(date);
      endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
    } else if (type === "day") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (type === "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (type === "month") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    }

    const result = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "Cancelled" },
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          quantity: { $sum: "$totalQuantity" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getCategorySalesPercentage,
  getProductSales,
  getSalesGraph,
};