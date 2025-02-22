"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const JWT_SECRET = "saurabh";
app.post("/api/login/student", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const student = yield db_1.StudentModel.findOne({ email });
        if (!student) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, (_a = student.passwordHash) !== null && _a !== void 0 ? _a : "");
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ email: email }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.json({ token });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/api/login/teacher", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const teacher = yield db_1.TeacherModel.findOne({ email });
        if (!teacher) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, (_a = teacher.passwordHash) !== null && _a !== void 0 ? _a : "");
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ email: email }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.json({ token });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/api/get-student", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const student = yield db_1.StudentModel.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(student);
    }
    catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/api/get-result", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const semester = req.query.semester;
        if (!semester) {
            return res.status(400).json({ error: "Semester is required" });
        }
        const result = yield db_1.ResultModel.findOne({ email, semester });
        if (!result) {
            return res.status(404).json({ error: "Result not found" });
        }
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching result:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/api/get-teacher/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email) {
            return res
                .status(400)
                .json({ error: "Email query parameter is required" });
        }
        const teacher = yield db_1.TeacherModel.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }
        res.json(teacher);
    }
    catch (error) {
        console.error("Error fetching Teacher:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/api/create-student", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, department, name, guardian, address, phone, semester, batch, category, } = req.body;
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        yield db_1.StudentModel.create({
            email,
            passwordHash,
            department,
            name,
            guardian,
            address,
            phone,
            semester,
            batch,
            category,
        });
        res.json({ message: "Student created successfully" });
    }
    catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/api/create-teacher", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, courseCode, name } = req.body;
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        yield db_1.TeacherModel.create({
            email,
            passwordHash,
            courseCode,
            name,
        });
        res.json({ message: "Teacher created successfully" });
    }
    catch (error) {
        console.error("Error creating teacher:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/api/edit-result", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentid, grade, gradepoint, coursecode } = req.body;
        const result = yield db_1.ResultModel.findOne({
            email: studentid + "@iiitkota.ac.in",
        });
        if (!result) {
            return res.status(404).json({ error: "Student not found" });
        }
        const updateResult = yield db_1.ResultModel.updateOne({
            email: studentid + "@iiitkota.ac.in",
            "results.courseCode": coursecode,
        }, {
            $set: {
                "results.$.grade": grade,
                "results.$.gradePoint": gradepoint,
            },
        });
        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ error: "Failed to update result" });
        }
        res.json({ message: "Result updated successfully" });
    }
    catch (error) {
        console.error("Error editing result:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/api/create-challenge", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseCode, studentEmail } = req.body;
        yield db_1.ChallengeModel.create({
            courseCode,
            studentEmail,
        });
        res.json({ message: "Challenge created successfully" });
    }
    catch (error) {
        console.error("Error creating challenge:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/api/get-challenges", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseCode = req.query.courseCode;
        if (!courseCode) {
            return res.status(400).json({ error: "Course code is required" });
        }
        const challenge = yield db_1.ChallengeModel.find({ courseCode });
        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }
        res.json(challenge);
    }
    catch (error) {
        console.error("Error fetching challenge:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.listen(3002);
