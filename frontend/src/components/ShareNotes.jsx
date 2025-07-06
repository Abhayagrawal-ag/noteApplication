



import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ShareNotes() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [noteData, setNoteData] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const noteId = searchParams.get('noteId');

  useEffect(() => {
    // Fetch note data when component mounts
    const fetchNoteData = async () => {
      if (noteId) {
        try {
          const userEmail = localStorage.getItem('email');
          const response = await axios.get(`http://localhost:3000/auth/notes/${noteId}`, {
            params: { email: userEmail }
          });
          setNoteData(response.data);
        } catch (error) {
          console.error('Error fetching note:', error);
          setMessage("Error loading note data");
          setMessageType("error");
        }
      }
    };
    
    fetchNoteData();
  }, [noteId]);

  const handleShareNote = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage("Please enter an email address");
      setMessageType("error");
      return;
    }

    if (!noteId) {
      setMessage("No note selected to share");
      setMessageType("error");
      return;
    }

    // Check if user is trying to share with themselves
    const senderEmail = localStorage.getItem('email');
    if (email.trim().toLowerCase() === senderEmail.toLowerCase()) {
      setMessage("You cannot share a note with yourself");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post('http://localhost:3000/auth/share-note', {
        noteId: noteId,
        senderEmail: senderEmail,
        recipientEmail: email.trim(),
        noteText: noteData?.text || ""
      });

      if (response.data.success) {
        setMessage("Note shared successfully!");
        setMessageType("success");
        setEmail("");
        // Redirect to AllSharedNotes page after 2 seconds
        setTimeout(() => {
          navigate('/allsharenote');
        }, 2000);
      } else {
        setMessage(response.data.message || "Failed to share note");
        setMessageType("error");
      }
    } catch (error) {
      console.error('Error sharing note:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error sharing note. Please try again.");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToNotes = () => {
    navigate('/notes');
  };

  const handleViewSharedNotes = () => {
    navigate('/allsharenote');
  };

  return (
    <>
      {/* Header */}
      <div style={{background: '#3366FF'}} className="w-full text-2xl font-bold text-center p-4 text-white">
        Share Your Note
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-4 sm:space-y-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Share Note with Friend
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm px-2">
                Enter the email address of a registered user to share your note
              </p>
            </div>

            {/* Note Preview */}
            {noteData && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-md border">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Note to Share:</h3>
                <p className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                  {noteData.text.length > 100 
                    ? `${noteData.text.substring(0, 100)}...` 
                    : noteData.text
                  }
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {noteData.createdAt ? new Date(noteData.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div className={`mb-4 p-3 rounded-md text-xs sm:text-sm ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* Share Form */}
            <form onSubmit={handleShareNote} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Recipient Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 sm:py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter recipient's email"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                >
                  {loading ? 'Sharing...' : 'Share Note'}
                </button>
                
                <button
                  type="button"
                  onClick={handleBackToNotes}
                  className="w-full sm:flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-sm sm:text-base"
                >
                  Back to Notes
                </button>
              </div>
            </form>

            {/* View Shared Notes Button */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleViewSharedNotes}
                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
              >
                View All Received Notes
              </button>
            </div>


          </div>
        </div>
      </div>
    </>
  );
}

export default ShareNotes;