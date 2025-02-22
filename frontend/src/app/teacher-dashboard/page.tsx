"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function TeacherDashboard() {
  const [decodedToken, setDecodedToken] = useState<{ email: string } | null>(
    null
  );
  const [studentId, setStudentId] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [gradePoint, setGradePoint] = useState<string>("");
  const [entries, setEntries] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

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

    const fetchTeacherInfo = async () => {
      try {
        const response = await axios.get(
          process.env.SERVER + "/api/get-teacher",
          {
            params: { email: decodedToken?.email },
          }
        );
        setCourseCode(response.data.courseCode || "");
      } catch (error: any) {
        console.error(
          "Error fetching teacher info:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTeacherInfo();
  }, [decodedToken]);

  async function handleSubmit() {
    try {
      await axios.post(process.env.SERVER + "/api/edit-result", {
        studentid: studentId,
        coursecode: courseCode,
        grade: grade,
        gradepoint: Number(gradePoint),
      });
      setEntries([...entries, { studentId, courseCode, grade, gradePoint }]);
      setGrade("");
      setGradePoint("");
      setStudentId("");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!courseCode) return;
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          process.env.SERVER + "/api/get-challenges",
          {
            params: { courseCode },
          }
        );
        console.log(response.data);
        setChallenges(response.data);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };

    fetchChallenges();
  }, [courseCode]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg mb-7">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Teacher Dashboard
        </h1>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Student ID"
            className="border p-2 rounded-md w-full"
          />
          <div className="border p-2 rounded-md w-full">{courseCode}</div>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade"
            className="border p-2 rounded-md w-full"
          />
          <input
            type="text"
            value={gradePoint}
            onChange={(e) => setGradePoint(e.target.value)}
            placeholder="Grade Point"
            className="border p-2 rounded-md w-full"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Edit Grade
        </button>

        <table className="w-full text-left border-collapse mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Student ID</th>
              <th className="p-3">Course Code</th>
              <th className="p-3">Grade</th>
              <th className="p-3">GradePoint</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="p-3">{entry.studentId}</td>
                <td className="p-3">{entry.courseCode}</td>
                <td className="p-3">{entry.grade}</td>
                <td className="p-3">{entry.gradePoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Challenges</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="bg-gray-100 p-3 rounded-lg text-gray-800 text-center font-medium shadow-md"
            >
              {challenge.studentEmail.split("@")[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
