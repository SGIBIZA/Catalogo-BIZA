document.addEventListener('DOMContentLoaded', () => {

 const csvUrl = 'FOR.BIZA.SGI.csv';

  let dadosOriginais = [];

  // Conversão de data do Excel
  function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toLocaleDateString('pt-BR');
  }

  // Função para definir a classe CSS do status
  function getStatusClass(statusTexto) {
    if (!statusTexto) return "";

    const s = statusTexto.toLowerCase();

    if (s.includes("conclu")) return "concluido";   // Concluído
    if (s.includes("aberto")) return "aberto";      // Em Aberto
    if (s.includes("reprov")) return "reprovado";   // Reprovada

    return "";
  }

// Criação dos cards
function criarCard(obj) {
  const div = document.createElement('div');
  div.className = 'card';

  const statusTexto = obj["Status"] ? obj["Status"].trim() : "";
  const statusClass = getStatusClass(statusTexto);

  const motivo = obj["Motivo da reprovação"] ? obj["Motivo da reprovação"].trim() : "";
  const implementador = obj["Implementador"] ? obj["Implementador"].trim() : "";

  const mostrarMotivo = (statusClass === "reprovado" && motivo !== "");
  const aguardandoAprovacao = (statusClass === "aberto" && motivo === "");
  const ideiaAprovada = (statusClass === "aprovado" && motivo === "");

  div.innerHTML = `
    <h3>Ideia #${obj["Item"]}</h3>

    <p>
      <span class="status ${statusClass}">
        ${statusTexto || "Sem status"}
      </span>
    </p>

    <p><strong>Data:</strong> ${excelDateToJSDate(obj["Data da Ideia"])}</p>
    <p class="descricao"><strong>Descrição:</strong> ${obj["Descrição da Ideia de Melhoria"]}</p>

    ${mostrarMotivo ? `
      <div class="motivo-box">
        <strong>Motivo da reprovação:</strong> ${motivo}
      </div>
    ` : ""}

    ${aguardandoAprovacao ? `
      <div class="aprovacao-box">
        <strong>Status da aprovação:</strong> Aguardando aprovação do comitê
      </div>
    ` : ""}

    ${ideiaAprovada ? `
      <div class="aprovado-box">
        <strong>Status:</strong>
        Ideia aprovada, para mais detalhes procure o implementador "${implementador || '—'}"
      </div>
    ` : ""}

    <p class="agente"><strong>Agente:</strong> ${obj["Agente da Melhoria"]}</p>
  `;

  return div;
}

  // Renderização dos cards
  function renderizar() {
    const container = document.getElementById('cards');
    container.innerHTML = '';

    const statusSelecionado = document.getElementById('statusFilter').value;
    const termoBusca = document.getElementById('pesquisa').value.toLowerCase();

    const filtrados = dadosOriginais.filter(d => {
      const statusOk = !statusSelecionado || d["Status"] === statusSelecionado;
      const textoCard =
        `${d["Item"]} ${d["Status"]} ${d["Data da Ideia"]} ${d["Descrição da Ideia de Melhoria"]} ${d["Agente da Melhoria"]}`
          .toLowerCase();
      const pesquisaOk = textoCard.includes(termoBusca);
      return statusOk && pesquisaOk;
    });

    filtrados.forEach(d => container.appendChild(criarCard(d)));
    document.getElementById('totalMelhorias').textContent = filtrados.length;
  }

  // Eventos
  document.getElementById('statusFilter').addEventListener('change', renderizar);
  document.getElementById('pesquisa').addEventListener('input', renderizar);

  // Leitura do CSV
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: results => {
      dadosOriginais = results.data;
      renderizar();
    }
  });

}); // <-- FINALIZA O DOMContentLoaded CORRETAMENTE