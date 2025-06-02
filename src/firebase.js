/*// Importa funções necessárias do SDK do Firebase para inicializar o app e usar Firestore, Auth e Storage
import { initializeApp } from "firebase/app"; // Inicializa o Firebase
import { getFirestore } from "firebase/firestore"; // Firestore: banco de dados em tempo real
import { getAuth } from "firebase/auth"; // Auth: autenticação de usuários
import { getStorage } from "firebase/storage"; // Storage: armazenamento de arquivos

// Objeto de configuração do Firebase (fornecido no console do Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyB--O59KZ3w7F92whDPl3QlGeujtQy1VI4", // Chave da API
  authDomain: "clone-instagram-d87f1.firebaseapp.com", // Domínio de autenticação
  projectId: "clone-instagram-d87f1", // ID do projeto no Firebase
  storageBucket: "clone-instagram-d87f1.appspot.com", // Bucket do Storage
  messagingSenderId: "1051080090276", // ID do remetente de mensagens
  appId: "1:1051080090276:web:74ae00b87e4b17070d7b3b", // ID do aplicativo
  measurementId: "G-QW93JPWL7B" // ID de medição (Analytics, se usado)
};

// Inicializa o app Firebase com as configurações acima
const app = initializeApp(firebaseConfig);

// Exporta os serviços que serão usados em outras partes do app
const db = getFirestore(app); // banco de dados Firestore
const auth = getAuth(app); // serviço de autenticação
const storage = getStorage(app); // serviço de armazenamento

// Exporta os objetos para serem importados em outros arquivos (como Header.js e Post.js)
export { db, auth, storage };*/

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBo_NNzOb6r873HsfVPahND4hSAXmUlfDY",
  authDomain: "instagram-curso-dankicodejs.firebaseapp.com",
  projectId: "instagram-curso-dankicodejs",
  storageBucket: "instagram-curso-dankicodejs.appspot.com",
  messagingSenderId: "352875492062",
  appId: "1:352875492062:web:90e6822433cd212799084f",
  measurementId: "G-M6K36BW820"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { db, auth, storage, functions };
