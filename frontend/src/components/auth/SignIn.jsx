import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContex";

const SignIn = () => {
  const { setUserLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMsg({ type: "error", text: "Please fill all fields." });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const d = await r.json();
      if (r.ok) {
        localStorage.setItem("token", d.token);
        setUserLogin(true);
        setMsg({ type: "success", text: "Welcome back! Redirecting…" });
        setTimeout(() => navigate("/"), 900);
      } else setMsg({ type: "error", text: d.error || "Sign in failed." });
    } catch {
      setMsg({ type: "error", text: "Server error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 16px 40px",
      }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }} className="fu">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "var(--teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 6px 20px rgba(13,148,136,.35)",
            }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--ink3)", fontSize: 14 }}>
            Sign in to your InfraSync account
          </p>
        </div>

        <div
          className="card fu d1"
          style={{ padding: "32px 28px", borderRadius: 20 }}>
          {msg.text && (
            <div
              style={{
                marginBottom: 20,
                padding: "11px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background:
                  msg.type === "error" ? "var(--red-bg)" : "var(--teal-bg)",
                border: `1px solid ${msg.type === "error" ? "var(--red-bd)" : "var(--teal-bd)"}`,
                color: msg.type === "error" ? "var(--red)" : "var(--teal)",
              }}>
              {msg.type === "error" ? "⚠" : "✓"} {msg.text}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink2)",
                  marginBottom: 7,
                }}>
                Email address
              </label>
              <input
                className="inp"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink2)",
                  marginBottom: 7,
                }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="inp"
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ink4)",
                    padding: 0,
                  }}>
                  {showPw ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 4 }}>
              {loading ? (
                <>
                  <span className="spin-ring" />
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>
          <p
            style={{
              textAlign: "center",
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid var(--line)",
              fontSize: 13,
              color: "var(--ink3)",
            }}>
            No account?{" "}
            <Link
              to="/signup"
              style={{ color: "var(--teal)", fontWeight: 700 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
