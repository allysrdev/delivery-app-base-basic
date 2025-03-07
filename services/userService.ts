import { ref, set, get } from 'firebase/database';
import { database } from './firebase'; // Importe a instância já inicializada

export const addUser = async (
  userId: string,
  email: string,
  address: string,
  telephone: string,
  profileImage: string
): Promise<void> => {
  const userRef = ref(database, `users/${userId}`); // Use a instância importada

  try {
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      throw new Error('Usuário já existe!');
    }

    await set(userRef, {
      email,
      address,
      telephone,
      profileImage,
      created_at: new Date().toISOString()
    });

    console.log('Usuário cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw new Error(`Falha ao criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};