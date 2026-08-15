// import { useState } from "react";
// import { predictImage } from "../services/api";

// function ImageUploader({ onPrediction }) {
//   const [preview, setPreview] = useState(null);

//   const handleFile = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setPreview(URL.createObjectURL(file));

//     const result = await predictImage(file);
//     onPrediction(result);
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleFile} />

//       {preview && (
//         <img
//           src={preview}
//           alt="preview"
//           style={{ width: "300px", marginTop: "10px" }}
//         />
//       )}
//     </div>
//   );
// }

// export default ImageUploader;

// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function ImageUploader() {
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();

//   const sendImage = async () => {
//     const form = new FormData();
//     form.append("image", image);

//     const res = await axios.post("http://127.0.0.1:5000/api/predict", form, {
//       headers: { "Content-Type": "multipart/form-data" }
//     });

//     navigate("/result", { state: res.data });
//   };

//   return (
//     <div>
//       <input 
//         type="file"
//         accept="image/*"
//         onChange={(e) => setImage(e.target.files[0])}
//       />

//       <button onClick={sendImage}>Detect</button>
//     </div>
//   );
// }


// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function ImageUploader() {
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();

//   const sendImage = async () => {
//     if (!image) {
//       alert("Please upload an image first!");
//       return;
//     }

//     const form = new FormData();
//     form.append("image", image);

//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:5000/api/predict",
//         form,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       console.log("BACKEND RESPONSE:", res.data);

//       navigate("/result", { state: res.data });

//     } catch (err) {
//       console.error("UPLOAD ERROR:", err);
//       alert("Prediction failed. Check backend console.");
//     }
//   };

//   return (
//     <div>
//       <h1>Upload Road Image</h1>

//       <input 
//         type="file"
//         accept="image/*"
//         onChange={(e) => setImage(e.target.files[0])}
//       />

//       <button onClick={sendImage}>Detect</button>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../services/config";

export default function ImageUploader({ exampleFile, onPrediction }) {
  const [image, setImage] = useState(exampleFile?.file || null);
  const [previewUrl, setPreviewUrl] = useState(exampleFile?.url || "");
  const [previewIsObjectUrl, setPreviewIsObjectUrl] = useState(false);
  const [expectedClass, setExpectedClass] = useState(exampleFile?.expectedClass || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => () => {
    if (previewIsObjectUrl && previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewIsObjectUrl, previewUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setError("");

    if (previewIsObjectUrl && previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setImage(null);
      setPreviewUrl("");
      setExpectedClass("");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImage(null);
      setPreviewUrl("");
      setExpectedClass("");
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    setImage(file);
    setExpectedClass("");
    setPreviewIsObjectUrl(true);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const replaceImage = () => document.getElementById("road-image")?.click();

  const sendImage = async () => {
    if (!image) {
      setError("Choose an image before starting detection.");
      return;
    }

    const form = new FormData();
    form.append("image", image);
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/predict`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Prediction Response:", res.data);

      onPrediction?.({
        ...res.data,
        imagePreview: previewUrl,
        previewIsObjectUrl,
        expectedClass,
      });
    } catch (err) {
      console.error("Error sending image:", err);

      if (err.response) {
        setError(err.response.data.error || "The backend could not analyze this image.");
      } else {
        setError("Cannot reach the Flask backend. Start it and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSelection = () => {
    if (previewIsObjectUrl && previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(null);
    setPreviewUrl("");
    setPreviewIsObjectUrl(false);
    setExpectedClass("");
    setError("");
  };

  return (
    <div className="uploader-content">
      <div className="uploader-icon" aria-hidden="true">⌁</div>
      <h2>Choose a road image</h2>
      <p className="uploader-copy">Use a clear image with the road issue visible. The model predicts one of seven categories.</p>

      <input
        id="road-image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
      />
      <label className="file-picker" htmlFor="road-image">Browse image files</label>
      <p className="input-hint">Supported: JPG / JPEG, PNG, WebP</p>

      {previewUrl && <div className="image-preview-wrap"><img className="image-preview" src={previewUrl} alt={expectedClass ? `${expectedClass} selected example` : "Selected road image preview"} /><div className="preview-actions"><button type="button" className="text-button" onClick={replaceImage}>Change image</button><button type="button" className="text-button" onClick={clearSelection}>Remove</button></div></div>}
      {image && <p className="selected-file"><span aria-hidden="true">✓</span> {image.name}</p>}
      {expectedClass && <p className="status-message status-success">Example selected and ready for the real detector. Expected result: {expectedClass}.</p>}

      <button className="button button-primary action-button" onClick={sendImage} disabled={isSubmitting}>
        {isSubmitting ? "Analyzing image…" : "Run detection →"}
      </button>

      {error && <p className="status-message status-error" role="alert">{error}</p>}

      <div className="sample-source">
        <span>Want to try the documented pothole sample?</span>
        <a href="https://www.kaggle.com/datasets/programmerrdai/road-issues-detection-dataset" target="_blank" rel="noreferrer">Get a permitted copy from the dataset source ↗</a>
        <small>The original archive image is not redistributed because its license is unclear. The backend owns the curated examples and links to the permitted dataset source.</small>
      </div>
    </div>
  );
}
