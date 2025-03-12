import { ref, set, get, getDatabase, query, orderByChild, startAt, endAt} from 'firebase/database';
import { database } from './firebase';


// Função para adicionar um novo produto
export const addProduct = (productId: string, name: string, description: string, price: number, imageUrl: string): void => {
  set(ref(database, 'products' + productId), {
    name: name,
    description: description,
    price: price,
    imagemUrl: imageUrl,
    name_lowercase: name.toLowerCase(),
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


export const getProductsBySearch = async (searchTerm: string) => {

  try {
      // Crie uma referência para o nó '/products'
      const productsRef = ref(database, "/products");

      // Para uma busca simples por nome, supondo que cada produto tenha o campo "name".
      // Atenção: o Firebase Realtime Database suporta queries simples. Se precisar de busca por parte do texto, avalie a estratégia.
      const productsQuery = query(
        productsRef,
        orderByChild("name_lowercase"),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff")
      );

      const snapshot = await get(productsQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Converta o objeto retornado em um array
        const productsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        return(productsArray);
      } else {
        return([]);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
    }
};


