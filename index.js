const { readFileSync } = require('fs');

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor);
}

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

class ServicoCalculoFatura {
  constructor(repo) {
    this.repo = repo;
  }
  
  calcularTotalApresentacao(apre) {
    let total = 0;
    switch ((this.repo.getPeca(apre)).tipo) {
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
        throw new Error(`Peça desconhecia: ${(this.repo.getPeca(apre)).tipo}`);
    }
    return total;
  }
  
  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if ((this.repo.getPeca(apre)).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }
  
  calcularTotalFatura(fatura) {
    let totalFatura = 0;
    for (let apre of fatura.apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(apre);
    }
    return totalFatura;
  }
  
  calcularTotalCreditos(fatura) {
    let creditos = 0;
    for (let apre of fatura.apresentacoes) {
      // créditos para próximas contratações
      creditos += this.calcularCredito(apre);
    }
    return creditos;
  }  
}

function gerarFaturaStr (fatura, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {  
    faturaStr += `  ${(calc.repo.getPeca(apre)).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre)/100)} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura)/100)}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
  return faturaStr;
}

function gerarFaturaHTML (fatura, calc) {
  return [
    `<html>`,
    `<p> Fatura UFMG </p>`,
    `<ul>`,
    ...[...fatura.apresentacoes].map(apre => {
      return `<li>  ${(calc.repo.getPeca(apre)).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre)/100)} (${apre.audiencia} assentos) </li>`;
    }),
    `</ul>`,
    `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura)/100)} </p>`,
    `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} </p>`,
    `</html>`,
  ].join('\n')
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const repo = new Repositorio();
const calc = new ServicoCalculoFatura(repo);
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
const faturaHTML = gerarFaturaHTML(faturas, calc);
console.log(faturaHTML);
