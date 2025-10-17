import { Outlet } from "react-router-dom";
import TopTabs from "../components/TopTabs";

export default function RootLayout() {
  return (
    <div className="container">
      <TopTabs />
      <Outlet />
    </div>
  );
}
