const { formatarMoeda } = require('./util');

function gerarFaturaStr(fatura, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${(calc.repo.getPeca(apre)).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre) / 100)} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura) / 100)}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, calc) {
  return [
    `<html>`,
    `<p> Fatura UFMG </p>`,
    `<ul>`,
    ...[...fatura.apresentacoes].map(apre => {
      return `<li>  ${(calc.repo.getPeca(apre)).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre) / 100)} (${apre.audiencia} assentos) </li>`;
    }),
    `</ul>`,
    `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura) / 100)} </p>`,
    `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} </p>`,
    `</html>`,
  ].join('\n')
}

module.exports = {
  gerarFaturaStr,
  gerarFaturaHTML,
};
