import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePostCard from "./ProfilePostCard";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/userPosts`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!r.ok) throw new Error();
        const d = await r.json();
        setUser(d.user);
        setPosts(d.posts);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div
        className="page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 14,
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
        <p style={{ color: "var(--ink3)", fontSize: 14 }}>Loading profile…</p>
      </div>
    );
  if (error)
    return (
      <div
        className="page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <p style={{ color: "var(--red)" }}>{error}</p>
      </div>
    );

  const totalLikes = posts.reduce((s, p) => s + (p.likes?.length || 0), 0);

  return (
    <div className="page">
      <div className="wrap">
        {/* Profile header */}
        <div
          className="card fu"
          style={{ padding: "28px", marginBottom: 28, borderRadius: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  padding: 3,
                  background: "linear-gradient(135deg,var(--teal),#14b8a6)",
                }}>
                <img
                  src={user?.photo || "https://i.pravatar.cc/150"}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid var(--white)",
                    display: "block",
                  }}
                />
              </div>
              <button
                onClick={() => navigate("/profile-pic")}
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--teal)",
                  border: "2.5px solid var(--white)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(13,148,136,.4)",
                }}>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  margin: "0 0 2px",
                  letterSpacing: "-0.03em",
                }}>
                {user?.name}
              </h1>
              <p
                style={{
                  color: "var(--ink3)",
                  fontSize: 13,
                  margin: "0 0 18px",
                  fontWeight: 500,
                }}>
                @{user?.userName}
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div className="stat">
                  <div className="stat-n">{posts.length}</div>
                  <div className="stat-l">Reports</div>
                </div>
                <div className="stat">
                  <div className="stat-n" style={{ color: "var(--red)" }}>
                    {totalLikes}
                  </div>
                  <div className="stat-l">Likes</div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "flex-end",
              }}>
              <button
                onClick={() => navigate("/profile-pic")}
                className="btn btn-outline btn-sm">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/createpost")}
                className="btn btn-primary btn-sm">
                + New Report
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
          className="fu d1">
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>
            My Reports
          </h2>
          <span className="badge badge-teal">{posts.length}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: 18,
          }}>
          {posts.length === 0 ? (
            <div
              className="card"
              style={{
                gridColumn: "1/-1",
                padding: "60px 24px",
                textAlign: "center",
                borderRadius: 18,
              }}>
              <p
                style={{
                  color: "var(--ink4)",
                  fontSize: 15,
                  marginBottom: 20,
                }}>
                No reports yet.
              </p>
              <button
                onClick={() => navigate("/createpost")}
                className="btn btn-primary">
                Make your first report
              </button>
            </div>
          ) : (
            posts.map((post, i) => (
              <div key={post._id} className={`fu d${Math.min(i + 1, 5)}`}>
                <ProfilePostCard
                  post={post}
                  onDelete={(id) => setPosts(posts.filter((p) => p._id !== id))}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
