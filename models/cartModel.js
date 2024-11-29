const mongoose = require('mongoose');

// Định nghĩa schema giỏ hàng
const cartSchema = new mongoose.Schema({
   
   
        
            productName: { type: String, required: true }, // Tên sản phẩm
            quantity: { type: Number }, // Số lượng
            price: { type: Number }, // Giá sản phẩm
            imageUrl: { type: String, required: true }, // URL ảnh sản phẩm
        
    
   
});




module.exports = mongoose.model('Cart', cartSchema);
