import mongoose from "mongoose";
const Schema = mongoose.Schema;
const model = mongoose.model;

try {
  mongoose.connect(
    "mongodb+srv://sanskar:3RPCK9TOSLjxJDir@hackcluster.yoxn4.mongodb.net/"
  );
} catch (error) {
  console.log(error);
}

const StudentSchema = new Schema({
  name: String,
  department: String,
  email: String,
  passwordHash: String,
  semester: Number,
  phone: Number,
  address: String,
  guardian: String,
  batch: Number,
  category: String,
});

const TeacherSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  courseCode: String,
});

const ResultSchema = new Schema({
  email: String,
  semester: Number,
  results: [
    {
      courseCode: String,
      courseTitle: String,
      credit: Number,
      grade: String,
      gradePoint: Number,
    },
  ],
});

const ChallengeSchema = new Schema({
  courseCode: String,
  studentEmail: String,
});

export const StudentModel = model("students", StudentSchema);
export const TeacherModel = model("teachers", TeacherSchema);
export const ResultModel = model("results", ResultSchema);
export const ChallengeModel = model("challenges", ChallengeSchema);
