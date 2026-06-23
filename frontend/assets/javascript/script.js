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
  if (document.getElementById("lista-corridas-config")) renderizarCorridasConfiguracao();
});

async function atualizarCorrida(event, id) {
  event.preventDefault();
  const form = event.target.closest("form");
  const payload = {
    nome: form.querySelector(".input-nome").value,
    apelido: form.querySelector(".input-apelido").value,
    horario: form.querySelector(".input-horario").value,
    premiacao: Number(form.querySelector(".input-premiacao").value) || 0,
    inicio: form.querySelector(".input-inicio").value,
    chegada: form.querySelector(".input-chegada").value,
    quantidade: Number(
      form.querySelector('input[name="corredores_' + id + '"]:checked')?.value,
    ) || null,
  };

  try {
    const res = await fetch(`/api/corridas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Falha ao atualizar corrida");

    alert("Corrida salva com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar corrida. Veja o console para detalhes.");
  }
}

async function deletarCorrida(id) {
  if (!confirm("Tem certeza de que deseja eliminar esta corrida permanentemente?")) return;

  try {
    const res = await fetch(`/api/corridas/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Falha ao deletar corrida");

    document.getElementById(`card-corrida-${id}`).remove();
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir corrida. Veja o console para detalhes.");
  }
}

async function renderizarCorridasConfiguracao() {
  const container = document.getElementById("lista-corridas-config");
  container.innerHTML = "";

  try {
    const res = await fetch("/api/corridas");
    const lista = await res.json();

    if (!lista.length) {
      container.innerHTML = `<div class="empty-state">Nenhuma corrida encontrada.</div>`;
      return;
    }

    lista.forEach((corrida) => {
      const card = document.createElement("div");
      card.className = "race-settings-card";
      card.id = `card-corrida-${corrida.id}`;
      card.innerHTML = `
        <form onsubmit="atualizarCorrida(event, '${corrida.id}')">
          <div class="race-settings-header">
            <span class="race-settings-title">${corrida.nome}</span>
            <div class="action-buttons">
              <button type="submit" class="btn-action btn-save">Salvar Alterações</button>
              <button type="button" class="btn-action btn-delete" onclick="deletarCorrida('${corrida.id}')">Excluir</button>
            </div>
          </div>

          <div class="form-grid-custom">
            <div class="form-column">
              <input type="text" placeholder="nome da corrida" class="input-purple input-nome" value="${corrida.nome}" required />
              <input type="text" placeholder="apelido de criador" class="input-purple input-apelido" value="${corrida.apelido}" required />
              <input type="text" placeholder="horário da corrida" class="input-purple input-horario" value="${corrida.horario}" required />

              <div class="form-block-group">
                <span class="block-title">local de corrida</span>
                <div class="inner-block neon-glow">
                  <div class="input-row">
                    <label>início:</label>
                    <input type="text" class="input-light input-inicio" value="${corrida.inicio}" required />
                  </div>
                  <div class="input-row">
                    <label>chegada:</label>
                    <input type="text" class="input-light input-chegada" value="${corrida.chegada}" required />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-column">
              <div class="form-block-group">
                <span class="block-title">quantidade de corredores</span>
                <div class="inner-block riders-grid neon-glow">
                  ${[2, 3, 4, 6, 8, 12]
                    .map(
                      (quantidade) => `
                    <label class="radio-container">
                      <input type="radio" name="corredores_${corrida.id}" value="${quantidade}" ${
                        corrida.quantidade === quantidade ? "checked" : ""
                      } />
                      <span class="radio-checkmark"></span> ${quantidade}
                    </label>`,
                    )
                    .join("")}
                </div>
              </div>

              <div class="form-block-group">
                <div class="inner-block reward-block neon-glow">
                  <div class="reward-header">
                    <label>premiação:</label>
                    <span class="reward-status">R$</span>
                  </div>
                  <div class="input-row">
                    <label>valor:</label>
                    <input type="number" class="input-light input-premiacao" value="${corrida.premiacao ?? ""}" step="0.01" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar corridas de configuração:", err);
    container.innerHTML = `<div class="error-card">Erro ao carregar corridas. Tente novamente.</div>`;
  }
}
