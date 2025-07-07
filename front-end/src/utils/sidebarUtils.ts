import { useNavigate } from "react-router-dom";

// ฟังก์ชันกำหนด selectedKey ตาม URL
export const getSelectedKeyFromPath = (pathname: string): string => {
  switch (pathname) {
    case "/dashboard":
      return "1";
    case "/customers":
      return "2";
    case "/bookings":
      return "3";
    case "/rooms":
      return "4";
    case "/users":
      return "5";
    default:
      return "1";
  }
};

// ฟังก์ชันจัดการการคลิกเมนู
export const handleMenuClick = (key: string, navigate: ReturnType<typeof useNavigate>): void => {
  switch (key) {
    case "1":
      navigate("/dashboard");
      break;
    case "2":
      navigate("/customers");
      break;
    case "3":
      navigate("/bookings");
      break;
    case "4":
      navigate("/rooms");
      break;
    case "5":
      navigate("/users");
      break;
    default:
      break;
  }
};