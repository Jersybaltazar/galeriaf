"use client";

import React from "react";

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>CRUD de Imágenes</h1>
      <p>Bienvenido al sistema para subir y visualizar imágenes con Cloudinary.</p>
      
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
      </div>
    </div>
  );
};

export default HomePage;
