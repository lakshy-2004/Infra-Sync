import React, { useState, useEffect } from "react";
import UserPostModal from "./UserPostModal";

const UserProfileCard = ({ post }) => {
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
            }}
          />
        </div>
        <div style={{ padding: "11px 13px" }}>
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
        <UserPostModal post={post} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
export default UserProfileCard;
