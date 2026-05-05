import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ type: "", text: "" });
  };
  const filled = Object.values(form).filter((v) => v.trim()).length;
  const progress = Math.round((filled / 4) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.userName.length < 3 || /\s/.test(form.userName)) {
      setMsg({ type: "error", text: "Username: ≥3 chars, no spaces." });
      return;
    }
    if (form.password.length < 8) {
      setMsg({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const d = await r.json();
      if (r.ok) {
        setMsg({ type: "success", text: "Account created! Redirecting…" });
        setTimeout(() => navigate("/signin"), 1100);
      } else setMsg({ type: "error", text: d.error || "Signup failed." });
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
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }} className="fu">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "var(--teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
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
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>
            Join InfraSync
          </h1>
          <p style={{ color: "var(--ink3)", fontSize: 14 }}>
            Report issues and help your community
          </p>
        </div>

        <div
          className="card fu d1"
          style={{ padding: "30px 28px", borderRadius: 20 }}>
          {/* Progress */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--ink3)",
                marginBottom: 7,
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}>
              <span>Profile completion</span>
              <span
                style={{
                  color: progress === 100 ? "var(--teal)" : "var(--ink3)",
                }}>
                {progress}%
              </span>
            </div>
            <div
              style={{
                height: 5,
                background: "var(--s3)",
                borderRadius: 99,
                overflow: "hidden",
              }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "var(--teal)",
                  borderRadius: 99,
                  transition: "width .4s cubic-bezier(.16,1,.3,1)",
                }}
              />
            </div>
          </div>

          {msg.text && (
            <div
              style={{
                marginBottom: 18,
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                background:
                  msg.type === "error" ? "var(--red-bg)" : "var(--teal-bg)",
                border: `1px solid ${msg.type === "error" ? "var(--red-bd)" : "var(--teal-bd)"}`,
                color: msg.type === "error" ? "var(--red)" : "var(--teal)",
              }}>
              {msg.type === "error" ? "⚠ " : "✓ "}
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px 12px",
                marginBottom: 6,
              }}>
              {[
                {
                  name: "name",
                  label: "Full Name",
                  type: "text",
                  placeholder: "Jane Doe",
                  col: "full",
                },
                {
                  name: "userName",
                  label: "Username",
                  type: "text",
                  placeholder: "jane_doe",
                  col: "half",
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "jane@example.com",
                  col: "half",
                },
                {
                  name: "password",
                  label: "Password",
                  type: showPw ? "text" : "password",
                  placeholder: "Min. 8 characters",
                  col: "full",
                  isPw: true,
                },
              ].map(({ name, label, type, placeholder, col, isPw }) => (
                <div
                  key={name}
                  style={{ gridColumn: col === "full" ? "1 / -1" : "auto" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--ink2)",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}>
                    {label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="inp"
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      style={{
                        fontSize: 13,
                        paddingRight: isPw ? 42 : undefined,
                      }}
                    />
                    {isPw && (
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
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round">
                          {showPw ? (
                            <>
                              <line x1="1" y1="1" x2="23" y2="23" />
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 18 }}>
              {loading ? (
                <>
                  <span className="spin-ring" />
                  Creating account…
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>
          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              paddingTop: 18,
              borderTop: "1px solid var(--line)",
              fontSize: 13,
              color: "var(--ink3)",
            }}>
            Already have an account?{" "}
            <Link
              to="/signin"
              style={{ color: "var(--teal)", fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
