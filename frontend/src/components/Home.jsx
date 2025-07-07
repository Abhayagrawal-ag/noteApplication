// import React from 'react';
// import axios from 'axios';
// import {toast} from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// function Home() {
//   const navigate = useNavigate();
//   const [text, setText] = React.useState('');
//   const handleAddNote = async () => {
//      if (!text.trim()){
//       return toast.error('Error: Please enter a note',{
//         autoClose: 1500,
//       });
//     }
//      try {
//       const userEmail = localStorage.getItem('email');
// const response = await axios.post('https://noteapplication-backend.onrender.com/notes', { text,userEmail });
//       toast.success('Note added successfully', {
//         autoClose: 1500,
//       });
//       setText('');
//     } catch (error) {
//       console.error('Error adding note:', error);
//     }
//   }
//   const changeRoute = () => {
//     navigate('/notes');
//   }
//   return (
//     <div style={{background: '#F9FAFB'}} className="min-h-screen w-full flex flex-col items-center justify-start p-4">
//       <h1 style={{background:'#3366FF'}} className="  w-screen text-center text-white text-2xl sm:text-4xl md:text-3xl font-semibold p-2 rounded-md">Notepad</h1>
//       <div className='flex flex-col items-center gap-9 mt-4'>
//         <textarea value={text}
//         onChange={(e) => setText(e.target.value)} style={{background: '#FFFFFF'}}
//         className=" h-[170px] w-[260px] sm:h-[250px] sm:w-[250px] md:h-[230px] md:w-[500px] text-xl pt-2 pl-2 sm:text-2xl md:text-3xl rounded-md shadow-md  mt-0 resize-none placeholder:text-xl sm:placeholder:text-3xl md:placeholder:text-xl placeholder:font-bold "
//         placeholder="Write a note..."
//        ></textarea>
//         <button onClick={handleAddNote} style={{background :'#3366FF'}} className=" text-white outline outline-offset-2 h-[40px] w-[120px]  font-bold rounded-md" >Add Note</button>
//         <button onClick={changeRoute} className=" mt-22 outline outline-offset-2 bg-white h-[40px] w-[140px] font-bold rounded-md text-black">View Notes</button>
//       </div>
//     </div>
//   );
// }
// export default Home

import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [text, setText] = React.useState("");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleAddNote = async () => {
    if (!text.trim()) {
      return toast.error("Error: Please enter a note", {
        autoClose: 1500,
      });
    }

    try {
      const userEmail = localStorage.getItem("email");
      const response = await axios.post(
        "https://noteapplication-backend.onrender.com/notes",
        { text, userEmail }
      );
      // const response = await axios.post('https://noteapplication-backend.onrender.com/notes', { text, userEmail });
      toast.success("Note added successfully", {
        autoClose: 1500,
      });
      setText("");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note", {
        autoClose: 1500,
      });
    }
  };

  const changeRoute = () => {
    navigate("/notes");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const userEmail = localStorage.getItem("email");

      if (!userEmail) {
        toast.error("User email not found", {
          autoClose: 1500,
        });
        setIsDeleting(false);
        return;
      }

      console.log("Attempting to delete account for email:", userEmail);

      // API call to delete user account and all notes
      // Route is under /auth prefix as per your index.js
      const response = await axios.delete(
        `https://noteapplication-backend.onrender.com/auth/user/${encodeURIComponent(
          userEmail
        )}`
      );
      // const response = await axios.delete(`https://noteapplication-backend.onrender.com/auth/user/${encodeURIComponent(userEmail)}`);

      console.log("Delete response:", response.data);

      if (response.status === 200) {
        toast.success("Account deleted successfully", {
          autoClose: 1500,
        });

        // Clear localStorage
        localStorage.removeItem("email");

        // Redirect to login page after a short delay
        // setTimeout(() => {
        navigate("/");
        // }, 1500);
      }
    } catch (error) {
      console.error("Error deleting account:", error);

      // More detailed error logging
      if (error.response) {
        // Server responded with error status
        console.error("Server error response:", error.response.data);
        console.error("Status code:", error.response.status);

        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Server error occurred";

        toast.error(`Failed to delete account: ${errorMessage}`, {
          autoClose: 3000,
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network error - no response received:", error.request);
        toast.error("Network error. Please check your connection.", {
          autoClose: 3000,
        });
      } else {
        // Something else happened
        console.error("Request setup error:", error.message);
        toast.error("Failed to delete account. Please try again.", {
          autoClose: 3000,
        });
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div
      style={{ background: "#F9FAFB" }}
      className="min-h-screen w-full flex flex-col items-center justify-start p-4"
    >
      <div className="w-full">
        <h1
          style={{ background: "#3366FF" }}
          className="text-center text-white text-2xl sm:text-4xl md:text-3xl font-semibold p-2 rounded-md"
        >
          Notepad
        </h1>
      </div>

      <div className="flex flex-col items-center gap-9 mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ background: "#FFFFFF" }}
          className="h-[170px] w-[260px] sm:h-[250px] sm:w-[250px] md:h-[230px] md:w-[500px] text-xl pt-2 pl-2 sm:text-2xl md:text-3xl rounded-md shadow-md mt-0 resize-none placeholder:text-xl sm:placeholder:text-xl md:placeholder:text-2xl placeholder:font-bold"
          placeholder="Write a note..."
        ></textarea>

        <button
          onClick={handleAddNote}
          style={{ background: "#3366FF" }}
          className="text-white outline outline-offset-2 h-[40px] w-[120px] font-bold rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Note
        </button>

        <button
          onClick={changeRoute}
          className="outline outline-offset-2 bg-white h-[40px] w-[140px] font-bold rounded-md text-black hover:bg-gray-50 transition-colors"
        >
          View Notes
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white h-[40px] w-[140px] font-bold rounded-md transition-colors"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Delete Account
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete your account? This action will
              permanently delete:
            </p>
            <ul className="text-gray-600 mb-6 list-disc list-inside">
              <li>Your account</li>
              <li>All your notes</li>
              <li>All your data</li>
            </ul>
            <p className="text-sm text-red-500 mb-6 font-medium">
              This action cannot be undone!
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
// export default Home;
