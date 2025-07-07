  // ฟังก์ชันแปลง pathname เป็นภาษาไทย
 export const convertPathname = (pathname: string): string => {
    switch (pathname) {
      case "/dashboard":
        return "ພາບລວມ";
      case "/customers":
        return "ຈັດການລູກຄ້າ";
      case "/bookings":
        return "ຈັດການຈອງ";
      case "/rooms":
        return "ຈັດການຫ້ອງ";
      case "/users":
        return "ຈັດການພະນັກງານ";
      default:
        return "ພາບລວມ"; // ค่าเริ่มต้นถ้าไม่ตรง
    }
  };