"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const CommentsPage = ({ comments: initialComments, unique }) => {
  const [commentsList, setCommentsList] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  console.log("commentsList", commentsList, "session", session)

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/mixtape/${unique}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      setCommentsList([data.comment, ...commentsList]);
      setNewComment("");
      toast.success(data.message);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!session) {
      toast.error("Please login to delete comments");
      return;
    }

    try {
      const response = await fetch(`/api/mixtape/${unique}/comment/${commentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete comment");
      }

      setCommentsList(commentsList.filter((comment) => comment.id !== commentId));
      toast.success(data.message);
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.message || "Failed to delete comment");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-4">
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {session.user?.profilep ? (
                  <Image
                    src={session.user.profilep}
                    alt={session.user.username || session.user.email}
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {(session.user?.username || session.user?.email)?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border  rounded-lg resize-none h-20 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" />}
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg mb-8">
          <p className="text-gray-600">
            Please{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              login
            </a>{" "}
            to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {commentsList?.length > 0 ? (
          commentsList.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  {comment.user?.profilep ? (
                    <Image
                      src={comment.user.profilep}
                      alt={comment.user.username || comment.user.djName || "User"}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {(comment.user?.username || comment.user?.djName)?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">
                      {comment.user?.djName || comment.user?.username || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {comment.createdAt
                        ? formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })
                        : "Just now"}
                    </p>
                  </div>
                  {session &&
                    (session.user.id === comment.userId ||
                      session.user.id === comment.mixtape?.userId) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 flex-shrink-0"
                        title="Delete comment"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
