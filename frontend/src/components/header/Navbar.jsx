import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { LoginContext } from "../../context/LoginContex";
import useDarkMode from "../../hooks/useDarkMode";

const Navbar = ({ login }) => {
  const { setmodalOpen } = useContext(LoginContext);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const loc = useLocation();
  const isLoggedIn = !!localStorage.getItem("token") || login;
  const [dark, toggleDark] = useDarkMode();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setVisible(!(y > lastY && y > 80));
      setLastY(y);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [lastY]);

  useEffect(() => setOpen(false), [loc.pathname]);

  const active = (p) => loc.pathname === p;

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      style={{
        fontFamily: "'DM Sans',sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: active(to) ? "var(--teal)" : "var(--ink2)",
        padding: "6px 12px",
        borderRadius: 8,
        background: active(to) ? "var(--teal-bg)" : "transparent",
        borderBottom: active(to)
          ? "2px solid var(--teal)"
          : "2px solid transparent",
        transition: "all .18s",
        display: "inline-block",
      }}
      onMouseEnter={(e) => {
        if (!active(to)) {
          e.currentTarget.style.background = "var(--s2)";
          e.currentTarget.style.color = "var(--ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active(to)) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--ink2)";
        }
      }}>
      {label}
    </Link>
  );

  const DarkToggle = () => (
    <button
      onClick={toggleDark}
      title={dark ? "Light mode" : "Dark mode"}
      style={{
        width: 34,
        height: 34,
        borderRadius: 9,
        background: "var(--s2)",
        border: "1.5px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "var(--ink3)",
        transition: "all .18s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--teal-bg)";
        e.currentTarget.style.color = "var(--teal)";
        e.currentTarget.style.borderColor = "var(--teal-bd)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--s2)";
        e.currentTarget.style.color = "var(--ink3)";
        e.currentTarget.style.borderColor = "var(--line)";
      }}>
      {dark ? (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        background: scrolled ? "var(--white)" : "var(--bg)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        transition:
          "background .3s, border-color .3s, box-shadow .3s, transform .3s cubic-bezier(.4,0,.2,1)",
        borderBottom: scrolled
          ? "1px solid var(--line)"
          : "1px solid transparent",
        boxShadow: scrolled ? "var(--sh1)" : "none",
      }}>
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(13,148,136,.35)",
            }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Epilogue',sans-serif",
              fontWeight: 900,
              fontSize: 19,
              color: "var(--ink)",
              letterSpacing: "-0.03em",
            }}>
            Infra<span style={{ color: "var(--teal)" }}>Sync</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {!isLoggedIn ? (
              <>
                <NavLink to="/signin" label="Sign In" />
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm"
                  style={{ marginLeft: 6 }}>
                  Get Started →
                </Link>
              </>
            ) : (
              <>
                <NavLink to="/" label="Feed" />
                <NavLink to="/createpost" label="Report Issue" />
                <NavLink to="/profile" label="Profile" />
                <button
                  onClick={() => setmodalOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{
                    marginLeft: 8,
                    color: "var(--red)",
                    borderColor: "var(--red-bd)",
                  }}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </>
            )}
            <div style={{ marginLeft: 8 }}>
              <DarkToggle />
            </div>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink2)",
              padding: 6,
              borderRadius: 8,
              flexShrink: 0,
            }}>
            {open ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round">
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && open && (
        <div
          className="sd"
          style={{
            background: "var(--white)",
            borderTop: "1px solid var(--line)",
            padding: "10px 16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: "0 8px 24px rgba(15,23,42,.1)",
          }}>
          {!isLoggedIn ? (
            <>
              <Link
                to="/signin"
                style={{
                  padding: "12px 14px",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--ink2)",
                  borderRadius: 10,
                  display: "block",
                }}>
                Sign In
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: "12px 14px",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--teal)",
                  background: "var(--teal-bg)",
                  borderRadius: 10,
                  display: "block",
                }}>
                Get Started →
              </Link>
            </>
          ) : (
            <>
              {[
                { to: "/", l: "Feed" },
                { to: "/createpost", l: "Report Issue" },
                { to: "/profile", l: "Profile" },
              ].map(({ to, l }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    padding: "12px 14px",
                    fontWeight: 600,
                    fontSize: 14,
                    borderRadius: 10,
                    display: "block",
                    color: active(to) ? "var(--teal)" : "var(--ink2)",
                    background: active(to) ? "var(--teal-bg)" : "transparent",
                  }}>
                  {l}
                </Link>
              ))}
              <div
                style={{
                  height: 1,
                  background: "var(--line)",
                  margin: "6px 0",
                }}
              />
              <button
                onClick={() => setmodalOpen(true)}
                style={{
                  padding: "12px 14px",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--red)",
                  background: "var(--red-bg)",
                  border: "none",
                  borderRadius: 10,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
