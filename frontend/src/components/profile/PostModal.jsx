import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

/* ── module-level cache: failed URLs never retry across re-renders ── */
const failedUrls = new Set();

const LetterAvatar = ({ name, size = 26, fontSize = 11 }) => {
  const letter = (name || "?").trim()[0].toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: "var(--teal-bg)",
        border: "1.5px solid var(--teal-bd)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Epilogue',sans-serif",
        fontWeight: 800,
        fontSize,
        color: "var(--teal)",
        userSelect: "none",
      }}>
      {letter}
    </div>
  );
};

const Avatar = ({ user, size = 26, fontSize = 11 }) => {
  const photo = user?.photo;
  /* initialise from cache so re-renders never retry a known-bad URL */
  const [errored, setErrored] = useState(() => !photo || failedUrls.has(photo));
  if (photo && !errored) {
    return (
      <img
        src={photo}
        alt={user.userName || user.name || ""}
        onError={() => {
          failedUrls.add(photo);
          setErrored(true);
        }}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: "1.5px solid var(--teal-bd)",
          display: "block",
        }}
      />
    );
  }
  return (
    <LetterAvatar
      name={user?.userName || user?.name}
      size={size}
      fontSize={fontSize}
    />
  );
};

const PostModal = ({ post, onClose, onDeletePost }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const fetchComments = () => {
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
  };

  useEffect(() => {
    fetchComments();
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
      setCommentText("");
      await fetchComments();
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const r = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/deletePost/${post._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      if (!r.ok) throw new Error();
      toast.success("Report deleted");
      onDeletePost && onDeletePost(post._id);
      onClose();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const modal = (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(15,23,42,.7)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 16,
      }}>
      <div
        style={{
          background: "var(--white)",
          borderRadius: isMobile ? "22px 22px 0 0" : 22,
          width: "100%",
          maxWidth: isMobile ? "100%" : 880,
          height: isMobile ? "95vh" : "88vh",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,.35)",
          border: "1px solid var(--line)",
        }}>
        {/* Left image panel - desktop only */}
        {!isMobile && (
          <div
            style={{
              flex: 1,
              background: "var(--s2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}>
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
                  "linear-gradient(to top,rgba(15,23,42,.9),transparent)",
              }}>
              <p
                style={{
                  fontFamily: "'Epilogue',sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#fff",
                  margin: "0 0 5px",
                }}>
                {post.title}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,.65)",
                  margin: "0 0 8px",
                  lineHeight: 1.5,
                }}>
                {post.body}
              </p>
              {post.location && (
                <span className="badge badge-teal" style={{ fontSize: 10 }}>
                  📍 {post.location}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Right comments panel */}
        <div
          style={{
            width: isMobile ? "100%" : 340,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderLeft: isMobile ? "none" : "1px solid var(--line)",
            minHeight: 0,
            flex: isMobile ? 1 : "none",
          }}>
          {/* Header */}
          <div
            style={{
              padding: "13px 16px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar user={post.postedBy} size={32} fontSize={13} />
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
            <div style={{ display: "flex", gap: 6 }}>
              {confirmDel ? (
                <>
                  <button
                    onClick={handleDelete}
                    className="btn btn-danger btn-sm"
                    style={{ fontSize: 12 }}>
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDel(false)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 12 }}>
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmDel(true)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "var(--red-bg)",
                    border: "1px solid var(--red-bd)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--red)",
                  }}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              )}
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
          </div>

          {/* Mobile: image + post info */}
          {isMobile && (
            <div style={{ flexShrink: 0 }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "var(--s2)",
                  overflow: "hidden",
                }}>
                <img
                  src={post.photo}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  padding: "10px 16px 8px",
                  borderBottom: "1px solid var(--line)",
                }}>
                <p
                  style={{
                    fontFamily: "'Epilogue',sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--ink)",
                    margin: "0 0 3px",
                  }}>
                  {post.title}
                </p>
                {post.body && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--ink3)",
                      margin: "0 0 5px",
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
          )}

          {/* Stats */}
          <div
            style={{
              padding: "9px 16px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              gap: 16,
              background: "var(--s2)",
              flexShrink: 0,
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
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="var(--red)"
                stroke="var(--red)"
                strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {post.likes?.length || 0} likes
            </span>
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
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="2"
                strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {comments.length} comments
            </span>
          </div>

          {/* Comments list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "13px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 11,
              minHeight: 0,
            }}>
            {comments.length === 0 ? (
              <p
                style={{
                  color: "var(--ink4)",
                  fontSize: 13,
                  textAlign: "center",
                  paddingTop: 28,
                }}>
                No comments yet.
              </p>
            ) : (
              comments.map((c, i) => (
                <div key={c._id || i} style={{ display: "flex", gap: 8 }}>
                  <Avatar user={c.postedBy} size={26} fontSize={10} />
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
                      {c.postedBy?.userName}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--ink2)" }}>
                      {c.comment}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment input */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid var(--line)",
              background: "var(--s2)",
              display: "flex",
              gap: 7,
              flexShrink: 0,
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

  return createPortal(modal, document.body);
};

export default PostModal;
