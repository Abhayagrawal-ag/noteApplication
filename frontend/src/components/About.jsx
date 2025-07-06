

import React from 'react';
import myPhoto from "../images/abhaynew-image.jpg"

function About() {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Notes App</h1>
            </div>
            <button 
              onClick={goBack} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet the Developer</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Passionate about creating tools that make life easier</p>
        </div>

        {/* Developer Card */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg">
                <img 
                  src={myPhoto}
                  // alt="Abhay Agrawal" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Abhay Agrawal</h3>
              <p className="text-xl text-blue-600 mb-6">Founder & Developer</p>
              
              <div className="text-gray-700 mb-8">
                <p className="leading-relaxed text-lg">
                  I'm Abhay, a passionate final-year MCA student at Maulana  Azad National Institute of Technology,Bhopal. 
                  I built this Notes App to address the daily challenges that people face when organizing their thoughts and ideas. 
                  My mission is to make note-taking more accessible, productive, and stress-free for every user.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Add Notes</h4>
            <p className="text-gray-600 text-sm">Create new notes quickly and easily</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Edit Notes</h4>
            <p className="text-gray-600 text-sm">Modify your notes anytime</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Share Notes</h4>
            <p className="text-gray-600 text-sm">Share your thoughts with others</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Delete Notes</h4>
            <p className="text-gray-600 text-sm">Remove notes you no longer need</p>
          </div>
        </div>

        {/* View Notes Feature */}
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-lg border border-gray-200 mb-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">View & Organize</h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Browse through all your notes with an intuitive interface. View, search, and organize your thoughts effortlessly.
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-lg border border-gray-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            To create a seamless note-taking experience that adapts to your workflow. Whether you're a student, professional, 
            or creative thinker, our app is designed to capture your ideas effortlessly and help you stay organized across all your devices.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Made with ❤️ by Abhay Agrawal</p>
            <p className="text-gray-400 text-sm">© 2024 Notes App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;