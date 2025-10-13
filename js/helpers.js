(function(global){
    'use strict';
    function formatCurrency(v){ try{ return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0); }catch(e){ return String(v); } }

    function parseLocaleNumber(s) {
        try {
            if (s === undefined || s === null) return NaN;
            if (typeof s === 'number') return s;
            let str = String(s).trim();
            if (str === '') return NaN;
            str = str.replace(/\u00A0/g, ' ');
            str = str.replace(/[^0-9,\.\-]/g, '');
            str = str.replace(/(?!^)-/g, '');
            if (str === '' || str === '-' ) return NaN;
            if (str.indexOf('.') !== -1 && str.indexOf(',') !== -1) {
                str = str.replace(/\./g, '').replace(/,/g, '.');
            } else if (str.indexOf(',') !== -1) {
                str = str.replace(/,/g, '.');
            }
            const parts = str.split('.');
            if (parts.length > 2) { str = parts.shift() + '.' + parts.join(''); }
            const v = parseFloat(str);
            return isNaN(v) ? NaN : v;
        } catch (e) { return NaN; }
    }

    function computeMonthsRemaining(targetDateStr) {
        if (!targetDateStr) return 0;
        try {
            const today = new Date();
            const target = new Date(targetDateStr + 'T00:00:00');
            let months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
            if (target.getDate() < today.getDate()) months = months - 1;
            return Math.max(0, months);
        } catch (e) { return 0; }
    }

    // export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { parseLocaleNumber, computeMonthsRemaining, formatCurrency };
    }
    try { global.parseLocaleNumber = parseLocaleNumber; global.computeMonthsRemaining = computeMonthsRemaining; global.formatCurrency = formatCurrency; } catch(e){}
})(typeof window !== 'undefined' ? window : global);
