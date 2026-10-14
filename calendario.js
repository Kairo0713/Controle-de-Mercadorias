const nomesDia = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira',
  'Quinta-feira','Sexta-feira','Sábado'];

const inpData = document.getElementById('data');
const inpLinhas1 = document.getElementById('linhas1');
const inpLinhas2 = document.getElementById('linhas2');
document.getElementById('btnGerar').addEventListener('click', gerar);
inpData.addEventListener('change', gerar);
document.getElementById('btnPdf').addEventListener('click', () => window.print());
document.getElementById('btnSemana').addEventListener('click', () => imprimirLote(diasDaSemana()));
document.getElementById('btnMes').addEventListener('click', () => imprimirLote(diasDoMes()));

gerar();
// Data de hoje como padrão (usando o fuso local)
const hoje = new Date();
inpData.value = [
  hoje.getFullYear(),
  String(hoje.getMonth() + 1).padStart(2, '0'),
  String(hoje.getDate()).padStart(2, '0')
].join('-');

function montarPagina(dataTxt, diaSemana, linhas) {
  const cab = '<th>KGS</th><th>CLIENTE</th><th>LOTE</th>';
  let html = `
    <div class="pagina">
      <div class="cabecalho">
        <h2>Controle de Mercadoria</h2>
        <div class="data-info">
          <span>${dataTxt}</span>
          <span>${diaSemana}</span>
        </div>
      </div>
      <table><thead><tr>${cab}${cab}</tr></thead><tbody>`;
  for (let i = 0; i < linhas; i++) {
    html += '<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
  }
  html += '</tbody></table></div>';
  return html;
}

function lerData() {
  const [ano, mes, dia] = inpData.value.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

function ehFimDeSemana(d) {
  return d.getDay() === 0 || d.getDay() === 6;
}

function paginasDoDia(data) {
  const dataTxt = [
    String(data.getDate()).padStart(2, '0'),
    String(data.getMonth() + 1).padStart(2, '0'),
    data.getFullYear()
  ].join('/');
  const diaSemana = nomesDia[data.getDay()];

  return montarPagina(dataTxt, diaSemana, Number(inpLinhas1.value)) +
         montarPagina(dataTxt, diaSemana, Number(inpLinhas2.value));
}

function renderizar(datas) {
  document.getElementById('tabela').innerHTML = datas.map(paginasDoDia).join('');
}

function gerar() {
  if (!inpData.value) return;
  const data = lerData();

  if (ehFimDeSemana(data)) {
    document.getElementById('tabela').innerHTML =
      '<p>A data escolhida cai no fim de semana. Escolha um dia útil.</p>';
    return;
  }
  renderizar([data]);
}

function diasDaSemana() {
  const lista = [];
  const d = lerData();
  while (ehFimDeSemana(d)) d.setDate(d.getDate() + 1); // fim de semana: vai para segunda
  while (d.getDay() >= 1 && d.getDay() <= 5) {         // segunda a sexta
    lista.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return lista;
}

function diasDoMes() {
  const base = lerData();
  const ano = base.getFullYear();
  const mes = base.getMonth();
  const ultimo = new Date(ano, mes + 1, 0).getDate();
  const lista = [];
  for (let dia = 1; dia <= ultimo; dia++) {
    const d = new Date(ano, mes, dia);
    if (!ehFimDeSemana(d)) lista.push(d);
  }
  return lista;
}

function imprimirLote(datas) {
  if (!inpData.value || datas.length === 0) return;
  renderizar(datas);
  window.print();
}