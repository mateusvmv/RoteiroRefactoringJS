
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

module.exports = {
  ServicoCalculoFatura,
};
