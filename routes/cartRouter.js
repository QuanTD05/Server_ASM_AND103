const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');

// Middleware body parser
const bodyParser = require('body-parser');
const cartModel = require('../models/cartModel');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Lấy giỏ hàng
router.get('/xe', async (req, res) => {
    try {
        const cart = await cartModel.find(); // Lấy giỏ hàng duy nhất (không theo userId)
        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy giỏ hàng.', details: error });
    }
});
// Get the total price of all items in the cart
router.get('/total', async (req, res) => {
    try {
        const cart = await cartModel.find({}); // Get the cart

        const totalPrice = cart.reduce((total, bill) => total + (bill.quantity * bill.price), 0);
        res.status(200).json({ totalPrice });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating total price', error });
    }
});


// Thêm sản phẩm vào giỏ hàng
router.post('/add', async (req, res) => {
    const { productName, quantity, price, imageUrl } = req.body;
    try {
        const { productName, quantity, price, imageUrl } = req.body;
        const newBill = new cartModel({  productName,quantity,price,imageUrl});
        await newBill.save();
        res.status(200).json({ message: 'Bill added successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error adding bill', error });
      }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update/:productName', async (req, res) => {
    const { productName } = req.params;
    const { quantity, price } = req.body;

    try {
        const cart = await Cart.findOne();

        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });
        }

        const itemIndex = cart.items.findIndex(item => item.productName === productName);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng.' });
        }

        // Cập nhật số lượng và giá
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = price;

        // Cập nhật tổng giá trị giỏ hàng
        cart.total = cart.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        await cart.save();
        res.status(200).json({ message: 'Cập nhật sản phẩm thành công.', cart });
    } catch (error) {
        res.status(500).json({ error: 'Không thể cập nhật sản phẩm.', details: error });
    }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/xoa/:id', async (req, res) => {
    const { productName } = req.params;

    try {
        const cart = await Cart.findOne();

        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });
        }

        // Lọc bỏ sản phẩm cần xóa
        cart.items = cart.items.filter(item => item.productName !== productName);

        // Cập nhật tổng giá trị giỏ hàng
        cart.total = cart.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        await cart.save();
        res.status(200).json({ message: 'Xóa sản phẩm thành công.', cart });
    } catch (error) {
        res.status(500).json({ error: 'Không thể xóa sản phẩm khỏi giỏ hàng.', details: error });
    }
});

module.exports = router;
