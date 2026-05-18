import { Outlet } from "react-router-dom"
import { LandingNavbar } from "@/components/nav/LandingNavbar"

export function PublicLayout() {
  return (
    <>
      <LandingNavbar />
      <Outlet />
    </>
  )
}