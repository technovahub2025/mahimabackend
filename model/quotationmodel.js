const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productName: String,
        category: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
    },

    validTill: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Sent", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", quotationSchema);