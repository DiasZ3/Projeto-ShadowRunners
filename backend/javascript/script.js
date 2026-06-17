// 1. Array com os dados das corridas (pode vir de um banco de dados no futuro)
const listaCorridas = [
  {
    nome: "circuito shadow",
    premiacao: "r$ 5.000",
    inicio: "rua sla sla",
    chegada: "rua bla bla",
    horario: "22:00",
  },
  {
    nome: "rota neon",
    premiacao: "r$ 3.500",
    inicio: "av. central",
    chegada: "beco escuro",
    horario: "00:30",
  },
];

// 2. Seleciona o container onde os cards vão entrar
const gridCorridas = document.getElementById("grid-corridas");

// 3. Função responsável por criar e injetar o HTML de um card
function renderizarCorridas() {
  // Limpa o grid para não duplicar caso a função seja chamada de novo
  //gridCorridas.innerHTML = "";

  // Passa por cada corrida da lista criando o HTML
  listaCorridas.forEach((corrida) => {
    // Criamos o elemento do botão
    const botaoCard = document.createElement("button");
    botaoCard.classList.add("card");

    // Injetamos a estrutura interna usando os dados do objeto correspondente
    botaoCard.innerHTML = `
            <div class="card-row">
                <p><strong>nome da corrida:</strong> ${corrida.nome}</p>
                <p><strong>premiação:</strong> ${corrida.premiacao}</p>
            </div>
            <div class="card-row">
                <p><strong>local de início:</strong> ${corrida.inicio}</p>
                <p><strong>chegada:</strong> ${corrida.chegada}</p>
            </div>
            <div class="card-row">
                <p><strong>horário:</strong> ${corrida.horario}</p>
            </div>
        `;

    // Coloca o novo card dentro do grid no HTML
    gridCorridas.appendChild(botaoCard);
  });
}
