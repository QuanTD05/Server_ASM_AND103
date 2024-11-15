// const express = require('express');
// const router = express.Router();
// const carModel = require('../models/carModels');

// // Middleware for body parser
// const bodyParser = require("body-parser");
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

// // Default route
// router.get('/', (req, res) => {
//     res.send('Welcome to the mobile API');
// });

// // Route to get list of cars
// router.get('/list', async (req, res) => {
//     try {
//         let cars = await carModel.find();
//         console.log(cars);
//         res.send(cars);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch cars" });
//     }
// });

// // Route to get a car by ID
// router.get('/car/:id', async (req, res) => {
//     try {
//         const car = await carModel.findById(req.params.id);
//         if (!car) {
//             return res.status(404).json({ error: "Car not found" });
//         }
//         res.json(car);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch car details" });
//     }
// });

// // Route to add a new car
// router.post('/add_xe', async (req, res) => {
//     try {
//         let car = req.body;
//         console.log(car);
//         await carModel.create(car);

//         let cars = await carModel.find();
//         res.status(201).json(cars); // Return updated list of cars with status 201 (Created)
//     } catch (error) {
//         res.status(500).json({ error: "Error adding car" });
//     }
// });

// // Route to delete a car by ID
// router.delete('/xoa/:id', async (req, res) => {
//     try {
//         let id = req.params.id;
//         console.log(id);
//         const result = await carModel.deleteOne({ _id: id });

//         if (result.deletedCount === 0) {
//             return res.status(404).json({ error: "Car not found" });
//         }

//         res.status(200).json({ message: "Car deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Error deleting car" });
//     }
// });

// // Route to update a car by name (adjusted to use PUT)
// // router.put('/update/:ten', async (req, res) => {
// //     let tenXe = req.params.ten;
// //     console.log(tenXe);

// //     let tenXeMoi = tenXe + ' Phien ban moi 2024';
// //     await carModel.updateOne({ ten: tenXe }, { ten: tenXeMoi });

// //     let xehois = await carModel.find({});
// //     res.send(xehois);
// // });

// router.put('/update/:ten', async (req, res) => {
//     const carName = req.params.ten;
//     const updatedCarData = req.body;

//     try {
//         const result = await carModel.findOneAndUpdate({ ten: carName }, updatedCarData, { new: true });
//         if (!result) {
//             return res.status(404).json({ error: "Car not found" });
//         }
//         res.status(200).json({ message: "Car updated successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Error updating car" });
//     }
// });


// module.exports = router;



const express = require('express');
const router = express.Router();
const carModel = require('../models/carModels');
const multer = require('multer');
const path = require('path');

// Middleware for body parser
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình multer để lưu trữ file ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file ảnh duy nhất
    }
});
const upload = multer({ storage: storage });

// Default route
router.get('/', (req, res) => {
    res.send('Welcome to the mobile API');
});

// Route để lấy danh sách xe
router.get('/list', async (req, res) => {
    try {
        let cars = await carModel.find();
        res.send(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cars" });
    }
});

// Route để lấy thông tin xe theo ID
router.get('/car/:id', async (req, res) => {
    try {
        const car = await carModel.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch car details" });
    }
});

// Route để thêm xe mới với ảnh
router.post('/add_xe', upload.single('anh'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }
    try {
        let carData = req.body;
        carData.anhXe = `/uploads/${req.file.filename}`;
        
        const newCar = await carModel.create(carData);
        res.status(201).json(newCar);
    } catch (error) {
        res.status(500).json({ error: "Error adding car" });
    }
});


// Route để xóa xe theo ID
router.delete('/xoa/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await carModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting car" });
    }
});

// Route để cập nhật thông tin xe theo tên
// router.put('/update/:ten', async (req, res) => {
//     const carName = req.params.ten;
//     const updatedCarData = req.body;

//     try {
//         const result = await carModel.findOneAndUpdate({ ten: carName }, updatedCarData, { new: true });
//         if (!result) {
//             return res.status(404).json({ error: "Car not found" });
//         }
//         res.status(200).json({ message: "Car updated successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Error updating car" });
//     }
// });

// Route cập nhật xe theo ID
router.put('/update/:id', async (req, res) => {
    const carId = req.params.id;
    const updatedCarData = req.body;  // Lấy thông tin xe từ body request

    try {
        // Tìm và cập nhật xe dựa trên ID
        const result = await carModel.findByIdAndUpdate(carId, updatedCarData, { new: true });
        if (!result) {
            return res.status(404).json({ error: "Xe không tồn tại" });
        }
        res.status(200).json({ message: "Cập nhật xe thành công", data: result });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật xe" });
    }
});


module.exports = router;

