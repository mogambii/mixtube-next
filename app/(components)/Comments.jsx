"use client";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";

const CommentsPage = ({ comment, id, username,token }) => {

  const [comments, setComments] = useState(comment);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/comment/${id}/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.commentId !== commentId)
        );
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting your comment.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const comment = {
      postId: id,
      username,
      comment: newComment,
    }
    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(comment)
        }
      );

      if (response.ok) {
        const comment = await response.json();
        setComments((prevComments) => [...prevComments, comment.comment]);
        setNewComment(""); // Clear the input after successful submission
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("An error occurred while submitting your comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteComment(commentToDelete);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting the comment.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setCommentToDelete(null);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        Comments
      </h3>
      {username ? (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition duration-300"
            rows="3"
            required
          ></textarea>
          <button
            type="submit"
            className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? <FaSpinner className="animate-spin" /> : "Submit"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>{" "}
          to add a comment.
        </p>
      )}
      <div className="mt-4 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.commentId}
              className="border-b border-gray-200 pb-2 flex justify-between items-start bg-gray-50 dark:bg-gray-700 p-2 rounded-md shadow-sm transition duration-300"
            >
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">
                  {comment.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {comment.comment}
                </p>
              </div>
              {comment.name === username && (
                <button
                  onClick={() => confirmDelete(comment.commentId)}
                  className="text-red-500 hover:underline transition duration-300"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No comments yet.</p>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Are you sure you want to delete this comment?
            </h3>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 text-gray-500 hover:underline dark:text-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 w-20 text-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
