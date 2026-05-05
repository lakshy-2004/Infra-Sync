import React, { useState, useEffect } from "react";
import PostModal from "./PostModal";

const ProfilePostCard = ({ post, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);
  if (!post) return null;

  return (
    <>
      <div
        className="card card-lift"
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer", borderRadius: 16 }}>
        <div
          style={{
            position: "relative",
            paddingTop: "68%",
            background: "var(--s2)",
            overflow: "hidden",
          }}>
          {!imgLoaded && (
            <div className="skel" style={{ position: "absolute", inset: 0 }} />
          )}
          <img
            src={post.photo}
            alt={post.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: imgLoaded ? "block" : "none",
              transition: "transform .4s",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              transition: "background .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(15,23,42,.45)";
              e.currentTarget
                .querySelectorAll("span")
                .forEach((s) => (s.style.opacity = "1"));
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget
                .querySelectorAll("span")
                .forEach((s) => (s.style.opacity = "0"));
            }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "#fff",
                fontFamily: "'Epilogue',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                opacity: 0,
                transition: "opacity .2s",
                pointerEvents: "none",
              }}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#fff"
                stroke="#fff"
                strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {post.likes?.length || 0}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "#fff",
                fontFamily: "'Epilogue',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                opacity: 0,
                transition: "opacity .2s",
                pointerEvents: "none",
              }}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#fff"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {post.comments?.length || 0}
            </span>
          </div>
        </div>
        <div style={{ padding: "12px 14px" }}>
          <div
            style={{
              fontFamily: "'Epilogue',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "var(--ink)",
              marginBottom: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {post.title}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            {post.location ? (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--ink4)",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}>
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {post.location}
              </span>
            ) : (
              <span />
            )}
            <span
              style={{
                fontSize: 11,
                color: "var(--red)",
                fontWeight: 700,
                fontFamily: "'Epilogue',sans-serif",
              }}>
              {post.likes?.length || 0} ♥
            </span>
          </div>
        </div>
      </div>
      {showModal && (
        <PostModal
          post={post}
          onClose={() => setShowModal(false)}
          onDeletePost={onDelete}
        />
      )}
    </>
  );
};
export default ProfilePostCard;
