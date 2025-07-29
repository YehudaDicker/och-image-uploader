"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mobileCaptureRef = useRef(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    // **CLOSE THE WEBCAM IF A FILE IS SELECTED**
    if (isCameraOpen) {
      closeCamera();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload or take a photo!");
    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("message", message);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      alert("Email sent successfully!");
      setFile(null);
      setEmail("");
      setMessage("");
      setPreview(null);
      setEmailError("");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const openCamera = async () => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      mobileCaptureRef.current.click();
    } else {
      setIsCameraOpen(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Camera access denied:", error);
        alert("Could not access the camera.");
      }
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const photoFile = new File([blob], "photo.png", { type: "image/png" });
        setFile(photoFile);
        setPreview(URL.createObjectURL(blob));
        closeCamera();
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/ochLogo.png"
            alt="OmniChannel Health"
            width={50}
            height={50}
            className="mr-3"
          />
          <h1 className="text-2xl font-bold">Upload Screenshot</h1>
        </div>

        <form onSubmit={handleUpload} className="flex flex-col items-center">
          {/* EMAIL INPUT */}
          <input
            type="text"
            placeholder="Enter your email"
            className="w-full p-2 mb-2 border rounded text-black placeholder-gray-400"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          {/* MESSAGE BOX */}
          <textarea
            placeholder="Add an optional message"
            className="w-full p-2 mb-2 border rounded resize-none text-black placeholder-gray-400"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* File Upload & Take Photo Section */}
          <div className="w-full flex items-center gap-4 mt-2">
            {/* Upload Photo Input */}
            <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50">
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
                  className="w-full max-h-20 object-cover rounded-md mb-2"
                />
              ) : (
                <p className="text-gray-400 text-center">Upload Photo</p>
              )}
            </label>

            {/* Take Photo Button */}
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              onClick={openCamera}
            >
              Take a Photo
            </button>

            {/* Hidden File Input for Mobile Camera Capture */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={mobileCaptureRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Camera Capture for Desktop */}
          {isCameraOpen && (
            <div className="mt-4 flex flex-col items-center">
              <video
                ref={videoRef}
                autoPlay
                className="w-full max-h-40 border rounded-md"
              ></video>
              <canvas
                ref={canvasRef}
                className="hidden"
                width={640}
                height={480}
              ></canvas>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={takePhoto}
              >
                Capture Photo
              </button>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={closeCamera}
              >
                Cancel
              </button>
            </div>
          )}

          {/* SEND BUTTON */}
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
