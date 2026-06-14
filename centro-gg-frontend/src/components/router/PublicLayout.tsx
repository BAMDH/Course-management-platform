import { Outlet } from "react-router-dom"
import { LandingNavbar } from "@/components/nav/LandingNavbar"
import { LandingFooter } from "@/components/footer/LandingFooter"

export function PublicLayout() {
  return (
    <>
      <LandingNavbar />
      <Outlet />
      <LandingFooter />
    </>
  )
}