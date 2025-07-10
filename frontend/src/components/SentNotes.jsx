import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SentNotes() {
  const [sentNotes, setSentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSentNotes();
  }, []);

  const fetchSentNotes = async () => {
    try {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        setError("Please login to view sent notes");
        setLoading(false);
        return;
      }

      console.log("Fetching sent notes for:", userEmail);

      const response = await axios.get(
        `https://noteapplication-backend.onrender.com/auth/sent-notes`,
        {
          params: { senderEmail: userEmail },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        setSentNotes(response.data.sentNotes);
      } else {
        setError(response.data.message || "Failed to fetch sent notes");
      }
    } catch (error) {
      console.error("Error fetching sent notes:", error);
      
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setError(`Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error("Request made but no response received:", error.request);
        setError("Network error. Please check your connection.");
      } else {
        console.error("Error setting up request:", error.message);
        setError("Error loading sent notes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToNotes = () => {
    navigate("/notes");
  };

  const handleShareNewNote = () => {
    navigate("/notes");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <>
        {/* Header */}
        <div
          style={{ background: "#3366FF" }}
          className="w-full text-2xl font-bold text-center p-4 text-white"
        >
          Sent Notes
        </div>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sent notes...</p>
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
        Sent Notes
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Your Sent Notes
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  View all notes you've shared with others
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {/* <button
                  onClick={handleShareNewNote}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                >
                  Share New Note
                </button> */}
                <button
                  onClick={handleBackToNotes}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium"
                >
                  Back to Notes
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Notes Count */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              Total sent notes: <span className="font-semibold">{sentNotes.length}</span>
            </p>
          </div>

          {/* Sent Notes List */}
          {sentNotes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h8a2 2 0 012 2v4M6 13h12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sent notes yet
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't shared any notes with others yet.
              </p>
              <button
                onClick={handleShareNewNote}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                Share Your First Note
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sentNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            Sent to:
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {note.userEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Note Content:
                        </h4>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {truncateText(note.text)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Shared
                      </span>
                      {/* <span className="text-xs text-gray-500">
                        ID: {note.originalNoteId}
                      </span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SentNotes;