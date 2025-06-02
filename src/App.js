// Importa os estilos CSS do app
import './App.css';

// Importa hooks do React
import { useEffect, useState } from 'react';

// Importa funções do Firestore para leitura dos dados
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';

// Importa autenticação e banco de dados configurados no firebase.js
import { auth, db } from './firebase';

// Importa os componentes que compõem a interface
import Header from './Header';
import Post from './Post';





function App() {
  // Estado para guardar o usuário logado (null se ninguém estiver logado)

  const [user, setUser] = useState(null);

  // Estado para armazenar a lista de posts vinda do Firestore
  const [posts, setPosts] = useState([]);

  // useEffect executa uma vez ao carregar o componente
  useEffect(() => {
    // Escuta mudanças no status de autenticação
    const unsubscribeAuth = auth.onAuthStateChanged(val => {
      // Corrigido: era `val = null`, agora é `val ?`
      setUser(val ? val.displayName : null);
    });

    // Cria uma query para buscar os posts ordenados por data (timestamp)
    const q = query(collection(db, 'post'), orderBy('timestamp', 'desc'));

    // Escuta alterações em tempo real nos dados do Firestore
    const unsubscribeSnapshot = onSnapshot(q, snapshot => {
      // Mapeia os documentos para um array com id e info
      setPosts(snapshot.docs.map(document => ({
        id: document.id,
        info: document.data()
      })));
    });

    // Cleanup das escutas quando o componente desmontar
    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  return (
    <div className="App">
      {/* Passa o usuário e função de login para o componente Header */}
      <Header setUser={setUser} user={user} />

      {/* Mapeia os posts e renderiza cada um com o componente Post */}
      {posts.map(post => (
        <Post
          key={post.id}
          user={user}
          info={post.info}
          id={post.id}
        />
      ))}
    </div>
  );
}

export default App;
