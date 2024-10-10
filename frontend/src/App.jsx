import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Context } from "./context/Context";

import LoginPage from "./view/screens/Login";
import Register from "./view/screens/Register";
import ToDo from "./view/pages/ToDo";
import ResetPass from "./view/pages/ResetPass";
import Profile from "./view/pages/Profile";
import ContactUs from "./view/screens/ContactUs";
import AboutUs from "./view/screens/AboutUs";
import Layout from "./view/components/Layout/Layout";
import Landing from "./view/screens/Landing";
import Dashboard from "./view/pages/Dashboard";
import Connection from "./view/pages/Connection";
import ForgetPassword from "./view/pages/ForgetPassword";
import UserVerification from "./view/pages/UserVerification";
import Home from "./view/screens/Home";
import MainLayout from "./view/components/Layout/MainLayout";
import QueryPage from "./view/pages/Query";
import Lead from "./view/pages/Lead";
import LeadDetails from "./view/pages/LeadDetails";
import Teams from "./view/pages/Teams";
import MeetingManagement from "./view/pages/MeetingManagement";

function App() {
  return (
    <Context>
      <BrowserRouter>
        <Routes>
          {/* Home page is public */}
          <Route path="/" element={<Landing />} />

          {/* Routes for Landing Page */}
          <Route
            path="/home"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/contactus"
            element={
              <MainLayout>
                <ContactUs />
              </MainLayout>
            }
          />
          <Route
            path="/aboutus"
            element={
              <MainLayout>
                <AboutUs />
              </MainLayout>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/todo"
            element={
              <Layout>
                <ToDo />
              </Layout>
            }
          />
          <Route
            path="/lead"
            element={
              <Layout>
                <Lead />
              </Layout>
            }
          />
          <Route
            path="/lead-details/:id"
            element={
              <Layout>
                <LeadDetails />
              </Layout>
            }
          />
          <Route
            path="/connection"
            element={
              <Layout>
                <Connection />
              </Layout>
            }
          />
          <Route
            path="/resetpassword"
            element={
              <Layout>
                <ResetPass />
              </Layout>
            }
          />
          <Route
            path="/userverification"
            element={
              <Layout>
                <UserVerification />
              </Layout>
            }
          />
          <Route
            path="/teams"
            element={
              <Layout>
                <Teams />
              </Layout>
            }
          />
          <Route
            path="/query"
            element={
              <Layout>
                <QueryPage />
              </Layout>
            }
          />
          <Route
            path="/meetingmanagement"
            element={
              <Layout>
                <MeetingManagement />
              </Layout>
            }
          />

          {/* Public routes */}
          {/* <Route path="/contactus" element={<ContactUs />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Register />} />
          {/* <Route path="/aboutus" element={<AboutUs />} /> */}
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Routes>
      </BrowserRouter>
    </Context>
  );
}

export default App;
