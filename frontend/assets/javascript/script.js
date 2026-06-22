// Container onde os cards vão entrar
const gridCorridas = document.getElementById("grid-corridas");

// Renderiza corridas a partir do backend
async function renderizarCorridas() {
  gridCorridas.innerHTML = "";
  try {
    const res = await fetch("/api/corridas");
    const lista = await res.json();

    lista.forEach((corrida) => {
      const botaoCard = document.createElement("button");
      botaoCard.classList.add("card");
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
      gridCorridas.appendChild(botaoCard);
    });
  } catch (err) {
    console.error("Erro ao carregar corridas:", err);
  }
}

// Envia formulário ao backend
async function cadastrarCorrida(event) {
  event.preventDefault();
  const nome = document.getElementById("nomeC").value;
  const apelido = document.getElementById("apelidoC").value;
  const horario = document.getElementById("horarioC").value;
  const premiacao = document.getElementById("premiacao").value || 0;
  const inicio = document.getElementById("inicioC").value;
  const chegada = document.getElementById("chegadaC").value;
  const quantidade =
    document.querySelector('input[name="corredores"]:checked')?.value || null;

  const payload = {
    nome,
    apelido,
    horario,
    premiacao,
    inicio,
    chegada,
    quantidade,
  };

  try {
    const res = await fetch("/api/corridas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Falha ao cadastrar corrida");

    // Após salvar, redireciona para a página de listagem
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar corrida. Veja o console para detalhes.");
  }
}

// Quando estiver na página de listagem, renderiza ao carregar
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("grid-corridas")) renderizarCorridas();
});
