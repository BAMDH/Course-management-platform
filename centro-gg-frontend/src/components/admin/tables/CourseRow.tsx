import { Link } from "react-router-dom";

import Badge from "../badges/Badges";
import StatusBadge from "../badges/StatusBadge";

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

const CourseRow = ({
  course,
}: Props) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      {/* Course */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <img
            src={course.image}
            alt={course.title}
            className="w-16 h-16 rounded-2xl object-cover"
          />

          <div className="max-w-[220px]">
            <h4 className="font-semibold text-sm leading-snug mb-2">
              {course.title}
            </h4>

            <Badge variant="info">
              {course.level}
            </Badge>
          </div>
        </div>
      </td>

      {/* Teacher */}
      <td className="px-6 py-5 text-gray-600 font-medium">
        {course.teacher}
      </td>

      {/* Slots */}
      <td className="px-6 py-5 min-w-[120px]">
        <p className="font-semibold text-red-600">
          {course.slots}
        </p>
      </td>

      {/* Start */}
      <td className="px-6 py-5 text-gray-500 whitespace-nowrap">
        {course.start}
      </td>

      {/* Price */}
      <td className="px-6 py-5 min-w-[180px]">
        <p className="font-bold text-2xl whitespace-nowrap">
          {course.price}
        </p>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <StatusBadge
          status={course.status}
        />
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <Link
          to={`/admin/resources/${course.id}`}
          className="hover:scale-110 transition text-lg inline-block"
        >
          ✏️
        </Link>
      </td>
    </tr>
  );
};

export default CourseRow;