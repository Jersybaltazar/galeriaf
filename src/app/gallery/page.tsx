"use client";
import React, { useEffect, useState } from "react";
import { Trash2, PenLine, X, Loader2 } from "lucide-react";
import Image from "next/image";

type ImageType = {
  id: string;
  url: string;
  fullId: string;
};
const GalleryPage = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/images/");
        if (!response.ok) throw new Error("Error al obtener las imágenes.");        
        const data = await response.json();
        setImages(
          data.map((img: any) => ({
            id: img.public_id.replace('crud-images/', ''),
            url: img.secure_url,
            fullId: img.public_id
          }))
        );
      } catch (error) {
        console.error(error);
        alert("Hubo un problema al cargar las imágenes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (id: string) => {
    console.log("ID enviado para eliminar:", id);
    if (window.confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/images/${id}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log("Respuesta del servidor al eliminar:", response);
        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message;
          } catch (e) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }
  
        // Actualiza el estado solo si la eliminación fue exitosa
        setImages((prevImages) => prevImages.filter((img) => img.id !== id));
        alert("Imagen eliminada exitosamente");
        
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert(error instanceof Error ? error.message : "Error al eliminar la imagen");
      }
    }
  };

  const handleUpdate = async (id: string) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
  
    fileInput.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
  
      try {
        // Elimina el prefijo 'crud-images/' si existe
        const cleanId = id.replace('crud-images/', '');
        console.log("Actualizando imagen con ID:", cleanId);
  
        const formData = new FormData();
        formData.append("image", file);
  
        const response = await fetch(`http://localhost:5000/api/images/${cleanId}`, {
          method: "PUT",
          body: formData
        });
  
        console.log("Respuesta del servidor:", response);
  
        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message;
          } catch (e) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }
  
        const result = await response.json();
        
        // Actualiza el estado con la nueva URL
        setImages((prevImages) =>
          prevImages.map((img) =>
            img.id === id
              ? {
                  id: result.data.id.replace('crud-images/', ''),
                  url: result.data.url
                }
              : img
          )
        );
  
        alert("Imagen actualizada correctamente");
  
      } catch (error) {
        console.error("Error al actualizar:", error);
        alert(error instanceof Error ? error.message : "Error al actualizar la imagen");
      }
    };
  
    fileInput.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Galería de Imágenes
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image: any) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <Image
                  src={image.url}
                  alt={`Imagen ${image.id}`}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                  width={200}
                  height={200}
                />
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleUpdate(image.id)}
                  className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                  disabled={isUpdating}
                >

                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PenLine className="w-4 h-4" />
                  )}
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
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={selectedImage.url}
              alt="Vista completa"
              className="max-h-full max-w-full object-contain"
              width={500}
              height={500}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
