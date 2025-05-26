"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaSpinner, FaTrash } from "react-icons/fa";
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
        {
          method: "DELETE",
        }
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

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Comment Form */}
      {session ? (
        <form
          onSubmit={handleSubmitComment}
          className="mb-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
        >
          <div className="flex gap-4">
            <div className="w-10 h-10 relative">
              {session.user?.profilep ? (
                <Image
                  src={session.user.profilep}
                  alt="User"
                  fill
                  sizes="40px"
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {(session.user?.username ||
                    session.user?.email)?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full h-24 p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" />}
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl text-center mb-8">
          <p className="text-gray-600 dark:text-gray-300">
            Please{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              login
            </Link>{" "}
            to comment.
          </p>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-6">
        {commentsList.length > 0 ? (
          commentsList.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="w-10 h-10 relative flex-shrink-0">
                {comment.user?.profilep ? (
                  <Image
                    src={comment.user.profilep}
                    alt="User"
                    fill
                    sizes="40px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {(comment.user?.username ||
                      comment.user?.djName)?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm truncate">
                      {comment.user?.djName ||
                        comment.user?.username ||
                        "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {session &&
                    (session.user.id === comment.user.id ||
                      session.user.id === comment.mixtape?.userId) && (
                      <button
                        onClick={() => {
                          setCommentToDelete(comment.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                </div>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first!
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
            <h3 className="text-lg font-bold">Delete Comment</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this comment? This cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
              >
                {isDeleting && <FaSpinner className="animate-spin" />}
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
