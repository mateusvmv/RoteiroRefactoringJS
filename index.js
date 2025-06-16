const { readFileSync } = require('fs');

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor);
}

class ServicoCalculoFatura {
  getPeca(pecas, apre) {
    return pecas[apre.id];
  }
  
  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    switch ((this.getPeca(pecas, apre)).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecia: ${(this.getPeca(pecas, apre)).tipo}`);
    }
    return total;
  }
  
  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if ((this.getPeca(pecas, apre)).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }
  
  calcularTotalFatura(pecas, fatura) {
    let totalFatura = 0;
    for (let apre of fatura.apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(pecas, apre);
    }
    return totalFatura;
  }
  
  calcularTotalCreditos(pecas, fatura) {
    let creditos = 0;
    for (let apre of fatura.apresentacoes) {
      // créditos para próximas contratações
      creditos += this.calcularCredito(pecas, apre);
    }
    return creditos;
  }  
}

function gerarFaturaStr (fatura, pecas, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {  
    faturaStr += `  ${(calc.getPeca(pecas, apre)).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre)/100)} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura)/100)}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura)} \n`;
  return faturaStr;
}

function gerarFaturaHTML (fatura, pecas, calc) {
  return [
    `<html>`,
    `<p> Fatura UFMG </p>`,
    `<ul>`,
    ...[...fatura.apresentacoes].map(apre => {
      return `<li>  ${(calc.getPeca(pecas, apre)).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre)/100)} (${apre.audiencia} assentos) </li>`;
    }),
    `</ul>`,
    `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura)/100)} </p>`,
    `<p> Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura)} </p>`,
    `</html>`,
  ].join('\n')
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);
const faturaHTML = gerarFaturaHTML(faturas, pecas, calc);
console.log(faturaHTML);
