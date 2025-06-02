# Mini Instagram Clone

Projeto clone simplificado do Instagram, construído com React e Firebase (Firestore, Auth, Storage).  
Tem como objetivo aprendizado prático de frontend com React e backend serverless usando Firebase.

---

## Funcionalidades

- Autenticação de usuários (email/senha, Google)  
- Feed de posts com imagens, legendas e usuários  
- Upload de imagens para Firebase Storage  
- Sincronização em tempo real com Firestore  
- Estrutura modular e limpa usando React Hooks  

---

## Tecnologias usadas

- React  
- Firebase (Firestore, Authentication, Storage, Functions)  
- CSS / Tailwind CSS (opcional, depende do seu setup)  
- NPM para gerenciamento de pacotes  

---

## Como rodar localmente

1. Clone o repositório  
```bash
git clone https://github.com/seuusuario/seurepositorio.git
```

2. Entre na pasta do projeto  
```bash
cd seurepositorio
```

3. Instale as dependências  
```bash
npm install
```

4. Configure seu Firebase  
- Crie um projeto no [Firebase Console](https://console.firebase.google.com/)  
- Copie as credenciais e atualize o arquivo `src/firebase.js` com suas informações:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

5. Inicie o projeto  
```bash
npm start
```

---

## Estrutura do projeto

```
/src
  /components
    Feed.js       # Componente que lista posts
    Post.js       # Componente individual do post
  firebase.js     # Configuração do Firebase
  App.js          # Entrada do React
```

---

## Próximos passos

- Implementar likes e comentários  
- Melhorar UI/UX com animações e responsividade  
- Autenticação social (Facebook, Twitter)  
- Deploy para produção com Firebase Hosting ou Vercel  

---

## Contribuições

Sugestões para melhoria do código são muito bem-vindas!  
Sinta-se à vontade para abrir uma issue ou enviar um pull request com correções, ideias ou melhorias. 🚀

---

## Contato

Feito por Iago Alves  
Entre em contato ou contribua com ideias no GitHub!
Linkdin : https://www.linkedin.com/in/iagoalvesjs/

---
