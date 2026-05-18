import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  items: BreadcrumbItem[];
};

const Breadcrumbs = ({
  items,
}: Props) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
      {items.map((item, index) => (
        <div
          key={item.href}
          className="flex items-center gap-2"
        >
          <Link
            to={item.href}
            className="hover:text-red-600 transition"
          >
            {item.label}
          </Link>

          {index < items.length - 1 && (
            <span>/</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;