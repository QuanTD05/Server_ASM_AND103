const express = require('express');
const router = express.Router();
const carModel = require('../models/carModels');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Middleware for body parser
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu ảnh vào thư mục uploads
const storage = multer.diskStorage({
    destination:'./routes/uploads',
    filename: (req, file, cb) =>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }

    // destination: function (req, file, cb) {
    //     const uploadPath = path.join(__dirname, 'uploads'); // Thư mục lưu ảnh
    //     console.log("Uploading to: ", uploadPath); // Kiểm tra đường dẫn thư mục
    //     cb(null, uploadPath);
    // },
    // filename: function (req, file, cb) {
    //     // Đặt tên file là timestamp + phần mở rộng của ảnh
    //     cb(null, Date.now() + path.extname(file.originalname));
    // }
});

const upload = multer({ storage: storage });

// Định nghĩa các route API

// Route mặc định
router.get('/', (req, res) => {
    res.send('Welcome to the mobile API');
});

// Route lấy tất cả xe
router.get('/list', async (req, res) => {
    try {
        let cars = await carModel.find();
        res.send(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cars" });
    }
});

// Route lấy xe theo ID
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

// Route thêm một xe mới cùng ảnh
// Route thêm một xe mới cùng ảnh
// Route thêm một xe mới cùng ảnh
router.post('/add_xe', upload.single('anh'), async (req, res) => {
    // Kiểm tra nếu không có file nào được tải lên
    if (!req.file) {
        return res.status(400).json({ error: "No images uploaded" });
    }

    try {
        // Lấy dữ liệu từ body request
        const data = req.body;
        const file = req.file;

        // Tạo URL ảnh đầy đủ
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

        // Tạo mới xe với dữ liệu và URL ảnh
        const newCar = new carModel({
            ten: data.ten,
            namSX: data.namSX,
            hang: data.hang,
            gia: data.gia,
            anh: imageUrl,
            mota: data.mota,  // Lưu đường dẫn ảnh vào cột "anhxe"
        });

        // Lưu xe mới vào cơ sở dữ liệu
        await newCar.save();

        // Gửi phản hồi thành công
        return res.status(201).json({
            "status": 200,
            "message": "Thêm thành công",
            "data": newCar
        });
        
    } catch (error) {
        console.log(error);
        // Gửi phản hồi lỗi
        return res.status(500).json({
            "status": 500,
            "message": "Đã xảy ra lỗi",
            "data": []
        });
    }
});



// Route xóa xe theo ID
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

// router.put('/update', async (req, res) => { // router.put
//     await mongoose.connect(COMMON.uri);

//     let car = req.body;

//     console.log(car)

//     //await carModel.updateOne({ten: tenXe}, {ten: tenXeMoi});

//     let xehois = await carModel.find({});

//     res.json(xehois); // tra ve du lieu dang json cho app
// })

// router.put('/update/:ten', async (req, res) => { // router.put
    
//     console.log('Ket noi DB thanh cong');

//     let tenXe = req.params.ten;
//     console.log(tenXe);

//     let tenXeMoi = tenXe + ' Phien ban moi 2024';

//     await carModel.updateOne({ten: tenXe}, {ten: tenXeMoi});

//     let xehois = await carModel.find({});

//     res.json(xehois); // tra ve du lieu dang json cho app
// });
// Sử dụng id thay vì ten
router.put('/update/:id', async (req, res) => { 
    const carId = req.params.id; // Lấy ID từ URL
    const data = req.body; // Lấy dữ liệu cần cập nhật từ body

    try {
        // Tìm xe cần cập nhật
        let updatecar = await carModel.findById(carId);

        if (!updatecar) {
            return res.status(404).json({ message: 'Không tìm thấy xe!' });
        }

        // Cập nhật các trường dữ liệu
        updatecar.ten = data.ten ? data.ten + ' Phiên bản mới 2024' : updatecar.ten;
        updatecar.namSX = data.namSX ?? updatecar.namSX;
        updatecar.hang = data.hang ?? updatecar.hang;
        updatecar.gia = data.gia ?? updatecar.gia;
        updatecar.anh = data.anh ?? updatecar.anh;
        updatecar.mota = data.mota ?? updatecar.mota;

        // Lưu thay đổi
        const result = await updatecar.save();

        res.status(200).json({ message: 'Cập nhật thành công!', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật xe!', error });
    }
});




module.exports = router;
