"use client"
import { useState, useEffect } from "react";
import { database } from '../../../../services/firebase';
import { ref as dbRef, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import CloudinaryUploadWidget from "@/components/CloudinaryUploadWidget";
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import { Input } from "@/components/ui/input";
import Box from "@/components/ui/box";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LucidePencil, LucideTrash } from "lucide-react";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Product } from "@/components/ProductCard";
import { getProducts, updateProduct, deleteProduct } from "@/services/productService";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<Product[]>();
  const [publicId, setPublicId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Estado para o produto selecionado
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Controle do Alert de exclusão
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const router = useRouter()

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price);
    setPublicId(product.imageUrl);
    setCategory(product.category || 'Outros')
    router.refresh();
  };

  const handleDelete = (productId: string) => {
    setIsAlertOpen(true);
    setProductToDelete(productId);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        setProducts((prevProducts) => prevProducts?.filter((product) => product.id !== productToDelete));
        alert("Produto excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir o produto:", error);
        alert("Erro ao excluir o produto!");
      } finally {
        setIsAlertOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price) {
      alert("Preencha todos os campos!");
      return;
    }

    setUploading(true);
    const productId = selectedProduct ? selectedProduct.id : uuidv4(); // Usar o ID existente para editar ou novo para adicionar
    try {
      const imageUrl = publicId ? cld.image(publicId).toURL() : "";
      console.log("URL DA IMAGEM " + imageUrl);
      

      // Atualiza ou adiciona o produto
      if (selectedProduct) {
        // Atualizar o produto existente
        await updateProduct(productId, name, description, price, imageUrl);
        alert("✅ Produto atualizado com sucesso!");
      } else {
        // Adicionar um novo produto
        await set(dbRef(database, `products/${productId}`), {
          name: name,
          description: description,
          price: price,
          imageUrl: imageUrl,
          category: category
        });
        alert("✅ Produto adicionado com sucesso!");
      }

      // Resetando o formulário
      setName("");
      setDescription("");
      setPrice(0);
      setSelectedProduct(null);
    } catch (error) {
      console.error("❌ Erro ao salvar o produto:", error);
      alert("Erro ao salvar o produto!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col justify-center gap-4">
      <Box>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 sm:min-w-md w-72 mx-auto rounded-lg shadow-lg pb-16">
          <h2 className="text-lg font-bold">{selectedProduct ? "Editar Produto" : "Adicionar Produto"}</h2>
          <label htmlFor="productName">Nome do Produto</label>
          <Input 
            name="productName" 
            type="text" 
            placeholder="Nome do produto" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />
          <label htmlFor="productName">Categoria</label>
           <Input 
            name="category" 
            type="text" 
            placeholder="Categoria" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />

          <label htmlFor="description">Descrição</label>
          <textarea 
            name="description" 
            placeholder="Descrição do produto" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="p-2 border rounded" 
            required 
          />

          <label htmlFor="value">Preço</label>
          <Input 
            name="value" 
            type="number" 
            placeholder="Preço (R$)" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))} 
            className="p-2 border rounded" 
            required 
          />

          {publicId && (
            <div className="image-preview" style={{ width: '150px', margin: '20px auto' }}>
              <AdvancedImage
                style={{ maxWidth: '100%' }}
                cldImg={cld.image(publicId)}
                plugins={[responsive(), placeholder()]}
              />
            </div>
          )}

          <label>Imagem do Produto</label>
          <CloudinaryUploadWidget
            uwConfig={{
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
              uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
              cropping: true,
            }}
            setPublicId={setPublicId}
          />

          <button type="submit" className="p-2 bg-black border border-white text-white rounded disabled:bg-gray-400" disabled={uploading}>
            {uploading ? "Enviando..." : selectedProduct ? "Atualizar Produto" : "Adicionar Produto"}
          </button>
        </form>
      </Box>

      <div className="max-w-lg">
        <Table className="w-lg">
          <TableHeader>
            <TableRow className="text-white">
              <TableHead className="w-[100px]">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Editar</TableHead>
              <TableHead className="text-right">Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image width={50} height={50} alt="imagem do produto" src={product.imageUrl} />
                </TableCell>
                <TableCell className="max-w-32 whitespace-normal break-words">{product.name}</TableCell>
                <TableCell className="max-w-32 whitespace-normal break-words">{product.description}</TableCell>
                <TableCell className="text-right">
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="bg-black" onClick={() => handleEdit(product)}>
                    <LucidePencil />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="bg-black" onClick={() => handleDelete(product.id)}>
                    <LucideTrash size={25} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmar Exclusão */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir este produto?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddProduct;
