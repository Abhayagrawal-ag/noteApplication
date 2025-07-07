import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AllSharedNotes() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  const fetchSharedNotes = async () => {
    try {
      const userEmail = localStorage.getItem("email");
      const response = await axios.get(
        "https://noteapplication-backend.onrender.com/auth/shared-notes",
        {
          params: { email: userEmail },
        }
      );

      // Backend returns {success: true, count: number, notes: array}
      if (response.data.success) {
        setSharedNotes(response.data.notes || []);
      } else {
        setSharedNotes([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shared notes:", error);
      setMessage("Error loading shared notes");
      setMessageType("error");
      setLoading(false);
    }
  };

  const deleteSharedNote = async (sharedNoteId) => {
    if (!window.confirm("Are you sure you want to delete this shared note?")) {
      return;
    }

    try {
      const userEmail = localStorage.getItem("email");
      const response = await axios.delete(
        `https://noteapplication-backend.onrender.com/auth/shared-notes/${sharedNoteId}`,
        {
          data: { email: userEmail }, // Send email in request body for DELETE
        }
      );

      if (response.data.success) {
        // Remove the deleted note from the state
        const updatedSharedNotes = sharedNotes.filter(
          (note) => note._id !== sharedNoteId
        );
        setSharedNotes(updatedSharedNotes);

        setMessage("Shared note deleted successfully!");
        setMessageType("success");

        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      } else {
        setMessage(response.data.message || "Error deleting shared note");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error deleting shared note:", error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error deleting shared note");
      }
      setMessageType("error");
    }
  };

  const handleBackToNotes = () => {
    navigate("/notes");
  };

  const handleShareNewNote = () => {
    navigate("/notes");
  };

  const handleRefreshSharedNotes = () => {
    setLoading(true);
    setMessage("");
    setMessageType("");
    fetchSharedNotes();
  };

  const handleViewSharedNote = (noteId) => {
    const userEmail = localStorage.getItem("email");
    // Navigate to view shared note (you can create a separate route for this)
    navigate(`/shared-notes/${noteId}?email=${userEmail}`);
  };

  if (loading) {
    return (
      <>
        <div
          style={{ background: "#3366FF" }}
          className="w-full text-2xl font-bold text-center p-4 text-white"
        >
          All Shared Notes
        </div>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shared notes...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div
        style={{ background: "#3366FF" }}
        className="w-full text-2xl font-bold text-center p-4 text-white"
      >
        All Received Notes
      </div>

      {/* Action Buttons */}
      <div className="w-full bg-white p-4 shadow-sm border-b">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBackToNotes}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
            >
              Back to My Notes
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Total Received: {sharedNotes.length}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="w-full bg-white px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <div
              className={`p-3 rounded-md text-xs sm:text-sm ${
                messageType === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          </div>
        </div>
      )}

      {/* Shared Notes List */}
      <div className="w-full flex flex-col items-center bg-gray-100 gap-1 py-8 min-h-screen">
        {sharedNotes.length > 0 ? (
          sharedNotes.map((sharedNote) => (
            <div
              key={sharedNote._id}
              className="bg-white p-4 m-2 rounded-md w-[300px] sm:w-[500px] md:w-[600px] shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-3">
                {/* Note Content */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Received Note:
                    </h3>
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed bg-gray-50 p-3 rounded-md border-l-4 border-blue-400">
                      {sharedNote.text}
                    </p>
                  </div>

                  {/* Share Details */}
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        📧 Shared from:
                      </span>
                      <span className="text-blue-600 font-medium">
                        {sharedNote.sharedFrom}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        📅 Received on:
                      </span>
                      <span>
                        {new Date(sharedNote.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteSharedNote(sharedNote._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-md shadow-sm text-center text-gray-500 w-[300px] sm:w-[500px] md:w-[600px]">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No shared notes yet
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't received any shared notes yet.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleShareNewNote}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                Go to My Notes
              </button>
              <div className="text-xs text-gray-400 mt-2">
                Ask someone to share a note with you, or share your notes with
                others
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AllSharedNotes;
