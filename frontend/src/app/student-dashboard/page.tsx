"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import StudentInfoCard from "@/components/StudentInfoCard";
import Sidebar from "@/components/Sidebar";
import { ChevronDown } from "lucide-react";

interface StudentInfo {
  name: string;
  department: string;
  email: string;
  semester: string;
  passwordHash: string;
}
interface CourseResult {
  courseCode: string;
  courseTitle: string;
  credit: number;
  grade: string;
  gradePoint: number;
}

export default function StudentDashboard() {
  const [decodedToken, setDecodedToken] = useState<{ email: string } | null>(
    null
  );
  const [courseResults, setCourseResults] = useState<CourseResult[]>([]);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [sgpa, setSgpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  const [semester, setSemester] = useState<Number>(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<{ email: string }>(token);
          setDecodedToken(decoded);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!decodedToken) return;

    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(
          process.env.SERVER + "/api/get-student",
          {
            params: { email: decodedToken?.email },
          }
        );
        setStudentInfo(response.data);
      } catch (error: any) {
        console.error(
          "Error fetching student info:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchStudentInfo();
  }, [decodedToken]);

  useEffect(() => {
    if (!decodedToken) return;

    const fetchCourseResults = async () => {
      try {
        const response = await axios.get<any>(
          process.env.SERVER + "/api/get-result",
          {
            params: {
              email: decodedToken?.email,
              semester: semester,
            },
          }
        );
        setCourseResults(response.data.results);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      }
    };

    fetchCourseResults();
  }, [decodedToken, semester]);

  useEffect(() => {
    if (courseResults.length === 0) return;

    const totalCredits = courseResults.reduce(
      (sum, course) => sum + course.credit,
      0
    );
    const totalGradePoints = courseResults.reduce(
      (sum, course) => sum + course.credit * course.gradePoint,
      0
    );

    const calculatedCgpa =
      totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    setSgpa(parseFloat(calculatedCgpa.toFixed(2)));
    setTotalCredits(totalCredits);
  }, [courseResults]);

  async function handleChallenge(courseCode: string) {
    try {
      await axios.post(process.env.SERVER + "/api/create-challenge", {
        studentEmail: studentInfo?.email,
        courseCode: courseCode,
      });
      alert("Challenge created successfully");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8" id="print-section">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg mb-6">
          <h1 className="text-xl">Live Results</h1>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 p-2 border rounded-lg bg-[#e9e9ed]">
            {decodedToken?.email.split("@")[0]}
          </div>
          <div className="flex-1 relative">
            <select
              className="w-full p-2 border rounded-lg appearance-none"
              value={"Semester " + String(semester)}
              onChange={(e) => setSemester(Number(e.target.value[9]))}
            >
              {Array.from({ length: studentInfo?.semester - 1 }, (_, i) => (
                <option key={i + 1} value={`Semester ${i + 1}`}>
                  Semester {i + 1}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-3 text-gray-500" />
          </div>
          <button
            className="px-8 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => window.print()}
          >
            Download
          </button>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-blue-600">
                <th className="py-2">Course Code</th>
                <th>Course Title</th>
                <th>Credit</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courseResults?.map((course, index) => (
                <tr key={index} className="border-t">
                  <td className="py-4">{course.courseCode}</td>
                  <td className="text-gray-500">{course.courseTitle}</td>
                  <td>{course.credit}</td>
                  <td>{course.grade}</td>
                  <td>{course.gradePoint}</td>
                  <td>
                    <button
                      onClick={() => {
                        handleChallenge(course.courseCode);
                      }}
                      className="bg-red-500 text-white px-3 text-sm py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Challenge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4 pt-4 border-t">
            <div>
              Total Credit:{" "}
              <span className="text-blue-600">{totalCredits}</span>
            </div>
            <div>
              SGPA: <span className="text-blue-600">{sgpa ?? ""}</span>
            </div>
          </div>
        </div>

        <StudentInfoCard studentInfo={studentInfo} sgpa={sgpa} />
      </div>
    </div>
  );
}
