import { Link, useLocation } from "react-router-dom";

const SideNav = () => {
  const location = useLocation();

  const links = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      label: "Gestión de usuarios",
      path: "/admin/users",
      icon: "👥",
    },
    {
      label: "Gestión de cursos",
      path: "/admin/courses",
      icon: "📚",
    },
  ];

  return (
    <aside className="w-[260px] bg-[#f5f5f5] border-r border-gray-200 min-h-screen p-5">
      <nav className="space-y-2 mt-6">
        {links.map((link) => {
          const active = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all
              ${
                active
                  ? "bg-white shadow-md text-red-600 font-semibold"
                  : "text-gray-500 hover:bg-white"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideNav;