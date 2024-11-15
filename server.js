// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const CarModel = require('./models/carModels');

// const app = express();
// const port = 3000;
// const api = require('./routes/api');

// app.use('/api', api);
// // Middleware để parse JSON từ yêu cầu
// app.use(express.json());

// // Chuỗi kết nối MongoDB (thay bằng URI của bạn)
// const uri = 'mongodb+srv://admin1:OUe9gKOGZE0T9rAy@cluster0.dfdlq.mongodb.net/MD19303';

// // Kết nối MongoDB khi khởi động server
// const connectDB = async () => {
//     try {
//         await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.error("Error connecting to MongoDB", error);
//         process.exit(1);  // Nếu không thể kết nối thì dừng ứng dụng
//     }
// };

// // Kết nối MongoDB khi server khởi động
// connectDB();

// // Endpoint đọc danh sách xe
// app.get('/', async (req, res) => {
//     try {
//         const cars = await CarModel.find();  // Lấy tất cả xe
//         res.json(cars);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error fetching cars");
//     }
// });

// // Endpoint thêm một xe mới (Sử dụng GET)
// app.get('/add_car', async (req, res) => {
//     try {
//         const car = new CarModel({
//             ten: 'Xe 3',
//             namSX: 2024,
//             hang: 'Mitsubishi',
//             gia: 6500
//         });

//         // Lưu xe vào DB
//         const savedCar = await car.save();
//         console.log(savedCar);

//         // Lấy danh sách các xe sau khi thêm mới và trả lại
//         const cars = await CarModel.find();
//         res.json(cars);  // Trả về danh sách các xe sau khi thêm mới
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error adding car");
//     }
// });

// // Endpoint sửa một xe (Sử dụng GET)
// app.get('/update_car/:id', async (req, res) => {
//     try {
//         const carId = req.params.id;

//         // Tìm xe theo ID và cập nhật thông tin
//         const updatedCar = await CarModel.findByIdAndUpdate(carId, {
//             ten: 'Xe sửa',
//             namSX: 2025,
//             hang: 'Nissan',
//             gia: 7000
//         }, { new: true });  // new: true để trả về xe sau khi cập nhật

//         if (!updatedCar) {
//             return res.status(404).send("Car not found");
//         }

//         // Trả về xe đã được cập nhật
//         res.json(updatedCar);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error updating car");
//     }
// });

// // Endpoint xóa một xe (Sử dụng GET)
// app.get('/delete_car/:id', async (req, res) => {
//     try {
//         const carId = req.params.id;

//         // Tìm và xóa xe theo ID
//         const deletedCar = await CarModel.findByIdAndDelete(carId);

//         if (!deletedCar) {
//             return res.status(404).send("Car not found");
//         }

//         // Trả về thông báo xóa thành công
//         res.send(`Car with ID ${carId} deleted successfully`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error deleting car");
//     }
// });

// // Lắng nghe yêu cầu
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// });

// module.exports = app;


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const carRouter = require('./routes/carRouter'); // Importing carRouter

const app = express();
const port = 3000;

// Middleware để parse JSON và URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Serve static files for image uploads (stored in uploads/)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Cấu hình middleware để phục vụ các file trong thư mục "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'routes/uploads')));

// MongoDB connection
const uri = 'mongodb+srv://admin1:OUe9gKOGZE0T9rAy@cluster0.dfdlq.mongodb.net/MD19303';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB', error));

// Use the carRouter for all car-related endpoints
app.use('/api/cars', carRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
