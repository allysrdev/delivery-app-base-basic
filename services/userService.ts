import { ref, set, get } from 'firebase/database';
import { database } from './firebase'; // Importe a instância já inicializada

export interface User {
  name: string;
  userId: string;
  email: string;
  address: string;
  telephone: string;
  profileImage: string;
}

export const addUser = async ({ userId, name, email, address, telephone, profileImage }: User): Promise<void> => {
  const userRef = ref(database, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      throw new Error('Usuário já existe!');
    }

    await set(userRef, {
      email,
      name,
      address,
      telephone,
      profileImage,
      created_at: new Date().toISOString(),
    });

    console.log('Usuário cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw new Error(`Falha ao criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

export const getUser = async (email: string): Promise<User | null> => {
  const usersRef = ref(database, 'users');

  try {
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      console.log('Nenhum usuário encontrado!');
      return null;
    }

    // Percorre os usuários e encontra o que tem o e-mail correspondente
    let userData: User | null = null;
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      if (user.email === email) {
        userData = { userId: childSnapshot.key, ...user };
      }
    });

    if (!userData) {
      console.log('Usuário não encontrado!');
    }

    return userData;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null; // Retorno explícito para evitar `undefined`
  }
};
