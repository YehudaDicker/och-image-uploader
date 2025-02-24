"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState(""); // Store user’s email
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !email) {
      alert("Please upload a file and enter your email!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email); // Send user’s email

    console.log("🚀 Sending request to API...");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Response from server:", data);
      alert("Email sent successfully!");

      setFile(null);
      setEmail("");
      setPreview(null);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        {/* Logo + Title Section */}
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/ochLogo.png"
            alt="OmniChannel Health"
            width={160}
            height={160}
            className="mr-3"
          />
          <h1 className="text-2xl font-bold">Upload Screenshot</h1>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-40 object-cover rounded-md mb-2"
              />
            ) : (
              <p className="text-gray-500">Click to select an image</p>
            )}
          </label>

          <button
            type="submit"
            className={`mt-4 px-6 py-2 text-white font-semibold rounded-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
