"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { MessageCircle, Send, LogIn } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import Link from "next/link";

const CommentsPage = ({ comments: initialComments, unique }) => {
  const [commentsList, setCommentsList] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: session } = useSession();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Please login to comment");
    if (!newComment.trim()) return toast.error("Comment cannot be empty");

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/mixtape/${unique}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add comment");

      setCommentsList([data.comment, ...commentsList]);
      setNewComment("");
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!session) return toast.error("Please login to delete comments");

    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/mixtape/${unique}/comment/${commentToDelete}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete comment");

      setCommentsList(commentsList.filter((c) => c.id !== commentToDelete));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to delete comment");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const getInitial = (user) =>
    (user?.djName || user?.username || user?.email || "?")?.[0]?.toUpperCase();

  return (
    <div className="w-full space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-500/10 rounded-xl">
          <MessageCircle className="h-5 w-5 text-indigo-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Comments</h2>
        {commentsList.length > 0 && (
          <span className="ml-1 px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
            {commentsList.length}
          </span>
        )}
      </div>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 flex-shrink-0 relative">
              {session.user?.profilep ? (
                <Image
                  src={session.user.profilep}
                  alt="User"
                  fill
                  sizes="40px"
                  className="rounded-full object-cover ring-2 ring-indigo-500/30"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-indigo-500/30">
                  {getInitial(session.user)}
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="flex-grow min-w-0">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this mix..."
                rows={3}
                className="w-full p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none transition"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin" size={14} />
                  ) : (
                    <Send size={14} />
                  )}
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl p-5 text-center">
          <LogIn className="h-7 w-7 mx-auto text-indigo-400 mb-2" />
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Want to join the conversation?{" "}
            <Link href="/login" className="text-indigo-500 font-semibold hover:underline">
              Log in
            </Link>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {commentsList.length > 0 ? (
          commentsList.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors duration-200 group"
            >
              {/* Avatar */}
              <div className="w-9 h-9 flex-shrink-0 relative">
                {comment.user?.profilep ? (
                  <Image
                    src={comment.user.profilep}
                    alt="User"
                    fill
                    sizes="36px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xs">
                    {getInitial(comment.user)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {comment.user?.djName || comment.user?.username || "Anonymous"}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100/60 dark:bg-white/5 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {session &&
                    (session.user.id === comment.user?.id ||
                      session.user.id === comment.mixtape?.userId) && (
                      <button
                        onClick={() => {
                          setCommentToDelete(comment.id);
                          setShowDeleteModal(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                        title="Delete comment"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                </div>
                <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <MessageCircle className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No comments yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <FaTrash className="text-red-500" size={16} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Comment</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting && <FaSpinner className="animate-spin" size={12} />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
