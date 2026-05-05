import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserProfileCard from "./UserProfileCard";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [userId]);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v3/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!r.ok) throw new Error();
        const d = await r.json();
        setUser(d.user);
        setPosts(d.posts);
      } catch {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

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
        <p style={{ color: "var(--ink3)" }}>Loading profile…</p>
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

  return (
    <div className="page">
      <div className="wrap">
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
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                padding: 3,
                background: "linear-gradient(135deg,#3b82f6,var(--teal))",
                flexShrink: 0,
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
            <div style={{ flex: 1, minWidth: 160 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 3px" }}>
                {user?.name}
              </h1>
              <p
                style={{
                  color: "var(--ink3)",
                  fontSize: 13,
                  margin: "0 0 16px",
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
                    {posts.reduce((s, p) => s + (p.likes?.length || 0), 0)}
                  </div>
                  <div className="stat-l">Likes</div>
                </div>
              </div>
            </div>
            <span className="badge badge-teal">Community Member</span>
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
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Reports</h2>
          <span className="badge badge-slate">{posts.length}</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
            gap: 16,
          }}>
          {posts.length === 0 ? (
            <div
              className="card"
              style={{
                gridColumn: "1/-1",
                padding: "50px 24px",
                textAlign: "center",
                borderRadius: 18,
              }}>
              <p style={{ color: "var(--ink4)", fontSize: 14 }}>
                No reports yet.
              </p>
            </div>
          ) : (
            posts.map((post, i) => (
              <div key={post._id} className={`fu d${Math.min(i + 1, 5)}`}>
                <UserProfileCard post={post} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
