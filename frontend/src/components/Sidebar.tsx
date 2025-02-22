import Link from "next/link";
import {
  Layout,
  User,
  CreditCard,
  Book,
  Award,
  Users,
  FileText,
  MoreHorizontal,
  Settings,
  LogOut,
  ChartNetwork,
  Home,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#1a1f2b] text-gray-300 p-4 h-screen sticky top-0">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 py-2 px-4 bg-blue-600 rounded-lg">
          <Layout size={20} />
          <span>Dashboard</span>
        </div>
        {[
          {
            icon: <CreditCard size={20} />,
            label: "Fees",
            link: "https://iiitkota.ac.in/fees",
          },
          {
            icon: <Book size={20} />,
            label: "Curriculum",
            link: "https://iiitkota.ac.in/curriculum",
          },
          {
            icon: <User size={20} />,
            label: "Faculty",
            link: "https://iiitkota.ac.in/faculty",
          },
          {
            icon: <Users size={20} />,
            label: "Alumni Zone",
            link: "https://alumni.iiitkota.ac.in/",
          },
        ].map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-4">
        <Link
          href={"https://iiitkota.ac.in/"}
          className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-800 rounded-lg cursor-pointer"
        >
          <Home size={20} />
          <span>IIIT KOTA</span>
        </Link>
      </div>
    </div>
  );
}
