import React, { useState } from "react";
import "./main.css";
import logo from "../../assets/logo.png";

const Main = () => {
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [captionGenerated, setCaptionGenerated] = useState(false); // Track if a caption has been generated

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImageSrc(null);
    }
  };

  const handleSampleImageClick = () => {
    setSelectedImageSrc(logo);
  };

  const handleCaptionChange = (event) => {
    setImageCaption(event.target.value);
  };

  const handleGenerateCaption = () => {
    const generatedCaption = "This is a sample caption."; // Replace with actual generated caption
    setImageCaption(generatedCaption);
    setCaptionGenerated(true);

    const data = {
      caption: generatedCaption,
    };

    const Backend_url =
      process.env.REACT_APP_BACKEND_PORT || "http://localhost:8080";
    fetch(`${Backend_url}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type as JSON
      },
      body: JSON.stringify(data), // Convert the data to JSON format
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Handle a successful response here if needed
      })
      .catch((error) => {
        console.error("There was a problem with the POST request:", error);
      });
  };

  return (
    <>
      <h1>➡️ Image Caption ⬅️</h1>
      <div className="image-section">
        <h5>Made by: Harsh Jaiswal</h5>
        <div className="image-caption-container">
          <div className="image">
            <label htmlFor="imageInput" className="custom-file-upload">
              {selectedImageSrc ? (
                <img
                  id="selectedImage"
                  src={selectedImageSrc}
                  alt="Selected Image"
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                />
              ) : (
                <>
                  <div className="placeholder" onClick={handleSampleImageClick}>
                    <span>
                      <span className="browse">Browse</span> your Image from
                      file
                    </span>
                  </div>
                </>
              )}
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                capture="camera"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          {selectedImageSrc && (
            <div className="caption">
              <textarea
                name="captions"
                id="reading-captions"
                cols="30"
                rows="10"
                value={imageCaption}
                onChange={handleCaptionChange}
                readOnly={captionGenerated} // Make the textarea read-only if a caption is generated
              ></textarea>
            </div>
          )}
        </div>
        <div className="btns">
          <button type="button" onClick={handleGenerateCaption}>
            Generate Captions!
          </button>
        </div>
      </div>
      <h1>▶️ Sample Example ◀️</h1>
      <div className="sample">
        <img src={logo} alt="" onClick={handleSampleImageClick} />
        <img src={logo} alt="" onClick={handleSampleImageClick} />
        <img src={logo} alt="" onClick={handleSampleImageClick} />
      </div>
    </>
  );
};

export default Main;
