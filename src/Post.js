
// Importa os hooks useEffect e useState do React
import { useEffect, useState } from 'react';

// Importa a instância do Firestore configurada no firebase.js
import { db } from './firebase';

// Importa funções da biblioteca do Firebase para manipular dados no Firestore
import {
  collection,      // Permite acessar uma coleção ou subcoleção
  addDoc,          // Permite adicionar um novo documento dentro de uma coleção
  serverTimestamp, // Gera a data/hora do servidor, útil para ordenação
  onSnapshot,      // Escuta as alterações em tempo real em uma coleção
  query,           // Permite criar consultas personalizadas
  orderBy,         // Ordena os resultados da consulta com base em um campo
  doc              // Acessa um documento específico (não está sendo usado aqui diretamente)
} from 'firebase/firestore';

// Define o componente Post, que recebe três props: user (nome do usuário logado),
// info (objeto com dados do post: nome, texto, imagem, avatar) e id (ID do post no Firestore)
function Post( { user, info, id} ) {

  // Estado para armazenar o comentário que o usuário está digitando
  const [comentario, setComentario] = useState('');

  // Estado para armazenar os comentários já existentes no post (vindos do Firebase)
  const [comentarios, setComentarios] = useState([]);

  // Hook que roda assim que o componente é montado, ou quando o ID do post mudar
  useEffect(() => {
    // Cria uma consulta para a subcoleção "comentarios" do post específico
    // e ordena os resultados pelo timestamp (data/hora) em ordem decrescente
    const q = query(
      collection(db, 'post', id, 'comentarios'),
      orderBy('timestamp', 'desc')
    );

    // onSnapshot escuta essa consulta em tempo real
    // sempre que um novo comentário for adicionado, o estado é atualizado automaticamente
    const unsubscribe = onSnapshot(q, snapshot => {
      // Mapeia os documentos da coleção e extrai seus dados
      setComentarios(snapshot.docs.map(doc => doc.data()));
    });

    // A função de retorno do useEffect cancela a escuta em tempo real quando o componente for desmontado
    return () => unsubscribe();

  }, [id]); // Esse efeito será executado novamente se o ID mudar

  // Função responsável por enviar um comentário
  const comentar = async (e) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário

    // Impede que comentários em branco ou com apenas espaços sejam enviados
    if (!comentario.trim()) return;

    try {
      // Tenta adicionar um novo comentário na subcoleção "comentarios" do post
      // await é necessário pois addDoc é uma função assíncrona que retorna uma Promise
      await addDoc(collection(db, 'post', id, 'comentarios'), {
        nome: user,                      // Nome do usuário que comentou
        texto: comentario,              // Texto digitado no comentário
        timestamp: serverTimestamp()    // Data/hora do servidor para ordenar os comentários
      });

      // Limpa o campo de input após o envio
      setComentario('');

    } catch (error) {
      // Se algo der errado dentro do try, o erro será capturado aqui
      // Isso ajuda a depurar sem quebrar o aplicativo
      console.error("Erro ao enviar comentário:", error);
    }
  };

  // JSX (HTML misturado com JavaScript) que será renderizado na tela
  return (
 
    <div className="post">
      {/* Cabeçalho do post: avatar e nome do usuário */}
      <div className="post__header">
        <img className="post__avatar" src={info.avatar} alt="avatar" />
        <p>{info.nomeUsuario}</p>
      </div>

      {/* Imagem principal do post */}
      <img className="post__imagem" src={info.image} alt="post" />

      {/* Texto da legenda do post com o nome do autor em destaque */}
      <p className="post__texto">
        <strong>{info.nomeUsuario}</strong> {info.texto}
      </p>

      {/* Lista de comentários renderizados dinamicamente */}
      <div className="post__comentarios">
        {comentarios.map((coment, index) => (
          <p key={index}>
            <strong>{coment.nome}</strong> {coment.texto}
          </p>
        ))}
      </div>

      {/* Formulário para enviar um novo comentário (só aparece se o usuário estiver logado) */}
      {user && (
        <form onSubmit={comentar} className="post__comentarBox">
          <input
            type="text"
            placeholder="Adicione um comentário..."
            value={comentario} // Valor atual do input
            onChange={e => setComentario(e.target.value)} // Atualiza o estado conforme o usuário digita
          />
          <button type="submit" disabled={!comentario.trim()}>
            Publicar
          </button>
        </form>
      )}
    </div>
  );
}

// Exporta o componente Post para que ele possa ser usado em outros arquivos
export default Post;
