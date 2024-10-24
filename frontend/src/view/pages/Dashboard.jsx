import AdminDashboard from "./AdminDashboard"; // Add this import
import SubAdminDashboard from "./SubAdminDashboard";
import { useAuth } from "../../context/Context";
import { useToast } from "../../context/ToastContext";
// ...
const Dashboard = () => {
    const { showToast } = useToast();
  const { user } = useAuth();
  const role = user?.role;

  
  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {role === "subAdmin" && <SubAdminDashboard />}
      {/* {role === "emp" && <EmployeeDashboard />} */}
    </>
  );
};

export default Dashboard;
