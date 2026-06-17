import { Link } from "react-router-dom";
import Badge from "../badges/Badges";
import StatusBadge from "../badges/StatusBadge";
import { Pencil } from "lucide-react";

type Course = {
  id: string;
  title: string;
  teacher: string;
  slots: string;
  start: string;
  price: string;
  image: string;
  level: string;
  status: string;
};

type Props = {
  course: Course;
};

const CourseRow = ({ course }: Props) => {
  return (
    <tr className="border-b border-[#e9e8e7] hover:bg-[#f5f3f2] transition">
      {/* Course */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <img
            src={course.image}
            alt={course.title}
            className="w-16 h-16 rounded-2xl object-cover border border-[#e9e8e7]"
          />
          <div className="max-w-[220px]">
            <h4 className="font-bold text-sm text-[#1b1c1b] leading-snug mb-2">
              {course.title}
            </h4>
            <Badge variant="info">
              {course.level}
            </Badge>
          </div>
        </div>
      </td>

      {/* Teacher */}
      <td className="px-6 py-5 text-[#5d5e60] font-medium">
        {course.teacher}
      </td>

      {/* Slots */}
      <td className="px-6 py-5 min-w-[120px]">
        <p className="font-semibold text-[#dc2626]">
          {course.slots}
        </p>
      </td>

      {/* Start */}
      <td className="px-6 py-5 text-[#5d5e60] whitespace-nowrap">
        {course.start}
      </td>

      {/* Price */}
      <td className="px-6 py-5 min-w-[180px]">
        <p className="font-bold text-2xl text-[#1b1c1b] whitespace-nowrap">
          {course.price}
        </p>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <StatusBadge status={course.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <Link
          to={`/admin/resources/${course.id}`}
          title="Editar curso"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-[#e9e8e7] hover:shadow-sm text-[#5d5e60] hover:text-[#1b1c1b] transition-all"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  );
};

export default CourseRow;