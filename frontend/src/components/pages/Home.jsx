import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PostCard from "./PostCard";

const Spinner = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "75vh",
      gap: 16,
    }}>
    <div
      style={{
        width: 44,
        height: 44,
        border: "3px solid var(--teal-bd)",
        borderTopColor: "var(--teal)",
        borderRadius: "50%",
        animation: "spin .85s linear infinite",
      }}
    />
    <p style={{ color: "var(--ink3)", fontSize: 14, fontWeight: 500 }}>
      Loading reports…
    </p>
  </div>
);

const IconList = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="3" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3" cy="18" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const IconGrid2 = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round">
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
);

const IconGrid3 = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round">
    <rect x="2" y="3" width="5.5" height="5.5" rx="1" />
    <rect x="9.2" y="3" width="5.5" height="5.5" rx="1" />
    <rect x="16.5" y="3" width="5.5" height="5.5" rx="1" />
    <rect x="2" y="10.2" width="5.5" height="5.5" rx="1" />
    <rect x="9.2" y="10.2" width="5.5" height="5.5" rx="1" />
    <rect x="16.5" y="10.2" width="5.5" height="5.5" rx="1" />
    <rect x="2" y="17.5" width="5.5" height="5.5" rx="1" />
    <rect x="9.2" y="17.5" width="5.5" height="5.5" rx="1" />
    <rect x="16.5" y="17.5" width="5.5" height="5.5" rx="1" />
  </svg>
);

const VIEWS = [
  { key: "list", icon: <IconList />, title: "List view" },
  { key: "grid2", icon: <IconGrid2 />, title: "2-column grid" },
  { key: "grid3", icon: <IconGrid3 />, title: "3-column grid" },
];

const EmptyState = ({ isSearch, query, onClear }) => (
  <div
    className="card"
    style={{
      padding: "60px 24px",
      textAlign: "center",
      borderRadius: 20,
      gridColumn: "1/-1",
    }}>
    {isSearch ? (
      <>
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink4)"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{ display: "block", margin: "0 auto 16px" }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <p style={{ color: "var(--ink3)", fontSize: 15, marginBottom: 16 }}>
          No reports found for "{query}".
        </p>
        <button
          onClick={onClear}
          className="btn btn-outline"
          style={{ fontSize: 13 }}>
          Clear Search
        </button>
      </>
    ) : (
      <>
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink4)"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{ display: "block", margin: "0 auto 16px" }}>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <p style={{ color: "var(--ink3)", fontSize: 15, marginBottom: 20 }}>
          No reports yet — be the first!
        </p>
        <Link to="/createpost" className="btn btn-primary">
          Report an Issue
        </Link>
      </>
    )}
  </div>
);

const useBreakpoint = () => {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w < 900 };
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("list");
  const { isMobile, isTablet } = useBreakpoint();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isMobile) setView("list");
  }, [isMobile]);

  useEffect(() => {
    let m = true;
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const [pR, uR] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/allposts`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v3/me`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        if (!pR.ok || !uR.ok) throw new Error("Failed");
        const [pD, uD] = await Promise.all([pR.json(), uR.json()]);
        if (m) {
          setPosts(pD.posts || []);
          setCurrentUser(uD.user || null);
          setLoading(false);
        }
      } catch (e) {
        if (m) {
          setError(e.message);
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      m = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const location = (p.location || "").toLowerCase();
      const username = (p.postedBy?.userName || "").toLowerCase();
      return location.includes(q) || username.includes(q);
    });
  }, [posts, query]);

  if (loading) return <Spinner />;

  if (!isAuthenticated)
    return (
      <div
        className="page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
        }}>
        <div
          className="card si"
          style={{
            padding: isMobile ? "40px 20px" : "56px 40px",
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            borderRadius: 22,
          }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "var(--teal-bg)",
              border: "1.5px solid var(--teal-bd)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="1.8"
              strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
            Welcome to InfraSync
          </h2>
          <p
            style={{
              color: "var(--ink3)",
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 32,
            }}>
            Report and track local infrastructure issues. Sign in to join your
            community.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/signin" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );

  if (error) {
    toast.error(error);
    return (
      <div
        className="page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <p style={{ color: "var(--red)" }}>Error: {error}</p>
      </div>
    );
  }

  const isSearch = Boolean(query.trim());
  const clearSearch = () => setQuery("");
  const px = isMobile ? 16 : 32;

  return (
    <div className="page">
      {/* Header */}
      <div
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--line)",
          padding: `24px ${px}px`,
          marginBottom: isMobile ? 16 : 28,
        }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}>
          <div className="fu">
            <span className="badge badge-teal" style={{ marginBottom: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--teal)",
                  display: "inline-block",
                }}
              />{" "}
              Live Feed
            </span>
            <h1
              style={{
                fontSize: "clamp(20px,4vw,28px)",
                fontWeight: 900,
                margin: 0,
                letterSpacing: "-0.04em",
              }}>
              Community Reports
            </h1>
            <p style={{ color: "var(--ink3)", fontSize: 13, marginTop: 4 }}>
              {posts.length} active report{posts.length !== 1 ? "s" : ""} in
              your area
            </p>
          </div>
          <Link
            to="/createpost"
            className="btn btn-primary fu d1"
            style={{ fontSize: isMobile ? 13 : 14 }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {isMobile ? "Report" : "Report Issue"}
          </Link>
        </div>
      </div>

      {/* Search + Toggle */}
      <div
        style={{
          padding: `0 ${px}px`,
          maxWidth: 1100,
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}>
        {/* search */}
        <div
          style={{
            position: "relative",
            flex: isMobile ? 1 : "none",
            width: isMobile ? "auto" : 320,
            flexShrink: 0,
          }}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ink4)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by location or username…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 34px 10px 38px",
              border: "1.5px solid var(--line)",
              borderRadius: 12,
              fontSize: 13.5,
              background: "var(--white)",
              color: "var(--ink)",
              outline: "none",
              transition: "border-color .18s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--teal)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
          />
          {query && (
            <button
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ink4)",
                display: "flex",
                alignItems: "center",
                padding: 4,
              }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* result count */}
        {isSearch && (
          <p style={{ fontSize: 12, color: "var(--ink3)", flex: 1, margin: 0 }}>
            {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}{" "}
            for{" "}
            <strong style={{ color: "var(--ink2)" }}>"{query.trim()}"</strong>
          </p>
        )}

        {/* view toggle — hidden on mobile */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              border: "1.5px solid var(--line)",
              borderRadius: 12,
              overflow: "hidden",
              flexShrink: 0,
              marginLeft: "auto",
            }}>
            {VIEWS.map(({ key, icon, title }, i) => (
              <button
                key={key}
                onClick={() => setView(key)}
                title={title}
                style={{
                  width: 40,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: view === key ? "var(--teal-bg)" : "var(--white)",
                  color: view === key ? "var(--teal)" : "var(--ink3)",
                  border: "none",
                  borderLeft: i > 0 ? "1.5px solid var(--line)" : "none",
                  cursor: "pointer",
                  transition: "background .15s, color .15s",
                }}>
                {icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feed */}
      <div
        style={{ padding: `0 ${px}px 48px`, maxWidth: 1100, margin: "0 auto" }}>
        {/* list */}
        {(isMobile || view === "list") && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}>
            {filteredPosts.length === 0 ? (
              <EmptyState
                isSearch={isSearch}
                query={query.trim()}
                onClear={clearSearch}
              />
            ) : (
              filteredPosts.map((post, i) => (
                <div
                  key={post._id || i}
                  className={`d${Math.min(i + 1, 5)}`}
                  style={{ width: "100%", maxWidth: isMobile ? "100%" : 580 }}>
                  <PostCard post={post} currentUser={currentUser} />
                </div>
              ))
            )}
          </div>
        )}

        {/* grid2 */}
        {!isMobile && view === "grid2" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "repeat(2, 1fr)",
              gap: 18,
              alignItems: "stretch",
            }}>
            {filteredPosts.length === 0 ? (
              <EmptyState
                isSearch={isSearch}
                query={query.trim()}
                onClear={clearSearch}
              />
            ) : (
              filteredPosts.map((post, i) => (
                <div
                  key={post._id || i}
                  style={{
                    maxWidth: isTablet ? 580 : "none",
                    margin: isTablet ? "0 auto" : undefined,
                    width: "100%",
                  }}>
                  <PostCard post={post} currentUser={currentUser} />
                </div>
              ))
            )}
          </div>
        )}

        {/* grid3 */}
        {!isMobile && view === "grid3" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet
                ? "repeat(2, 1fr)"
                : "repeat(3, 1fr)",
              gap: 18,
              alignItems: "stretch",
            }}>
            {filteredPosts.length === 0 ? (
              <EmptyState
                isSearch={isSearch}
                query={query.trim()}
                onClear={clearSearch}
              />
            ) : (
              filteredPosts.map((post, i) => (
                <div key={post._id || i}>
                  <PostCard post={post} currentUser={currentUser} isGrid />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
