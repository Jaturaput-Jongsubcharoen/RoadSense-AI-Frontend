// ORIGINAL CODE WORKING
// import { useState } from "react";
// import ImageUploader from "../components/ImageUploader";

// export default function Detect() {
//   return (
//     <div>
//       <ImageUploader />
//     </div>
//   );
// }

import ImageUploader from "../components/ImageUploader";

export default function Detect() {
  return (
    <div className="page-center">
      <div className="card">
      <ImageUploader />
    </div>
    </div>
  );
}
