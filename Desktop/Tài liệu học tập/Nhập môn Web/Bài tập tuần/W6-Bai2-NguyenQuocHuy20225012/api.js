const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const StudentModel = require('./studentModel');

// Kết nối MongoDB
const query = async () => {
    try {
        await mongoose.connect('mongodb+srv://dobalam:dobalam-it4409@lamdb-it4409.ybiwz.mongodb.net/College?retryWrites=true&w=majority&appName=lamdb-it4409 ', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

mongoose.Promise = global.Promise;
query();

// Tạo sinh viên mới
router.post('/save', async (req, res) => {
    try {
        const newStudent = new StudentModel({
            studentId: req.body.studentId,
            name: req.body.name,
            dob: req.body.dob,
            address: req.body.address
        });

        const savedStudent = await newStudent.save();
        res.status(200).send({ message: "Data inserted", data: savedStudent });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

// Lấy tất cả sinh viên
router.get('/findall', async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.status(200).send(students);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

// Xóa theo studentId
router.post('/delete', async function (req, res) {
    try {
        const deletedStudent = await StudentModel.findOneAndDelete({ studentId: req.body.studentId });
        if (!deletedStudent) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.status(200).send({ message: "Deleted", data: deletedStudent });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

// Cập nhật sinh viên
router.post('/update', async (req, res) => {
    try {
        const updatedStudent = await StudentModel.findByIdAndUpdate(
            req.body.id,
            {
                name: req.body.name,
                dob: req.body.dob,
                address: req.body.address
            },
            { new: true }
        );
        res.status(200).send({ message: "Updated", data: updatedStudent });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

// Tìm kiếm theo tên
router.get('/search/name', async (req, res) => {
    try {
        const keyword = req.query.q || '';
        const result = await StudentModel.find({
            name: { $regex: keyword, $options: 'i' }
        });
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

// Tìm kiếm theo địa chỉ
router.get('/search/address', async (req, res) => {
    try {
        const keyword = req.query.q || '';
        const result = await StudentModel.find({
            address: { $regex: keyword, $options: 'i' }
        });
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
