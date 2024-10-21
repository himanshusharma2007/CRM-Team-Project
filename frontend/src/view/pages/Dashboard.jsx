import AdminDashboard from "./AdminDashboard"; // Add this import
import { useAuth } from "../../context/Context";
// ...
const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {/* {role === "subAdmin" && <SubAdminDashboard />}
      {role === "emp" && <EmployeeDashboard />} */}
    </>
  );
};

export default Dashboard;
