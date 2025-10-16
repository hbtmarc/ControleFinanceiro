(function(global){
    'use strict';
    function formatCurrency(v){ try{ return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0); }catch(e){ return String(v); } }

    function parseLocaleNumber(s) {
        try {
            if (s === undefined || s === null) return NaN;
            if (typeof s === 'number') return s;
            let str = String(s).trim();
            if (str === '') return NaN;
            
            // Remove currency symbols and spaces
            str = str.replace(/[R$\s\u00A0]/g, '');
            
            // Protect minus: allow only leading minus
            str = str.replace(/(?!^)-/g, '');
            if (str === '' || str === '-') return NaN;
            
            // Detect format: if there's a comma followed by 1-2 digits at the end, it's BR format (123.456,78)
            // Otherwise, if there's a dot followed by 1-2 digits at the end, it's US format (123,456.78)
            const hasBRDecimal = /,\d{1,2}$/.test(str); // ends with ,XX or ,X
            const hasUSDecimal = /\.\d{1,2}$/.test(str); // ends with .XX or .X
            
            if (hasBRDecimal) {
                // Brazilian format: 1.234.567,89 -> remove dots, replace comma with dot
                str = str.replace(/\./g, '').replace(',', '.');
            } else if (hasUSDecimal) {
                // US format: 1,234,567.89 -> remove commas, keep dot
                str = str.replace(/,/g, '');
            } else {
                // No clear decimal separator, or integer - just remove all separators
                str = str.replace(/[.,]/g, '');
            }
            
            // Remove any remaining non-numeric characters except dot and minus
            str = str.replace(/[^0-9.\-]/g, '');
            
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
