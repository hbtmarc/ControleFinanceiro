// Quick standalone test for calcularSalarioLiquido behavior (benefits base)
// Note: this duplicates minimal helpers from index.html for isolated testing
function diasUteisNoMes(year, month) {
    // month 1-12
    const d = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0).getDate();
    let diasUteis = 0;
    for (let i = 1; i <= last; i++) {
        const dt = new Date(year, month - 1, i);
        const dia = dt.getDay();
        if (dia !== 0 && dia !== 6) diasUteis++;
    }
    return diasUteis;
}
function round(v) { return Math.round((v + Number.EPSILON) * 100) / 100; }
function formatNumber(v) { return (typeof v === 'number') ? v.toFixed(2) : Number(v || 0).toFixed(2); }

function calcularSalarioLiquido(params = {}) {
    const p = Object.assign({
        salarioBase: 0,
        percentualPericulosidade: 0,
        outrosProventosTributaveis: 0,
        numeroDependentes: 0,
        valorDesjejumDia: 0,
        valorTransporteDia: 0,
        diasTrabalhados: undefined,
        horasExtrasSabado: 0,
        horasExtrasDomingo: 0,
        jornadaMensalHoras: 220,
        year: undefined,
        month: undefined
    }, params);

    if (!p.hoursTrabalhadas || p.hoursTrabalhadas === 0) {
        p.hoursTrabalhadas = p.jornadaMensalHoras;
    }
    const baseDiasUteis = (p.year && p.month) ? diasUteisNoMes(p.year, p.month) : 22;
    if ((typeof p.diasTrabalhados === 'undefined' || p.diasTrabalhados === null) && p.hoursTrabalhadas && p.hoursTrabalhadas > 0) {
        const horasPorDia = p.jornadaMensalHoras > 0 ? (p.jornadaMensalHoras / baseDiasUteis) : 8;
        p.diasTrabalhados = Math.round(p.hoursTrabalhadas / horasPorDia);
    }
    if ((typeof p.diasTrabalhados === 'undefined' || p.diasTrabalhados === null) && p.year && p.month) {
        p.diasTrabalhados = baseDiasUteis;
    }
    if (typeof p.diasTrabalhados === 'undefined' || p.diasTrabalhados === null) p.diasTrabalhados = 22;

    const fullMonthDias = (p.year && p.month) ? diasUteisNoMes(p.year, p.month) : 22;
    const diasWorked = (typeof p.diasTrabalhados !== 'undefined' && p.diasTrabalhados !== null) ? p.diasTrabalhados : fullMonthDias;
    const proporcao = (fullMonthDias > 0) ? Math.min(1, diasWorked / fullMonthDias) : 1;
    let proporcaoHoras = 1;
    if (p.hoursTrabalhadas && p.hoursTrabalhadas > 0) {
        proporcaoHoras = Math.min(1, p.hoursTrabalhadas / p.jornadaMensalHoras);
    }
    const finalProporcao = Math.min(proporcao, proporcaoHoras);

    const salarioBaseProrata = p.salarioBase * finalProporcao;
    const adicionalPericulosidade = (salarioBaseProrata * (p.percentualPericulosidade || 0)) / 100;
    const brutoTributavelSemExtras = salarioBaseProrata + adicionalPericulosidade + (p.outrosProventosTributaveis || 0);

    const valorHora = (p.jornadaMensalHoras > 0) ? (salarioBaseProrata / p.jornadaMensalHoras) : ((p.hoursTrabalhadas && p.hoursTrabalhadas > 0) ? (salarioBaseProrata / p.hoursTrabalhadas) : 0);
    const valorHorasExtras = (p.horasExtrasSabado || 0) * (valorHora * 1.5) + (p.horasExtrasDomingo || 0) * (valorHora * 2.0);

    const salarioBrutoTributavel = brutoTributavelSemExtras + valorHorasExtras;

    // Dummy INSS/IRRF simplified for this test since we only care about beneficiosTotais
    const inssTotal = 0;
    const irrfValue = 0;

    const totalDescontos = round(inssTotal + irrfValue);
    const salarioLiquido = round(salarioBrutoTributavel - totalDescontos);

    const beneficiosDiasBase = (p.year && p.month) ? (diasUteisNoMes(p.year, p.month) + 1) : (p.diasTrabalhados || fullMonthDias);
    const beneficiosTotais = round(((p.valorDesjejumDia || 0) + (p.valorTransporteDia || 0)) * (beneficiosDiasBase || 0));

    const result = {
        resumo: {
            salarioBase: formatNumber(salarioBaseProrata),
            beneficiosTotais: formatNumber(beneficiosTotais)
        },
        detalhe: {
            beneficios: { diasBaseParaBeneficios: beneficiosDiasBase }
        }
    };
    return result;
}

// Inputs: use VR=12, VT=12 per day
const params = {
    salarioBase: 3000,
    valorDesjejumDia: 12,
    valorTransporteDia: 12,
    hoursTrabalhadas: 117.333333,
    jornadaMensalHoras: 220,
    year: 2025,
    month: 10
};

const out = calcularSalarioLiquido(params);
console.log('resumo.beneficiosTotais =', out.resumo.beneficiosTotais);
console.log('detalhe.diasBaseParaBeneficios =', out.detalhe.beneficios.diasBaseParaBeneficios);
