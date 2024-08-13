import { useState } from "react";
import { Layout } from "antd";
import { User } from "@supabase/supabase-js";
import LoginModal from "./LoginModel";
import SignUpModal from "./SignUpModel";
import { supabaseClient } from "../service/supabase";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;

const Header = ({ user }: { user: User | null }) => {
  const [loginModal, setLoginModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const navigate = useNavigate()
  const onLogout = () => {
    supabaseClient.auth.signOut();
    localStorage.clear();
    navigate('/')
    window.location.reload(); 
    console.log(">>>>>>>>");
  };

  const handleLoginClose = () => {
    setLoginModal(false);
  };

  const handleSignUpClose = () => {
    setSignUpModal(false);
  };

  return (
    <>
      <LoginModal
        isModalOpen={loginModal}
        onClose={handleLoginClose}
      />
      <SignUpModal
        isModalOpen={signUpModal}
        onClose={handleSignUpClose}
      />
      <AntHeader
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#001529",
          padding: "0 20px",
          zIndex: 1000,
          height: "64px",
        }}
      >
        <div style={{ color: "white", fontSize: "1.5rem", cursor: "pointer" }}>
         Demo Chat App
        </div>
        <div style={{ display: "flex" }}>
          {!user ? (
            <>
              <div
                style={{
                  color: "white",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => setLoginModal(true)}
              >
                Login
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: ".9rem",
                  padding: "0 1em",
                }}
              >
                or
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => setSignUpModal(true)}
              >
                Sign Up
              </div>
            </>
          ) : (
            <div
              style={{ color: "white", fontSize: "1rem", cursor: "default" }}
            >
              <span onClick={onLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </div>
          )}
        </div>
      </AntHeader>
    </>
  );
};

export default Header;
