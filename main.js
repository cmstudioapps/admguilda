const data = new Date

let dia = data.getDate()
let mes = data.getMonth() + 1
let ano = data.getFullYear()
let hora = data.getHours()
let minuto = data.getMinutes()

const firebaseConfig = {
  apiKey: "AIzaSyDWDe3o7EB5vUfAZ1dNzj7nLZ4Ieh0m6Lg",
  authDomain: "escola-97256.firebaseapp.com",
  databaseURL: "https://escola-97256-default-rtdb.firebaseio.com",
  projectId: "escola-97256",
  storageBucket: "escola-97256.appspot.com",
  messagingSenderId: "765009682973",
  appId: "1:765009682973:web:d245f17dcdde0a28959cf4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function enviar() {

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  // Autenticação do usuário
  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(userCredential => {
      return userCredential.user.getIdToken(); // Obtém o token de autenticação
    })
    .then(idToken => {

      if (confirm("Tem certeza?")) {
        enviarDados(idToken); // Chama a função para enviar os dados
      }
    })
    .catch(error => {
      console.error("Erro de autenticação:", error);
      alert("Você não tem acesso a este recurso, ou sua senha e e-mail de acesso estão erradas.")
    });
}

function enviarDados(idToken) {
  const imagem = document.getElementById('imagem').files[0];
  const legenda = "<pe>" + document.getElementById('legenda').value + "<pe>"
  const link = document.getElementById('link').value;
  let visibilidade = document.getElementById("visivel").value

  if (!link) {

    visibilidade = "none"

  }
  
  if (imagem) {

  // Upload da imagem ao Firebase Storage
  const storageRef = firebase.storage().ref('guilda/' + imagem.name);
  storageRef.put(imagem)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL(); // Obtém a URL da imagem
    })
    .then(urlImagem => {
      // Dados a serem enviados ao Firebase Realtime Database
      let posterID = Math.floor(Math.random() * 3000) + 1;
      const url = 'https://escola-97256-default-rtdb.firebaseio.com/guilda/' + posterID + '/.json';
      const dados = {
        IMG: urlImagem, // URL da imagem
        LG: legenda,
        Link: link,
        id: posterID,
        Dia: dia,
        Mes: mes,
        Ano: ano,
        Hora: hora,
        Minuto: minuto,
        visivel: visibilidade
      };

      return fetch(url, {
        method: 'PATCH',

        body: JSON.stringify(dados)
      });
    })
    .then(response => response.json())
    .then(data => {
      console.log("Dados enviados com sucesso:", data);
      alert("A postagem foi enviada com sucesso e está disponível para todos.")
    })
    .catch(error => {
      console.error("Erro ao enviar dados:", error);
      alert("erro ao enviar a postagem")
    });
  } else {
    
    alert("No momento é obrigatório que a notícia esteja acompanhada de uma imagem, por favor selecione uma imagem")
    
  }
}

function deletar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  // Autenticação do usuário
  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(userCredential => {
      return userCredential.user.getIdToken(); // Obtém o token de autenticação
    })
    .then(idToken => {


      apagar(); // Chama a função para enviar os dados

    })
    .catch(error => {
      console.error("Erro de autenticação:", error);
      alert("Você não tem acesso a este recurso ou sua senha e e-mail de acesso estão errados.");
    });
}

function apagar() {
  let posterIDD = prompt("Digite o ID da notícia");

  // Verifica se o ID é válido
  if (!posterIDD) {
    alert("Operação cancelada ou ID inválido.");
    return;
  }

  // Acessa o banco de dados do Firebase diretamente
  firebase.database().ref('guilda/' + posterIDD).remove()
    .then(() => {
      alert("Notícia removida com sucesso.");
    })
    .catch(error => {
      console.error("Erro ao deletar:", error);
      alert("Não conseguimos proceder. Tente novamente.");
    });
}