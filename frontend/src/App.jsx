import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { createContext } from "react";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/header/Navbar.jsx";
import Home from "./components/pages/Home.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import SignIn from "./components/auth/SignIn.jsx";
import Profile from "./components/profile/Profile.jsx";
import CreatePost from "./components/createPost/CreatePost.jsx";
import ProfilePic from "./components/profile/ProfilePic.jsx";
import Modal from "./components/modal/Modal.jsx";
import UserProfile from "./components/userprofile/UserProfile.jsx";
import Footer from "./components/footer/Footer.jsx";
import Layout from "./components/pages/Layout.jsx";

import { LoginContext } from "./context/LoginContex.jsx";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setmodalOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        <Layout>
          <LoginContext.Provider
            value={{ userLogin, setUserLogin, modalOpen, setmodalOpen }}>
            <Navbar login={userLogin} />
            <Routes>
              <Route path="/" element={<Home />}>
                {" "}
              </Route>
              <Route path="/signup" element={<SignUp />}>
                {" "}
              </Route>
              <Route path="/signin" element={<SignIn />}>
                {" "}
              </Route>
              <Route path="/createpost" element={<CreatePost />}>
                {" "}
              </Route>
              <Route exact path="/profile" element={<Profile />}>
                {" "}
              </Route>
              <Route path="/profile-pic" element={<ProfilePic />}>
                {" "}
              </Route>
              <Route path="/profile/:userId" element={<UserProfile />}>
                {" "}
              </Route>
            </Routes>
            <Footer />
            <ToastContainer />

            {modalOpen && <Modal></Modal>}
          </LoginContext.Provider>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
