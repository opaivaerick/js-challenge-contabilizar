const validarEntradaDeDados = (lancamento) => {
   let mensagens = [];

    if (!/^\d{11}$/.test(lancamento.cpf)) {
        mensagens.push("O CPF deve conter exatamente 11 dígitos numéricos.");
    } else if (!validarCPF(lancamento.cpf)) {
        mensagens.push("O CPF informado não é válido.");
    }

    if (typeof lancamento.valor !== "number" || isNaN(lancamento.valor)) {
        mensagens.push("O valor deve ser numérico.");
    } else {
        if (lancamento.valor > 15000) {
            mensagens.push("O valor não pode ser superior a 15000,00.");
        }
        if (lancamento.valor < -2000) {
            mensagens.push("O valor não pode ser inferior a -2000,00.");
        }
    }

    return mensagens.length > 0 ? mensagens.join(" ") : null;
}

function validarCPF(cpf) {
   let soma;
   let resto;
   soma = 0;

   if (cpf == "00000000000") return false;

   for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
   resto = (soma * 10) % 11;

   if (resto == 10 || resto == 11) resto = 0;
   if (resto != parseInt(cpf.substring(9, 10))) return false;

   soma = 0;
   for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
   resto = (soma * 10) % 11;

   if (resto == 10 || resto == 11) resto = 0;
   if (resto != parseInt(cpf.substring(10, 11))) return false;

   return true;
}

const recuperarSaldosPorConta = (lancamentos) => {
   const saldos = {};

    lancamentos.forEach(lancamento => {
        const cpf = lancamento.cpf;
        const valor = lancamento.valor;

        if (saldos[cpf] === undefined) {
            saldos[cpf] = 0;
        }

        saldos[cpf] += valor;
    });

    return Object.keys(saldos).map(cpf => ({
        cpf: cpf,
        valor: saldos[cpf]
    }));
}

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
   const filtrados = lancamentos.filter(lancamento => lancamento.cpf === cpf);

    if (filtrados.length === 0) return [];
    
    let menor = filtrados[0];
    let maior = filtrados[0];

    filtrados.forEach(lancamento => {
        if (lancamento.valor < menor.valor) menor = lancamento;
        if (lancamento.valor > maior.valor) maior = lancamento;
    });

    return menor.valor === maior.valor ? [menor] : [menor, maior];
}

const recuperarMaioresSaldos = (lancamentos) => {
   const saldos = recuperarSaldosPorConta(lancamentos);

    saldos.sort((a, b) => b.valor - a.valor);

    return saldos.slice(0, 3);
}

const recuperarMaioresMedias = (lancamentos) => {
   const somaValores = {};
   const quantidadeLancamentos = {};

   lancamentos.forEach(lancamento => {
       const cpf = lancamento.cpf;
       const valor = lancamento.valor;

       if (!somaValores[cpf]) {
           somaValores[cpf] = 0;
           quantidadeLancamentos[cpf] = 0;
       }

       somaValores[cpf] += valor;
       quantidadeLancamentos[cpf] += 1;
   });

   const medias = Object.keys(somaValores).map(cpf => ({
       cpf: cpf,
       valor: somaValores[cpf] / quantidadeLancamentos[cpf]
   }));

   medias.sort((a, b) => b.valor - a.valor);

   return medias.slice(0, 3);
}