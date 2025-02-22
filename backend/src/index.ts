import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcryptjs";
import { StudentModel, TeacherModel, ResultModel, ChallengeModel } from "./db";

const app = express();
app.use(express.json());
app.use(cors());
const JWT_SECRET = "saurabh";

app.post("/api/login/student", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const student = await StudentModel.findOne({ email });
    if (!student) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      student.passwordHash ?? ""
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email: email }, JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login/teacher", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const teacher = await TeacherModel.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      teacher.passwordHash ?? ""
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email: email }, JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get-student", async (req: any, res: any) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const student = await StudentModel.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get-result", async (req: any, res: any) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const semester = req.query.semester as Number;
    if (!semester) {
      return res.status(400).json({ error: "Semester is required" });
    }

    const result = await ResultModel.findOne({ email, semester });
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get-teacher/", async (req: any, res: any) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res
        .status(400)
        .json({ error: "Email query parameter is required" });
    }

    const teacher = await TeacherModel.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error fetching Teacher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/create-student", async (req: any, res: any) => {
  try {
    const {
      email,
      password,
      department,
      name,
      guardian,
      address,
      phone,
      semester,
      batch,
      category,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    await StudentModel.create({
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
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/create-teacher", async (req: any, res: any) => {
  try {
    const { email, password, courseCode, name } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    await TeacherModel.create({
      email,
      passwordHash,
      courseCode,
      name,
    });

    res.json({ message: "Teacher created successfully" });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/edit-result", async (req: any, res: any) => {
  try {
    const { studentid, grade, gradepoint, coursecode } = req.body;
    const result = await ResultModel.findOne({
      email: studentid + "@iiitkota.ac.in",
    });
    if (!result) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updateResult = await ResultModel.updateOne(
      {
        email: studentid + "@iiitkota.ac.in",
        "results.courseCode": coursecode,
      },
      {
        $set: {
          "results.$.grade": grade,
          "results.$.gradePoint": gradepoint,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ error: "Failed to update result" });
    }

    res.json({ message: "Result updated successfully" });
  } catch (error) {
    console.error("Error editing result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/create-challenge", async (req: any, res: any) => {
  try {
    const { courseCode, studentEmail } = req.body;
    await ChallengeModel.create({
      courseCode,
      studentEmail,
    });
    res.json({ message: "Challenge created successfully" });
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get-challenges", async (req: any, res: any) => {
  try {
    const courseCode = req.query.courseCode as string;

    if (!courseCode) {
      return res.status(400).json({ error: "Course code is required" });
    }

    const challenge = await ChallengeModel.find({ courseCode });
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }
    res.json(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3002);
