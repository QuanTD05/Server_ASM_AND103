const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const CarModel = require('../models/carModels');

// Add or update an item in the cart
router.post('/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        // Check if the product exists
        const product = await CarModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already in the cart
        let cartItem = await Cart.findOne({ productId });

        if (cartItem) {
            // Update quantity and price if the item exists in the cart
            cartItem.quantity += quantity;
            cartItem.price = product.gia * cartItem.quantity; // Calculate the updated price
            await cartItem.save();
        } else {
            // Add a new item to the cart
            cartItem = new Cart({
                productId,
                quantity,
                price: product.gia * quantity
            });
            await cartItem.save();
        }

        res.status(201).json({ message: 'Item added to cart', cartItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
});

// Get all cart items
router.get('/items', async (req, res) => {
    try {
        const cartItems = await Cart.find().populate('productId'); // Populate product details from CarModel
        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart items', error });
    }
});

router.post('/cart/confirmPayment', async (req, res) => {
    try {
        const cartItems = req.body.cartItems; // Assuming the request contains a list of cart items
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Process the payment here (e.g., deduct stock, create an order, etc.)
        const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

        // Assuming successful payment processing
        await Cart.deleteMany(); // Clear the cart after confirmation

        res.status(200).json({ message: 'Payment confirmed', totalAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing payment', error });
    }
});


// Update cart item quantity
router.put('/update/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItemId = req.params.id;

        if (!quantity) {
            return res.status(400).json({ message: 'Quantity is required' });
        }

        const cartItem = await Cart.findById(cartItemId).populate('productId');
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        cartItem.price = cartItem.productId.gia * quantity; // Update price based on quantity
        await cartItem.save();

        res.status(200).json({ message: 'Cart item updated', cartItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating cart item', error });
    }
});

// Remove an item from the cart
router.delete('/remove/:id', async (req, res) => {
    try {
        const cartItemId = req.params.id;

        const cartItem = await Cart.findByIdAndDelete(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Cart item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing cart item', error });
    }
});

// Checkout (clear the cart after payment)
router.post('/checkout', async (req, res) => {
    try {
        const cartItems = await Cart.find().populate('productId');

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

        // Optional: Save the order details to an Order model (not implemented here)

        // Clear the cart after checkout
        await Cart.deleteMany();

        res.status(200).json({ message: 'Checkout successful', totalPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during checkout', error });
    }
});

module.exports = router;
