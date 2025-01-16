'use client'
import React, { useEffect, useState } from "react";
import { Trash2, PenLine, X, Loader2 } from "lucide-react";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/images/");
        if (!response.ok) {
          throw new Error("Error al obtener las imágenes.");
        }
        const data = await response.json();
        setImages(data.map((img:any) => ({
            id: img.public_id,  
          url: img.secure_url,
        })));
      } catch (error) {
        console.error(error);
        alert("Hubo un problema al cargar las imágenes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (id:string) => {
    console.log("ID enviado para eliminar:", id);
    if (window.confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/images/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {throw new Error("Error al eliminar la imagen")};
        setImages(images.filter((img : any) => img.id !== id));
      } catch (error) { 
        console.error(error);     
        alert("Error al eliminar la imagen");
      }
    }
  };

  const handleUpdate = async (id:any) => {
    // Aquí implementarías la lógica para actualizar la imagen
    alert("Función de actualización por implementar");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Galería de Imágenes</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image:any) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <img
                  src={image.url}
                  alt={`Imagen ${image.id}`}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
              
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleUpdate(image.id)}
                  className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                >
                  <PenLine className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para vista completa */}
      {selectedImage  && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.url}
              alt="Vista completa"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage; 