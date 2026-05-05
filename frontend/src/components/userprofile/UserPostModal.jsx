import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserPostModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/getComments/${post._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    )
      .then((r) => r.json())
      .then((d) => setComments(d.comments || []))
      .catch(console.error);
  }, [post._id]);

  const handlePost = async () => {
    if (!commentText.trim()) return;
    setIsPosting(true);
    try {
      const r = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/comment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ postId: post._id, comment: commentText }),
        },
      );
      if (!r.ok) throw new Error();
      const d = await r.json();
      setComments(d.comments);
      setCommentText("");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div
      className="fi"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(15,23,42,.7)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}>
      <div
        className="si"
        style={{
          background: "var(--white)",
          borderRadius: 22,
          width: "100%",
          maxWidth: 860,
          maxHeight: "90vh",
          display: "flex",
          overflow: "hidden",
          boxShadow: "var(--sh4)",
          border: "1px solid var(--line)",
        }}>
        <div
          style={{
            flex: 1,
            background: "var(--s2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          className="hidden sm:flex">
          <img
            src={post.photo}
            alt={post.title}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "22px 20px 18px",
              background:
                "linear-gradient(to top,rgba(15,23,42,.88),transparent)",
            }}>
            <p
              style={{
                fontFamily: "'Epilogue',sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                margin: "0 0 5px",
              }}>
              {post.title}
            </p>
            {post.body && (
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,.6)",
                  margin: "0 0 8px",
                  lineHeight: 1.5,
                }}>
                {post.body}
              </p>
            )}
            {post.location && (
              <span className="badge badge-teal" style={{ fontSize: 10 }}>
                📍 {post.location}
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            width: 330,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid var(--line)",
          }}>
          <div
            style={{
              padding: "13px 16px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={post.postedBy?.photo || "https://i.pravatar.cc/32"}
                alt=""
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--teal-bd)",
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "'Epilogue',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "var(--ink)",
                  }}>
                  {post.postedBy?.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink4)" }}>
                  @{post.postedBy?.userName}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--s2)",
                border: "1px solid var(--line)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink3)",
              }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div
            style={{
              padding: "9px 16px",
              borderBottom: "1px solid var(--line)",
              background: "var(--s2)",
            }}>
            <span
              style={{
                fontSize: 12,
                color: "var(--ink3)",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontWeight: 500,
              }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="var(--red)"
                stroke="var(--red)"
                strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {post.likes?.length || 0} likes · {comments.length} comments
            </span>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "13px 15px",
              display: "flex",
              flexDirection: "column",
              gap: 11,
            }}>
            {comments.length === 0 ? (
              <p
                style={{
                  color: "var(--ink4)",
                  fontSize: 13,
                  textAlign: "center",
                  paddingTop: 24,
                }}>
                No comments yet.
              </p>
            ) : (
              comments.map((c, i) => (
                <div key={c._id || i} style={{ display: "flex", gap: 8 }}>
                  <img
                    src={c.postedBy?.photo || "https://i.pravatar.cc/24"}
                    alt=""
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                      marginTop: 2,
                      border: "1.5px solid var(--line)",
                    }}
                  />
                  <div
                    style={{
                      background: "var(--s2)",
                      borderRadius: 9,
                      padding: "6px 10px",
                      border: "1px solid var(--line)",
                      flex: 1,
                    }}>
                    <span
                      style={{
                        fontFamily: "'Epilogue',sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        color: "var(--teal)",
                        marginRight: 5,
                      }}>
                      {c.postedBy?.userName || "User"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--ink2)" }}>
                      {c.comment}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div
            style={{
              padding: "10px 13px",
              borderTop: "1px solid var(--line)",
              background: "var(--s2)",
              display: "flex",
              gap: 7,
            }}>
            <input
              type="text"
              placeholder="Add a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isPosting && handlePost()}
              style={{
                flex: 1,
                background: "var(--white)",
                border: "1.5px solid var(--line)",
                borderRadius: 8,
                padding: "7px 11px",
                fontSize: 12,
                fontFamily: "'DM Sans',sans-serif",
                outline: "none",
                color: "var(--ink)",
                transition: "border-color .2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--teal)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
            <button
              onClick={handlePost}
              disabled={isPosting || !commentText.trim()}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: commentText.trim() ? "var(--teal)" : "var(--s3)",
                border: "none",
                cursor: commentText.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background .2s",
              }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={commentText.trim() ? "#fff" : "var(--ink4)"}
                strokeWidth="2.2"
                strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserPostModal;
