import React, { useContext } from "react";
import { LoginContext } from "../../context/LoginContex";
import { useNavigate } from "react-router-dom";

const Modal = () => {
  const { modalOpen, setmodalOpen, setUserLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  if (!modalOpen) return null;

  const handleConfirm = () => {
    localStorage.removeItem("token");
    setUserLogin(false);
    setmodalOpen(false);
    navigate("/signin");
  };

  return (
    <div
      className="fi"
      onClick={(e) => e.target === e.currentTarget && setmodalOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(15,23,42,.6)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}>
      <div
        className="card si"
        style={{
          maxWidth: 360,
          width: "100%",
          padding: "36px 30px",
          textAlign: "center",
          borderRadius: 22,
          boxShadow: "var(--sh4)",
        }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "var(--red-bg)",
            border: "2px solid var(--red-bd)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 22px",
          }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--red)"
            strokeWidth="1.8"
            strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>
          Sign out?
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--ink3)",
            marginBottom: 28,
            lineHeight: 1.65,
          }}>
          You'll be signed out of your account. You can always sign back in to
          continue reporting issues.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setmodalOpen(false)}
            className="btn btn-outline"
            style={{ flex: 1, padding: "12px 0" }}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "var(--red)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "'DM Sans',sans-serif",
              border: "none",
              cursor: "pointer",
              transition: "background .2s, transform .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#b91c1c";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--red)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
