import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userEmail = localStorage.getItem("email");
        const response = await axios.get(
          "https://noteapplication-backend.onrender.com/notes",
          { params: { email: userEmail } }
        );
        setNotes(response.data);
        setFilteredNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  // Filter notes based on search date
  useEffect(() => {
    if (searchDate) {
      const filtered = notes.filter((note) => {
        if (note.createdAt) {
          const noteDate = new Date(note.createdAt).toDateString();
          const searchDateObj = new Date(searchDate).toDateString();
          return noteDate === searchDateObj;
        }
        return false;
      });
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchDate, notes]);

  const deleteNote = async (id) => {
    try {
      const userEmail = localStorage.getItem("email");
      await axios.delete(
        `https://noteapplication-backend.onrender.com/notes/${id}`,
        { params: { email: userEmail } }
      );
      const updatedNotes = notes.filter((note) => note._id !== id);
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditText(note.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    try {
      const userEmail = localStorage.getItem("email");
      const response = await axios.put(
        `https://noteapplication-backend.onrender.com/notes/${id}`,
        {
          text: editText,
          email: userEmail,
        }
      );

      // Update the notes array with the edited note
      const updatedNotes = notes.map((note) =>
        note._id === id ? { ...note, text: editText } : note
      );
      setNotes(updatedNotes);

      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const shareNote = (noteId) => {
    navigate(`/sharenotes?noteId=${noteId}`);
  };

  const clearSearch = () => {
    setSearchDate("");
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const setTodayDate = () => {
    const today = new Date();
    setSearchDate(formatDateForInput(today));
  };
  const handleViewSharedNotes = () => {
    navigate("/allsharenote");
  };
  const handleViewSentNotes = () => {
    navigate("/sentnotes");
  };

  return (
    <>
      <div
        style={{ background: "#3366FF" }}
        className="w-full text-2xl font-bold text-center p-4 text-white"
      >
        All Notes here...
      </div>

      {/* Search Section */}
      <div className="w-full bg-white p-4 shadow-sm border-b">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 flex flex-col sm:flex-row gap-2 items-center">
            <label
              htmlFor="dateSearch"
              className="text-gray-700 font-medium whitespace-nowrap"
            >
              Search by Date:
            </label>
            {/* ✅ CHANGED: Added pseudo-element for placeholder text */}
            <div className="relative">
              <input
                id="dateSearch"
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px] text-center"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                  appearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-calendar'%3e%3crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3e%3c/rect%3e%3cline x1='16' y1='2' x2='16' y2='6'%3e%3c/line%3e%3cline x1='8' y1='2' x2='8' y2='6'%3e%3c/line%3e%3cline x1='3' y1='10' x2='21' y2='10'%3e%3c/line%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "20px",
                  paddingRight: "40px",
                  color: searchDate ? "#000" : "transparent",
                }}
              />
              {!searchDate && (
                <div
                  className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none"
                  style={{ paddingRight: "40px" }}
                >
                  mm/dd/yyyy
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
            <button
              onClick={handleViewSharedNotes}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              View Received Notes
            </button>
             <button
              onClick={handleViewSentNotes}
              className="px-4 py-2  text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              View Sent Notes
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchDate && (
          <div className="max-w-4xl mx-auto mt-3 text-sm text-gray-600">
            {filteredNotes.length > 0 ? (
              <p>
                Found {filteredNotes.length} note(s) for{" "}
                {new Date(searchDate).toLocaleDateString()}
              </p>
            ) : (
              <p>
                No notes found for {new Date(searchDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col items-center bg-gray-100 gap-1 py-8">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className="bg-white p-4 m-4 rounded-md w-[300px] sm:w-[500px] md:w-[600px] shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex flex-col justify-start flex-1 mr-0 sm:mr-4 mb-4 sm:mb-0">
                  {editingId === note._id ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  ) : (
                    <p className="text-black font-bold">{note.text}</p>
                  )}
                  <p className="text-blue-500 text-sm mt-2">
                    Created at:{" "}
                    {note.createdAt
                      ? new Date(note.createdAt).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {editingId === note._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(note._id)}
                        style={{ background: "#28a745" }}
                        className="text-white p-2 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        SAVE
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{ background: "#6c757d" }}
                        className="text-white p-2 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        CANCEL
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(note)}
                        style={{ background: "#ffc107" }}
                        className="text-white p-2 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => shareNote(note._id)}
                        style={{ background: "#17a2b8" }}
                        className="text-white p-2 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="Share Note"
                      >
                        SHARE
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        style={{ background: "#FF0000" }}
                        className="text-white p-2 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        DELETE
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-md shadow-sm text-center text-gray-500">
            {searchDate
              ? "No notes found for the selected date."
              : "No notes available."}
          </div>
        )}
      </div>
    </>
  );
}

export default NotesList;
