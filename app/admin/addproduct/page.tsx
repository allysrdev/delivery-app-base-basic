"use client"
import { useState } from "react";
import { database } from '../../../services/firebase' ; 
import { ref as dbRef, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import CloudinaryUploadWidget from "@/components/CloudinaryUploadWidget";
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [publicId, setPublicId] = useState('');

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price) {
      alert("Preencha todos os campos!");
      return;
    }

    setUploading(true);
    const productId = uuidv4(); // Gera um ID único para o produto
    try {
      
      const imageUrl = publicId ? cld.image(publicId).toURL() : "";
      console.log("URL DA IMAGEM "  + imageUrl);

      // 4️⃣ Salva os dados no Realtime Database
      await set(dbRef(database, `products/${productId}`), {
        name: name,
        description: description,
        price: price,
        imageUrl: imageUrl,
      });

      alert("✅ Produto adicionado com sucesso!");
      
      // Resetando o formulário
      setName("");
      setDescription("");
      setPrice(0);
      setImage(null);
    } catch (error) {
      console.error("❌ Erro ao adicionar o produto:", error);
      alert("Erro ao adicionar o produto!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto border rounded-lg shadow-lg">
      <h2 className="text-lg font-bold">Adicionar Produto</h2>
      
      <input 
        type="text" 
        placeholder="Nome do produto" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="p-2 border rounded"
        required
      />

      <textarea 
        placeholder="Descrição do produto" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="p-2 border rounded"
        required
      />

      <input 
        type="number" 
        placeholder="Preço (R$)" 
        value={price} 
        onChange={(e) => setPrice(Number(e.target.value))} 
        className="p-2 border rounded"
        required
      />

      {publicId && (
        <div
          className="image-preview"
          style={{ width: '150px', margin: '20px auto' }}
        >
          <AdvancedImage
            style={{ maxWidth: '100%' }}
            cldImg={cld.image(publicId)}
            plugins={[responsive(), placeholder()]}
          />
        </div>
      )}

      <CloudinaryUploadWidget
        uwConfig={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
          cropping: true,
          maxImageFileSize: 1500000,
        }}
        setPublicId={setPublicId}
      />
      

      <button 
        type="submit" 
        className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        disabled={uploading}
      >
        {uploading ? "Enviando..." : "Adicionar Produto"}
      </button>


    </form>
  );
};

export default AddProduct;
