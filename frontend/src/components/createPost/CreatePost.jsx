import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePost = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setImgFile(f);
    setImgUrl(URL.createObjectURL(f));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handlePost = async () => {
    if (!imgFile || !title || !body || !location) {
      toast.error("Please fill all fields and add a photo.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", imgFile);
      fd.append("upload_preset", "InfraSync");
      const cR = await fetch(
        "https://api.cloudinary.com/v1_1/dqamluk2g/image/upload",
        { method: "POST", body: fd },
      );
      const cD = await cR.json();
      const bR = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/createPost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ title, body, location, photo: cD.secure_url }),
        },
      );
      if (bR.ok) {
        toast.success("Report submitted!");
        navigate("/");
      } else {
        const d = await bR.json();
        toast.error("Failed: " + d.error);
      }
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const charLeft = 280 - body.length;
  const filled = [imgFile, title, body, location].filter(Boolean).length;
  const progress = Math.round((filled / 4) * 100);

  return (
    <div className="page">
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ marginBottom: 28 }} className="fu">
          <span className="badge badge-teal" style={{ marginBottom: 12 }}>
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            New Report
          </span>
          <h1
            style={{
              fontSize: "clamp(22px,4vw,30px)",
              fontWeight: 900,
              marginBottom: 8,
            }}>
            Report an Issue
          </h1>
          <p style={{ color: "var(--ink3)", fontSize: 14, margin: 0 }}>
            Document a local infrastructure problem for your community
          </p>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
            <div
              style={{
                flex: 1,
                height: 4,
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
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: progress === 100 ? "var(--teal)" : "var(--ink3)",
                minWidth: 30,
              }}>
              {progress}%
            </span>
          </div>
        </div>

        <div className="card fu d1" style={{ borderRadius: 20 }}>
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
              margin: 16,
              borderRadius: 14,
              overflow: "hidden",
              border: `2px dashed ${dragging ? "var(--teal)" : imgUrl ? "var(--teal-bd)" : "var(--line2)"}`,
              background: dragging ? "var(--teal-bg)" : "var(--s2)",
              cursor: "pointer",
              transition: "all .2s",
              minHeight: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {imgUrl ? (
              <img
                src={imgUrl}
                alt="preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 340,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "var(--white)",
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    boxShadow: "var(--sh1)",
                  }}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ink4)"
                    strokeWidth="1.8"
                    strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <p
                  style={{
                    fontFamily: "'Epilogue',sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--ink2)",
                    margin: "0 0 5px",
                  }}>
                  {dragging ? "Drop to upload" : "Upload a photo"}
                </p>
                <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0 }}>
                  Drag & drop or click · PNG, JPG up to 10MB
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          {imgUrl && (
            <div style={{ padding: "0 16px 4px", textAlign: "right" }}>
              <button
                onClick={() => fileRef.current.click()}
                style={{
                  fontSize: 12,
                  color: "var(--teal)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                }}>
                Change photo
              </button>
            </div>
          )}

          <div
            style={{
              padding: "8px 20px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--ink2)",
                  marginBottom: 7,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}>
                Issue Title
              </label>
              <input
                className="inp"
                type="text"
                placeholder="e.g. Broken streetlight on MG Road"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 7,
                }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--ink2)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}>
                  Description
                </label>
                <span
                  style={{
                    fontSize: 11,
                    color: charLeft < 30 ? "var(--red)" : "var(--ink4)",
                    fontWeight: 600,
                  }}>
                  {charLeft} left
                </span>
              </div>
              <textarea
                className="inp"
                placeholder="Describe the issue — location context, severity, duration…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                maxLength={280}
                style={{ resize: "vertical", minHeight: 96 }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--ink2)",
                  marginBottom: 7,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}>
                Location
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ink4)",
                    pointerEvents: "none",
                  }}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <input
                  className="inp"
                  type="text"
                  placeholder="Street, area or landmark"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>
            <button
              onClick={handlePost}
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 4 }}>
              {loading ? (
                <>
                  <span className="spin-ring" />
                  Uploading &amp; submitting…
                </>
              ) : (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
