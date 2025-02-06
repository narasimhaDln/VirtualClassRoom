import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div>
      <h2>📂 Share Document</h2>
      <input type="file" onChange={handleFileChange} />
      {file && <p>Selected File: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
