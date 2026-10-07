const mongoose = require("mongoose");
const {
  readConnection,
  writeConnection
} = require("../config/database");

const bookSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    vat: {
      type: Number,
      required: true
    },

    priceAfterTax: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Model dùng tài khoản chỉ đọc
const ReadBook = readConnection.model(
  "Book",
  bookSchema,
  "books"
);

// Model dùng tài khoản chỉ ghi
const WriteBook = writeConnection.model(
  "Book",
  bookSchema,
  "books"
);

module.exports = {
  ReadBook,
  WriteBook
};