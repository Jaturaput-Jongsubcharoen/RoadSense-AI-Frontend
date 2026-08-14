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


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const sendImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const form = new FormData();
    form.append("image", image);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/predict",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Prediction Response:", res.data);

      navigate("/result", { state: res.data });

    } catch (err) {
      console.error("Error sending image:", err);

      if (err.response) {
        alert("Backend error: " + err.response.data.error);
      } else {
        alert("Cannot reach backend. Is Flask running?");
      }
    }
  };

  return (
    <div>
      <h1>Upload Road Image</h1>

      <input
        type="file"
        accept="image/*"
        // onChange={(e) => setImage(e.target.files[0])}
        onChange={(e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setImage(file);
}}

      />

      <button onClick={sendImage}>Detect</button>
    </div>
  );
}
