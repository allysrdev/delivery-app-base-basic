import { ref, set, get, getDatabase } from 'firebase/database';
import { database } from './firebase';


// Função para adicionar um novo produto
export const addProduct = (productId: string, name: string, description: string, price: number, imageUrl: string): void => {
  set(ref(database, 'products' + productId), {
    name: name,
    description: description,
    price: price,
    imagemUrl: imageUrl,
  });
};

// Função para obter todos os produtos
export const getProducts = async () => {
  const db = getDatabase();
  const productsRef = ref(db, "products");

  try {
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        id: key, // Pega o ID do Firebase
        ...data[key], // Pega os outros dados do produto
      }));
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};