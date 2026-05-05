import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CommentsModal from "./CommentsModal";
import { toast } from "react-toastify";

const timeAgo = (d) => {
  if (!d) return "";
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const PostCard = ({ post, currentUser, isGrid }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const heartRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = showComments ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showComments]);
  useEffect(() => {
    if (post?.likes && currentUser?._id)
      setLiked(post.likes.some((id) => id === currentUser._id));
  }, []);
  if (!post) return null;

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikesCount((c) => (next ? c + 1 : c - 1));
    if (heartRef.current) {
      heartRef.current.classList.remove("ph");
      void heartRef.current.offsetWidth;
      heartRef.current.classList.add("ph");
    }
    try {
      const url = liked
        ? `${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/unlike`
        : `${import.meta.env.VITE_BACKEND_BASEURL}/api/v2/like`;
      const r = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ postId: post._id }),
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setLikesCount(d.likes.length);
    } catch {
      setLiked(!next);
      setLikesCount((c) => (next ? c - 1 : c + 1));
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsPostingComment(true);
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
      setIsPostingComment(false);
    }
  };

  return (
    <>
      <article
        className="card fu"
        style={{
          width: "100%",
          marginBottom: 0,
          borderRadius: 18,
          display: "flex",
          flexDirection: "column",
          height: isGrid ? "100%" : "auto",
        }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "13px 16px",
            flexWrap: isGrid ? "wrap" : "nowrap",
            gap: isGrid ? 6 : 0,
          }}>
          <Link
            to={`/profile/${post.postedBy._id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}>
            <div style={{ position: "relative" }}>
              <img
                src={post.postedBy.photo || "https://i.pravatar.cc/40"}
                alt={post.postedBy.name}
                style={{
                  width: isGrid ? 32 : 40,
                  height: isGrid ? 32 : 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--teal-bd)",
                  display: "block",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 1,
                  right: 1,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--grn)",
                  border: "2px solid var(--white)",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Epilogue',sans-serif",
                  fontWeight: 700,
                  fontSize: isGrid ? 12 : 14,
                  color: "var(--ink)",
                }}>
                {post.postedBy.name}
              </div>
              <div style={{ fontSize: isGrid ? 10 : 12, color: "var(--ink4)" }}>
                @{post.postedBy.userName}
              </div>
            </div>
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}>
            {post.location && (
              <span className="badge badge-slate" style={{ fontSize: 10 }}>
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {post.location}
              </span>
            )}
            <span
              style={{ fontSize: 11, color: "var(--ink4)", fontWeight: 500 }}>
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Title + body */}
        <div style={{ padding: "0 16px 10px" }}>
          <div
            style={{
              fontFamily: "'Epilogue',sans-serif",
              fontWeight: 700,
              fontSize: isGrid ? 13 : 15,
              color: "var(--ink)",
              marginBottom: 3,
            }}>
            {post.title}
          </div>
          {!isGrid && (
            <div
              style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.6 }}>
              {post.body}
            </div>
          )}
        </div>

        {/* Image */}
        <div
          style={{
            position: "relative",
            background: "var(--s2)",
            minHeight: !imgLoaded ? (isGrid ? 140 : 200) : undefined,
            flex: isGrid ? "none" : undefined,
          }}>
          {!imgLoaded && (
            <div
              className="skel"
              style={{
                position: "absolute",
                inset: 0,
                minHeight: isGrid ? 140 : 200,
              }}
            />
          )}
          <img
            src={post.photo}
            alt={post.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%",
              height: isGrid ? 160 : undefined,
              maxHeight: isGrid ? 160 : 480,
              objectFit: "cover",
              display: imgLoaded ? "block" : "none",
            }}
          />
        </div>

        {/* Actions */}
        <div
          style={{
            padding: isGrid ? "10px 12px 12px" : "12px 16px 14px",
            marginTop: "auto",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingBottom: isGrid ? 10 : 12,
            }}>
            <button
              ref={heartRef}
              onClick={handleLike}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: liked ? "var(--red)" : "var(--ink3)",
                transition: "color .2s",
              }}>
              <svg
                width={isGrid ? 17 : 20}
                height={isGrid ? 17 : 20}
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                style={{ transition: "fill .2s" }}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              <span
                style={{
                  fontFamily: "'Epilogue',sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                }}>
                {likesCount}
              </span>
            </button>
            <button
              onClick={() => setShowComments(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "var(--ink3)",
                transition: "color .2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--teal)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--ink3)")
              }>
              <svg
                width={isGrid ? 17 : 19}
                height={isGrid ? 17 : 19}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <span
                style={{
                  fontFamily: "'Epilogue',sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                }}>
                {comments.length}
              </span>
            </button>
          </div>

          {/* Quick comment — hidden in grid for compactness */}
          {!isGrid && (
            <div
              style={{
                display: "flex",
                gap: 9,
                alignItems: "center",
                borderTop: "1px solid var(--line)",
                paddingTop: 12,
              }}>
              <img
                src={currentUser?.photo || "https://i.pravatar.cc/30"}
                alt="you"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1.5px solid var(--teal-bd)",
                }}
              />
              <input
                type="text"
                placeholder="Add a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                style={{
                  flex: 1,
                  background: "var(--s2)",
                  border: "1.5px solid var(--line)",
                  borderRadius: 8,
                  padding: "7px 12px",
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
                onClick={handlePostComment}
                disabled={isPostingComment || !commentText.trim()}
                style={{
                  background: commentText.trim() ? "var(--teal)" : "var(--s3)",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 14px",
                  color: commentText.trim() ? "#fff" : "var(--ink4)",
                  fontFamily: "'Epilogue',sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: commentText.trim() ? "pointer" : "default",
                  transition: "background .2s",
                }}>
                {isPostingComment ? "…" : "Post"}
              </button>
            </div>
          )}

          {/* Grid: compact comment trigger */}
          {isGrid && (
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              <button
                onClick={() => setShowComments(true)}
                style={{
                  width: "100%",
                  background: "var(--s2)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  color: "var(--ink4)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                Add a comment…
              </button>
            </div>
          )}
        </div>
      </article>

      {showComments && (
        <CommentsModal
          post={post}
          comments={comments}
          commentText={commentText}
          isPostingComment={isPostingComment}
          onClose={() => setShowComments(false)}
          onCommentChange={setCommentText}
          onPostComment={handlePostComment}
        />
      )}
    </>
  );
};
export default PostCard;
