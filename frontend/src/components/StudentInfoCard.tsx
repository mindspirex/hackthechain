import React from "react";
import {
  User,
  Calendar,
  Book,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
} from "lucide-react";

export default function StudentInfoCard({ studentInfo, sgpa }) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-6 shadow-lg border border-teal-100">
        <div className="flex">
          {/* Left Section - Student Info */}
          <div className="flex-grow pr-6 lg:border-r border-teal-100">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-teal-100">
                <h3 className="text-teal-700 font-semibold text-lg">
                  Student Information
                </h3>
                <GraduationCap className="text-teal-600 w-6 h-6" />
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="text-teal-500 w-4 h-4" />
                    <div>
                      Name:{" "}
                      <span className="text-teal-600 font-medium">
                        {studentInfo?.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Book className="text-teal-500 w-4 h-4" />
                    <div>
                      Department:{" "}
                      <span className="text-teal-600 font-medium">
                        {studentInfo?.department}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="text-teal-500 w-4 h-4" />
                    <div>
                      Student ID:{" "}
                      <span className="text-teal-600 font-medium">
                        {studentInfo?.email.split("@")[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="text-teal-500 w-4 h-4" />
                    <div>
                      Semester:{" "}
                      <span className="text-teal-600 font-medium">
                        {studentInfo?.semester}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="text-teal-500 w-4 h-4" />
                    <div>
                      Email:{" "}
                      <span className="text-teal-600 font-medium">
                        {studentInfo?.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="text-teal-500 w-4 h-4" />
                    <div>
                      Phone:{" "}
                      <span className="text-teal-600 font-medium">
                        {studentInfo?.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="text-teal-500 w-4 h-4" />
                    <div>
                      Address:{" "}
                      <span className="text-teal-600 font-medium">
                        {studentInfo?.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="text-teal-500 w-4 h-4" />
                    <div>
                      Guardian:{" "}
                      <span className="text-teal-600 font-medium">
                        {studentInfo?.guardian}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-teal-100 mt-4">
                <div className="text-center p-2 bg-teal-50 rounded">
                  <div className="text-sm text-teal-600">Batch</div>
                  <div className="font-medium text-teal-700">
                    {studentInfo?.batch}
                  </div>
                </div>
                <div className="text-center p-2 bg-teal-50 rounded">
                  <div className="text-sm text-teal-600">Category</div>
                  <div className="font-medium text-teal-700">
                    {studentInfo?.category}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - CGPA Circle */}
          <div className="hidden lg:flex px-4 sm:px-10 md:px-20 flex flex-col sm:flex-row items-center justify-center">
            <div className="relative inline-block">
              <div className="flex w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 border-teal-500 flex-col items-center justify-center bg-white">
                <div className="text-2xl font-bold">{sgpa}</div>
                <div className="text-sm text-gray-500">SGPA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
