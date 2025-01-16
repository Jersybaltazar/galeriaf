"use client";

import React, { useState } from "react";

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor selecciona una imagen para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setIsUploading(true);
    try {
      const response = await fetch("http://localhost:5000/api/images/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen.");
      }

      const data = await response.json();
      setUploadResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al subir la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Cargar Imagen</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={isUploading}
        style={{
          marginLeft: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isUploading ? "Subiendo..." : "Subir"}
      </button>
      {uploadResponse && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Respuesta del servidor:</h2>
          <pre>{uploadResponse}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
