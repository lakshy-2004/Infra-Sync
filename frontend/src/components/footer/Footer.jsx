import React, { useState, useEffect } from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 900);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 900);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const gridCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 1fr 1fr 1fr";
  const px = isMobile ? "20px" : "32px";

  return (
    <footer
      style={{
        background: "var(--white)",
        borderTop: "1px solid var(--line)",
        marginTop: "auto",
      }}>
      {/* main grid */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "36px 20px 28px" : "48px 32px 36px",
          display: "grid",
          gridTemplateColumns: gridCols,
          gap: isMobile ? 32 : 40,
        }}>
        {/* brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "var(--teal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px rgba(13,148,136,.3)",
                flexShrink: 0,
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Epilogue',sans-serif",
                fontWeight: 900,
                fontSize: 17,
                color: "var(--ink)",
                letterSpacing: "-0.03em",
              }}>
              Infra<span style={{ color: "var(--teal)" }}>Sync</span>
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink3)",
              lineHeight: 1.75,
              marginBottom: 20,
              maxWidth: 260,
            }}>
            Empowering communities to report, track, and resolve local
            infrastructure issues — together.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              {
                href: "https://www.instagram.com/lakshya_sharma2004",
                Icon: FaInstagram,
                label: "Instagram",
              },
              {
                href: "https://www.linkedin.com/in/lakshya-sharma-67b20a275/",
                Icon: FaLinkedin,
                label: "LinkedIn",
              },
              {
                href: "https://github.com/lakshy-2004",
                Icon: FaGithub,
                label: "GitHub",
              },
            ].map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--s2)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--ink3)",
                  transition: "all .2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--teal-bg)";
                  e.currentTarget.style.borderColor = "var(--teal-bd)";
                  e.currentTarget.style.color = "var(--teal)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--s2)";
                  e.currentTarget.style.borderColor = "var(--line)";
                  e.currentTarget.style.color = "var(--ink3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* product */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--ink3)",
              marginBottom: 16,
            }}>
            Product
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { to: "/", label: "Community Feed" },
              { to: "/createpost", label: "Report an Issue" },
              { to: "/profile", label: "My Profile" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontSize: 13,
                  color: "var(--ink3)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color .18s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--teal)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--ink3)")
                }>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* about */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--ink3)",
              marginBottom: 16,
            }}>
            About
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { href: "https://github.com/lakshy-2004", label: "Open Source" },
              {
                href: "https://www.linkedin.com/in/lakshya-sharma-67b20a275/",
                label: "Developer",
              },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: "var(--ink3)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color .18s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--teal)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--ink3)")
                }>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* status — hidden on mobile to keep it clean */}
        {!isMobile && (
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "var(--ink3)",
                marginBottom: 16,
              }}>
              Status
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 0 3px rgba(34,197,94,.2)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--ink2)",
                    fontWeight: 600,
                  }}>
                  All systems live
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--ink4)",
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                Built for Rajasthan communities. Free & open to all.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* bottom bar */}
      <div
        style={{ borderTop: "1px solid var(--line)", background: "var(--s2)" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: `12px ${px}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}>
          <p
            style={{
              fontSize: 12,
              color: "var(--ink4)",
              margin: 0,
              fontWeight: 500,
            }}>
            © {new Date().getFullYear()} InfraSync · Made with ♥ for communities
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy Policy", "Terms of Use"].map((label) => (
              <a
                key={label}
                href="#"
                style={{
                  fontSize: 12,
                  color: "var(--ink4)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color .18s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--teal)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--ink4)")
                }>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
