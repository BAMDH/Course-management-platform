import type { ReactNode } from "react";
import AdminSideBar from "@/components/nav/AdminSidebar";

interface Props {
  children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen bg-[#1f1f1f]">
      <AdminSideBar />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;