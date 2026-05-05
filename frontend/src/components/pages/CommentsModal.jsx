import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const failedUrls = new Set();

const LetterAvatar = ({ name, size = 28, fontSize = 12 }) => {
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
        fontFamily: "'Epilogue', sans-serif",
        fontWeight: 800,
        fontSize,
        color: "var(--teal)",
        userSelect: "none",
      }}>
      {letter}
    </div>
  );
};

const Avatar = ({ user, size = 28, fontSize = 12 }) => {
  const photo = user?.photo;
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

const CommentsModal = ({ post, commentText, onClose, onCommentChange }) => {
  const [comments, setComments] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const fetchComments = () =>
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
      onCommentChange("");
      await fetchComments();
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
        background: "rgba(15,23,42,.65)",
        backdropFilter: "blur(8px)",
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
          maxWidth: 880,
          height: "88vh" /* ← fixed height, never grows */,
          display: "flex",
          overflow: "hidden",
          boxShadow: "var(--sh4)",
          border: "1px solid var(--line)",
        }}>
        {/* Left: image */}
        <div
          style={{
            flex: 1,
            background: "var(--s2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            height: "100%",
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
                margin: "0 0 4px",
              }}>
              {post.title}
            </p>
            {post.body && (
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,.6)",
                  margin: "0 0 8px",
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

        {/* Right: panel */}
        <div
          style={{
            width: 350,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid var(--line)",
            height: "100%",
            overflow: "hidden" /* ← fill height, clip overflow */,
          }}>
          {/* post author header */}
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
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--line)";
                e.currentTarget.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--s2)";
                e.currentTarget.style.color = "var(--ink3)";
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

          {/* post body */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid var(--line)",
              fontSize: 13,
              color: "var(--ink3)",
              lineHeight: 1.6,
              background: "var(--s2)",
              flexShrink: 0,
            }}>
            {post.body}
          </div>

          {/* comments list — flex:1 scrolls within fixed panel */}
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
                  paddingTop: 30,
                }}>
                No comments yet. Be first!
              </p>
            ) : (
              comments.map((c, i) => (
                <div key={c._id || i} style={{ display: "flex", gap: 9 }}>
                  <Avatar user={c.postedBy} size={28} fontSize={11} />
                  <div
                    style={{
                      background: "var(--s2)",
                      borderRadius: 10,
                      padding: "7px 11px",
                      border: "1px solid var(--line)",
                      flex: 1,
                    }}>
                    <div
                      style={{
                        fontFamily: "'Epilogue',sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        color: "var(--teal)",
                        marginBottom: 3,
                      }}>
                      {c.postedBy?.userName || "User"}
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--ink2)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}>
                      {c.comment}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* comment input */}
          <div
            style={{
              padding: "11px 14px",
              borderTop: "1px solid var(--line)",
              background: "var(--s2)",
              display: "flex",
              gap: 8,
              flexShrink: 0,
            }}>
            <input
              type="text"
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => onCommentChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isPosting && handlePost()}
              style={{
                flex: 1,
                background: "var(--white)",
                border: "1.5px solid var(--line)",
                borderRadius: 9,
                padding: "8px 12px",
                fontSize: 13,
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
                width: 36,
                height: 36,
                borderRadius: 9,
                background: commentText.trim() ? "var(--teal)" : "var(--s3)",
                border: "none",
                cursor: commentText.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background .2s",
              }}>
              {isPosting ? (
                <div
                  className="spin-ring"
                  style={{ width: 14, height: 14, borderWidth: 2 }}
                />
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={commentText.trim() ? "#fff" : "var(--ink4)"}
                  strokeWidth="2.2"
                  strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
