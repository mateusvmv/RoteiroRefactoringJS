const { readFileSync } = require('fs');
const { Repositorio } = require('./repositorio');
const { ServicoCalculoFatura } = require('./servico');
const { gerarFaturaStr, gerarFaturaHTML } = require('./apresentacao');

const faturas = JSON.parse(readFileSync('./faturas.json'));
const repo = new Repositorio();
const calc = new ServicoCalculoFatura(repo);
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
const faturaHTML = gerarFaturaHTML(faturas, calc);
console.log(faturaHTML);
