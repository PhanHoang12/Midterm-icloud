const express = require("express");
const router = express.Router();

const {
  ReadBook,
  WriteBook
} = require("../models/Book");

const MSSV = process.env.MSSV;
const PREFIX = MSSV.slice(-3);

const lastDigit = Number(MSSV.slice(-1));
const VAT_RATE = lastDigit + 4;

// GET danh sách sách
router.get("/", async (req, res) => {
  try {
    const books = await ReadBook.find().lean();

    res.render("books/index", {
      books,
      studentName: process.env.FULL_NAME,
      studentId: MSSV,
      vatRate: VAT_RATE
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Không thể lấy danh sách sách");
  }
});

// POST thêm sách
router.post("/", async (req, res) => {
  try {
    const {
      productCode,
      name,
      price
    } = req.body;

    // Kiểm tra mã sản phẩm phải bắt đầu bằng 204
    if (!productCode.startsWith(PREFIX)) {
      return res.status(400).send(
        `Mã sản phẩm phải bắt đầu bằng ${PREFIX}`
      );
    }

    // Chuyển giá về Number
    const originalPrice = Number(price);

    if (
      Number.isNaN(originalPrice) ||
      originalPrice < 0
    ) {
      return res.status(400).send(
        "Giá sản phẩm không hợp lệ"
      );
    }

    // Tính giá sau thuế
    const priceAfterTax =
      originalPrice * (1 + VAT_RATE / 100);

    // Ghi bằng WRITE account
    await WriteBook.create({
      productCode,
      name,
      price: originalPrice,
      vat: VAT_RATE,
      priceAfterTax
    });

    res.redirect("/books");

  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Không thể thêm sách"
    );
  }
});

module.exports = router;