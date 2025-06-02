// Importa o hook useState do React para gerenciar estados no componente
import { useState } from 'react';

// Importa funções do Firebase para autenticação
import {
  createUserWithEmailAndPassword, // cria novo usuário
  updateProfile, // atualiza o perfil do usuário
  signInWithEmailAndPassword, // faz login com email e senha
  signOut // encerra a sessão do usuário
} from "firebase/auth";

// Importa funções do Firebase Storage para upload de arquivos
import {
  ref, // cria referência de onde o arquivo será armazenado
  uploadBytesResumable, // faz upload com feedback de progresso
  getDownloadURL // recupera a URL do arquivo após upload
} from "firebase/storage";

// Importa funções do Firestore (banco de dados)
import {
  collection, // representa uma coleção no Firestore
  addDoc, // adiciona um novo documento
  serverTimestamp // marca o horário do servidor
} from "firebase/firestore";

// Importa os serviços configurados do Firebase
import { auth, storage, db } from './firebase';

function Header({ user, setUser }) { // Recebe user e setUser como props
  const [progress, setProgress] = useState(0); // Progresso do upload
  const [file, setFile] = useState(null); // Arquivo selecionado para upload

  // Função para abrir ou fechar modais (upload ou criar conta)
  const toggleModal = (selector, show = true) => {
    const modal = document.querySelector(selector);
    if (modal) modal.style.display = show ? 'block' : 'none'; // mostra ou esconde modal
  };  

  // Função para criar conta
  const criarConta = async (e) => {
    e.preventDefault(); // impede reload da página

    // Obtém os valores dos inputs
    const email = document.getElementById('email-cadastro').value;
    const username = document.getElementById('username-cadastro').value;
    const password = document.getElementById('password-cadastro').value;

    try {
      // Cria o usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Atualiza o nome de exibição (displayName)
      await updateProfile(userCredential.user, { displayName: username });

      // Alerta de sucesso
      alert("Conta criada com sucesso!");

      // Fecha o modal de criação de conta
      toggleModal('.modalCriarConta', false);
    } catch (error) {
      // Caso ocorra erro, exibe no console e alerta o usuário
      console.error(error);
      alert('Erro ao criar conta: Verifique os dados.');
    }
  };

  // Função de login
  const logar = async (e) => {
    e.preventDefault();

    // Pega valores dos campos de login
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    try {
      // Faz login no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Atualiza o estado com o nome do usuário logado
      setUser(userCredential.user.displayName);

      alert('Logado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer login: Verifique os dados.');
    }
  };

  // Função de logout
  const deslogar = async (e) => {
    //e.preventDefault();
    window.location.reload(true); 

    try {
      // Encerra a sessão
      await signOut(auth);
      setUser(null); // Limpa o usuário
    } catch (err) {
      console.error(err);
    }
  };

  // Função de upload de imagem e criação do post
  const uploadPost = (e) => {
    e.preventDefault();

    const tituloPost = document.getElementById('tituloUpload').value;

    if (!file) {
      alert("Selecione um arquivo!");
      return;
    }

    // Cria referência no Storage para armazenar imagem
    const storageRef = ref(storage, `images/${file.name}`);

    // Inicia upload do arquivo
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitora progresso
    uploadTask.on("state_changed",
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog); // atualiza barra de progresso
      },
      (error) => {
        console.error(error);
        alert("Erro no upload: " + error.message);
      },
      async () => {
        try {
          // Pega a URL do arquivo após upload
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          // Cria documento no Firestore com info do post
          await addDoc(collection(db, "post"), {
            titulo: tituloPost,
            image: url,
            userName: user,
            timestamp: serverTimestamp() // marca data/hora
          });

          // Resetar estados e limpar formulário
          setProgress(0);
          setFile(null);
          alert("Upload realizado com sucesso!");
          document.getElementById('formUpload').reset();
          toggleModal('.modalUpload', false);
        } catch (err) {
          console.error(err);
          alert("Erro ao salvar post no banco de dados.");
        }
      }
    );
  };

  return (
    <div className="header">

      {/* Modal de criar conta */}
      <div className='modalCriarConta'>
        <div className='formCriarConta'>
          <h2>Criar Conta</h2>
          <div onClick={() => toggleModal('.modalCriarConta', false)} className='closeModalCriar'>X</div>
          <form onSubmit={criarConta}>
            <input id="email-cadastro" type="text" placeholder='Seu email' />
            <input id="username-cadastro" type="text" placeholder='Seu nome de usuário' />
            <input id="password-cadastro" type="password" placeholder='Sua senha' />
            <input type="submit" value='Criar Conta!' />
          </form>
        </div>
      </div>

      {/* Modal de upload de post */}
      <div className='modalUpload'>
        <div className='formUpload'>
          <h2>Fazer um post</h2>
          <div onClick={() => toggleModal('.modalUpload', false)} className='closeModalCriar'>X</div>
          <form id="formUpload" onSubmit={uploadPost}>
            <progress id='progessUpload' value={progress} max="100">{progress}%</progress>
            <input id="tituloUpload" type="text" placeholder='Legenda do post' />
            <input onChange={(e) => setFile(e.target.files[0])} type='file' name='file' />
            <input type="submit" value='Postar' />
          </form>
        </div>
      </div>

      {/* Header principal com logo e login */}
      <div className='center'>
        <div className="header_logo">
          <a href="/">
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Instagram logo"
            />
          </a>
        </div>

        {/* Se o usuário estiver logado, mostra opções */}
        {user ? (
          <div className='header_logadoInfo'>
            <span>Olá, <b>{user}</b></span>
            <a onClick={(e) => { e.preventDefault(); toggleModal('.modalUpload', true); }} href="#">Postar!</a>
            <a onClick={deslogar} href="#">Deslogar</a>
          </div>
        ) : (
          // Caso não esteja logado, mostra formulário de login
          <div className="header_loginForm">
            <form onSubmit={logar}>
              <input id='email-login' type="text" placeholder="Login..." />
              <input id='password-login' type="password" placeholder="Senha..." />
              <input type="submit" name="acao" value="Logar!" />
            </form>
            <div className='buttonCriarConta'>
              <a onClick={(e) => { e.preventDefault(); toggleModal('.modalCriarConta', true); }} href="#">Criar Conta!</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Exporta o componente Header
export default Header;