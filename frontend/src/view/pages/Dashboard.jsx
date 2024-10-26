import AdminDashboard from "./AdminDashboard"; // Add this import
import SubAdminDashboard from "./SubAdminDashboard";
import { useAuth } from "../../context/Context";
import {useNavigate} from "react-router-dom";
// ...
const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  
  return (
    <>
      {role === "emp" && navigate("/todo")}
      {role === "admin" && <AdminDashboard />}
      {role === "subAdmin" && <SubAdminDashboard />}
    </>
  );
};

export default Dashboard;
