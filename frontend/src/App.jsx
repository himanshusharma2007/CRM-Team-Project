import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Context } from "./context/Context";

import LoginPage from "./view/components/Login";
import Register from "./view/components/Register";
import ToDo from "./view/screens/ToDo";
import ResetPass from "./view/components/ResetPass";
import Profile from "./view/screens/Profile";
import ContactUs from "./view/screens/ContactUs";
import AboutUs from "./view/screens/AboutUs";
import Layout from "./view/components/Layout/Layout";
import Landing from "./view/components/Landing";
import Dashboard from "./view/components/Dashboard";
import Contact from "./view/components/Contact";
import ForgetPassword from "./view/components/ForgetPassword";
import UserVerification from "./view/components/UserVerification";
import Home from "./view/screens/Home";
import MainLayout from "./view/components/Layout/MainLayout";
import QueryPage from "./view/components/Query";
import Lead from "./view/components/Lead";

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
            path="/contact"
            element={
              <Layout>
                <Contact />
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
            path="/query"
            element={
              <Layout>
                <QueryPage />
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
