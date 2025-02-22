"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeModel =
  exports.ResultModel =
  exports.TeacherModel =
  exports.StudentModel =
    void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const model = mongoose_1.default.model;
try {
  mongoose_1.default.connect(process.env.DB);
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
exports.StudentModel = model("students", StudentSchema);
exports.TeacherModel = model("teachers", TeacherSchema);
exports.ResultModel = model("results", ResultSchema);
exports.ChallengeModel = model("challenges", ChallengeSchema);
