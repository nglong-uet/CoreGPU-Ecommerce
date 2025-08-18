import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from '../components/AIChatbot';
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <AIChatbot />
      <Outlet />
      <Footer />
    </>
  );
}
