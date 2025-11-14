document.addEventListener('DOMContentLoaded', () => {
  const csvUrl = 'https://raw.githubusercontent.com/Dodoccb/Catalogo-BIZA/main/FOR.BIZA.SGI.csv';
  let dadosOriginais = [];

 function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400; 
  const date_info = new Date(utc_value * 1000);
  return date_info.toLocaleDateString('pt-BR'); // Retorna no formato dd/mm/aaaa devido erro de formatação de data no power automate
}

  function criarCard(obj) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>Ideia #${obj["Item"]}</h3>
      <p><strong>Status:</strong> ${obj["Status"]}</p>
     <p><strong>Data:</strong> ${excelDateToJSDate(obj["Data da Ideia"])}</p>
      <p><strong>Descrição:</strong> ${obj["Descrição da Ideia de Melhoria"]}</p>
      <p><strong>Agente:</strong> ${obj["Agente da Melhoria"]}</p>
    `;
    return div;
  }

  function renderizar() {
    const container = document.getElementById('cards');
    container.innerHTML = '';

    const statusSelecionado = document.getElementById('statusFilter').value;
    const termoBusca = document.getElementById('pesquisa').value.toLowerCase();

    const filtrados = dadosOriginais.filter(d => {
      const statusOk = !statusSelecionado || d["Status"] === statusSelecionado;
      const textoCard = `${d["Item"]} ${d["Status"]} ${d["Data da Ideia"]} ${d["Descrição da Ideia de Melhoria"]} ${d["Agente da Melhoria"]}`;
      const pesquisaOk = textoCard.toLowerCase().includes(termoBusca);
      return statusOk && pesquisaOk;
    });

    filtrados.forEach(d => container.appendChild(criarCard(d)));
    document.getElementById('totalMelhorias').textContent = filtrados.length;

  }

  document.getElementById('statusFilter').addEventListener('change', renderizar);
  document.getElementById('pesquisa').addEventListener('input', renderizar);

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: results => {
      dadosOriginais = results.data;
      renderizar();
    }
  });
});