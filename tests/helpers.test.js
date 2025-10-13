const assert = require('assert');
const { parseLocaleNumber, computeMonthsRemaining, formatCurrency } = require('../js/helpers');

// parseLocaleNumber
assert.strictEqual(parseLocaleNumber('1.234,56'), 1234.56);
assert.strictEqual(parseLocaleNumber('59,52'), 59.52);
assert.strictEqual(parseLocaleNumber('R$ 1.234,56'), 1234.56);
assert.strictEqual(isNaN(parseLocaleNumber('abc')), true);

// computeMonthsRemaining: approximate checks
const future = new Date(); future.setMonth(future.getMonth() + 3); const futureStr = future.toISOString().slice(0,10);
const months = computeMonthsRemaining(futureStr);
assert.ok(months === 2 || months === 3, 'months remaining should be 2 or 3 depending on day');

// formatCurrency
assert.strictEqual(typeof formatCurrency(1234.56), 'string');

console.log('All helper tests passed.');
