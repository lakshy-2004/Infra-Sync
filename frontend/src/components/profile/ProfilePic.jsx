import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePic = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [user, setUser] = useState({ name: "", userName: "", photo: "" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/userPosts`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const d = await r.json();
        setUser({
          name: d.user.name,
          userName: d.user.userName,
          photo: d.user.photo,
        });
      } catch {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "InfraSync");
      const cR = await fetch(
        "https://api.cloudinary.com/v1_1/dqamluk2g/image/upload",
        { method: "POST", body: fd },
      );
      const cD = await cR.json();
      if (!cR.ok) {
        toast.error("Upload failed");
        return;
      }
      const r = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v3/photo`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ photo: cD.secure_url }),
        },
      );
      if (!r.ok) {
        toast.error("Failed to update photo");
        return;
      }
      toast.success("Profile picture updated!");
      navigate("/profile");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

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
        <p style={{ color: "var(--ink3)" }}>Loading…</p>
      </div>
    );

  const src = preview || user.photo;

  return (
    <div
      className="page"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 16px" }}>
        <div style={{ marginBottom: 28 }} className="fu">
          <span className="badge badge-teal" style={{ marginBottom: 12 }}>
            Edit Profile
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>
            Update Photo
          </h1>
          <p style={{ color: "var(--ink3)", fontSize: 14 }}>
            New photo for{" "}
            <strong style={{ color: "var(--ink)" }}>@{user.userName}</strong>
          </p>
        </div>
        <div
          className="card fu d1"
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            borderRadius: 20,
          }}>
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                padding: 3,
                background: src
                  ? "linear-gradient(135deg,var(--teal),#14b8a6)"
                  : "var(--line)",
              }}>
              {src ? (
                <img
                  src={src}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid var(--white)",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "var(--s2)",
                    border: "3px solid var(--white)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ink4)"
                    strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            {preview && (
              <div
                style={{
                  position: "absolute",
                  bottom: 3,
                  right: 3,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--teal)",
                  border: "2.5px solid var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
          {/* Drop zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              width: "100%",
              border: `2px dashed ${dragging ? "var(--teal)" : "var(--line2)"}`,
              borderRadius: 14,
              padding: "24px 16px",
              background: dragging ? "var(--teal-bg)" : "var(--s2)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all .2s",
            }}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ink4)"
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{ display: "block", margin: "0 auto 10px" }}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p
              style={{
                fontFamily: "'Epilogue',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "var(--ink2)",
                margin: "0 0 4px",
              }}>
              {dragging ? "Drop it!" : "Choose a photo"}
            </p>
            <p style={{ fontSize: 11, color: "var(--ink4)", margin: 0 }}>
              Drag & drop or click · PNG, JPG
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button
              onClick={() => navigate("/profile")}
              className="btn btn-outline"
              style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="btn btn-primary"
              style={{ flex: 2 }}>
              {uploading ? (
                <>
                  <span className="spin-ring" />
                  Uploading…
                </>
              ) : (
                "Save Photo"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePic;
