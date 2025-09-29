const App = {
    state: {
        currentDate: new Date(2025, 0, 1),
        appData: null,
    },
    ui: {
        charts: {
            spendingGoals: null,
            categorySpending: null,
            annualSummary: null
        }
    },

    init: function() {
        console.log("Iniciando a aplicação de controle financeiro...");
        Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
        Chart.defaults.color = '#777';

        this.state.appData = storage.loadData();
        if (!this.state.appData.settings |

| Object.keys(this.state.appData.settings).length === 0) {
            this.setDefaultSettings();
        }

        this.mapUI();
        this.bindEvents();
        this.render();
    },

    setDefaultSettings: function() {
        this.state.appData.settings = {
            spendingGoals:,
            expenseCategories:,
            paymentMethods:,
            feedbackMessages:
        };
        storage.saveData(this.state.appData);
    },

    mapUI: function() {
        this.ui.currentMonthDisplay = document.getElementById('current-month-display');
        this.ui.prevMonthBtn = document.getElementById('prev-month-btn');
        this.ui.nextMonthBtn = document.getElementById('next-month-btn');
        this.ui.incomeTableBody = document.getElementById('income-table-body');
        this.ui.expensesTableBody = document.getElementById('expenses-table-body');
        this.ui.addTransactionBtn = document.getElementById('add-transaction-btn');
        this.ui.modal = document.getElementById('transaction-modal');
        this.ui.closeModalBtn = document.getElementById('close-modal-btn');
        this.ui.transactionForm = document.getElementById('transaction-form');
        this.ui.toggleIncomeBtn = document.getElementById('toggle-income');
        this.ui.toggleExpenseBtn = document.getElementById('toggle-expense');
        this.ui.expenseFields = document.getElementById('expense-fields');
    },

    bindEvents: function() {
        this.ui.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.ui.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        this.ui.addTransactionBtn.addEventListener('click', () => this.openModal());
        this.ui.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.ui.modal.addEventListener('close', () => this.ui.transactionForm.reset());
        this.ui.transactionForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.ui.toggleIncomeBtn.addEventListener('click', () => this.toggleTransactionType('incomes'));
        this.ui.toggleExpenseBtn.addEventListener('click', () => this.toggleTransactionType('expenses'));
        this.ui.incomeTableBody.addEventListener('click', (e) => this.handleTableClick(e, 'incomes'));
        this.ui.expensesTableBody.addEventListener('click', (e) => this.handleTableClick(e, 'expenses'));
    },

    render: function() {
        this.renderMonthDisplay();
        this.renderTables();
        this.renderDashboard();
    },
    
    changeMonth: function(direction) {
        this.state.currentDate.setMonth(this.state.currentDate.getMonth() + direction);
        this.render();
    },

    renderMonthDisplay: function() {
        const month = this.state.currentDate.toLocaleString('pt-BR', { month: 'long' });
        const year = this.state.currentDate.getFullYear();
        this.ui.currentMonthDisplay.textContent = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    },

    getCurrentMonthData: function() {
        const year = this.state.currentDate.getFullYear();
        const month = String(this.state.currentDate.getMonth() + 1).padStart(2, '0');
        if (!this.state.appData.data[year]) {
            this.state.appData.data[year] = {};
        }
        if (!this.state.appData.data[year][month]) {
            this.state.appData.data[year][month] = { incomes:, expenses: };
        }
        return this.state.appData.data[year][month];
    },

    renderTables: function() {
        const currentMonthData = this.getCurrentMonthData();
        this.ui.incomeTableBody.innerHTML = '';
        if (currentMonthData.incomes.length > 0) {
            currentMonthData.incomes.forEach(income => this.renderIncomeRow(income));
        } else {
            this.ui.incomeTableBody.innerHTML = '<tr><td colspan="3">Nenhuma entrada registrada.</td></tr>';
        }
        this.ui.expensesTableBody.innerHTML = '';
        if (currentMonthData.expenses.length > 0) {
            currentMonthData.expenses.forEach(expense => this.renderExpenseRow(expense));
        } else {
            this.ui.expensesTableBody.innerHTML = '<tr><td colspan="8">Nenhuma despesa registrada.</td></tr>';
        }
    },

    renderIncomeRow: function(income) {
        const row = document.createElement('tr');
        row.dataset.id = income.id;
        row.innerHTML = `
            <td>${income.description}</td>
            <td>${this.formatCurrency(income.amount)}</td>
            <td class="actions">
                <button class="edit-btn material-symbols-outlined" title="Editar">edit</button>
                <button class="delete-btn material-symbols-outlined" title="Excluir">delete</button>
            </td>
        `;
        this.ui.incomeTableBody.appendChild(row);
    },

    renderExpenseRow: function(expense) {
        const row = document.createElement('tr');
        row.dataset.id = expense.id;
        row.innerHTML = `
            <td><input type="checkbox" class="paid-checkbox" ${expense.isPaid? 'checked' : ''}></td>
            <td>${expense.description}</td>
            <td>${String(expense.day).padStart(2, '0')}</td>
            <td>${expense.payment}</td>
            <td>${expense.type}</td>
            <td>${expense.category}</td>
            <td>${this.formatCurrency(expense.amount)}</td>
            <td class="actions">
                <button class="edit-btn material-symbols-outlined" title="Editar">edit</button>
                <button class="delete-btn material-symbols-outlined" title="Excluir">delete</button>
            </td>
        `;
        this.ui.expensesTableBody.appendChild(row);
    },

    handleTableClick: function(event, type) {
        const target = event.target;
        const row = target.closest('tr');
        if (!row) return;
        const id = row.dataset.id;

        if (target.classList.contains('edit-btn')) {
            this.openModal(type, id);
        } else if (target.classList.contains('delete-btn')) {
            this.deleteTransaction(type, id);
        } else if (target.classList.contains('paid-checkbox')) {
            this.togglePaidStatus(id);
        }
    },

    togglePaidStatus: function(id) {
        const currentMonthData = this.getCurrentMonthData();
        const expense = currentMonthData.expenses.find(exp => exp.id === id);
        if (expense) {
            expense.isPaid =!expense.isPaid;
            storage.saveData(this.state.appData);
            this.render();
        }
    },

    generateUUID: function() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[1]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1)) & 15 >> c / 4).toString(16)
        );
    },

    openModal: function(type = 'expenses', id = null) {
        this.ui.transactionForm.reset();
        this.populateSelects();
        
        const modalTitle = document.getElementById('modal-title');
        const idInput = document.getElementById('transaction-id');
        
        this.toggleTransactionType(type);

        if (id) { // Modo de edição
            modalTitle.textContent = 'Editar Transação';
            idInput.value = id;
            const currentMonthData = this.getCurrentMonthData();
            const transaction = currentMonthData[type].find(t => t.id === id);
            
            if (transaction) {
                document.getElementById('description').value = transaction.description;
                document.getElementById('amount').value = transaction.amount;
                if (type === 'expenses') {
                    document.getElementById('day').value = transaction.day;
                    document.getElementById('payment-method').value = transaction.payment;
                    document.getElementById('expense-type').value = transaction.type;
                    document.getElementById('category').value = transaction.category;
                }
            }
        } else { // Modo de adição
            modalTitle.textContent = 'Adicionar Nova Transação';
            idInput.value = '';
        }
        
        this.ui.modal.showModal();
    },

    closeModal: function() {
        this.ui.modal.close();
    },

    populateSelects: function() {
        const paymentSelect = document.getElementById('payment-method');
        const categorySelect = document.getElementById('category');
        paymentSelect.innerHTML = this.state.appData.settings.paymentMethods
         .map(p => `<option value="${p}">${p}</option>`).join('');
        categorySelect.innerHTML = this.state.appData.settings.expenseCategories
         .map(c => `<option value="${c}">${c}</option>`).join('');
    },

    toggleTransactionType: function(type) {
        const typeInput = document.getElementById('transaction-type');
        if (type === 'incomes') {
            this.ui.toggleIncomeBtn.classList.add('active');
            this.ui.toggleExpenseBtn.classList.remove('active');
            this.ui.expenseFields.classList.add('hidden');
            typeInput.value = 'incomes';
        } else {
            this.ui.toggleExpenseBtn.classList.add('active');
            this.ui.toggleIncomeBtn.classList.remove('active');
            this.ui.expenseFields.classList.remove('hidden');
            typeInput.value = 'expenses';
        }
    },

    handleFormSubmit: function(event) {
        event.preventDefault();
        
        const id = document.getElementById('transaction-id').value;
        const type = document.getElementById('transaction-type').value;
        
        const transactionData = {
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
        };

        if (type === 'expenses') {
            transactionData.day = parseInt(document.getElementById('day').value);
            transactionData.payment = document.getElementById('payment-method').value;
            transactionData.type = document.getElementById('expense-type').value;
            transactionData.category = document.getElementById('category').value;
        }

        if (id) {
            this.updateTransaction(type, id, transactionData);
        } else {
            transactionData.id = this.generateUUID();
            if (type === 'expenses') transactionData.isPaid = false;
            this.createTransaction(type, transactionData);
        }
        
        this.closeModal();
    },

    createTransaction: function(type, data) {
        const currentMonthData = this.getCurrentMonthData();
        currentMonthData[type].push(data);
        storage.saveData(this.state.appData);
        this.render();
    },

    updateTransaction: function(type, id, newData) {
        const currentMonthData = this.getCurrentMonthData();
        const transactionIndex = currentMonthData[type].findIndex(t => t.id === id);
        if (transactionIndex > -1) {
            const originalTransaction = currentMonthData[type][transactionIndex];
            currentMonthData[type][transactionIndex] = {...originalTransaction,...newData };
            storage.saveData(this.state.appData);
            this.render();
        }
    },

    deleteTransaction: function(type, id) {
        if (confirm('Tem certeza de que deseja excluir esta transação?')) {
            const currentMonthData = this.getCurrentMonthData();
            currentMonthData[type] = currentMonthData[type].filter(t => t.id!== id);
            storage.saveData(this.state.appData);
            this.render();
        }
    },

    formatCurrency: function(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value |

| 0);
    },

    renderDashboard: function() {
        const currentMonthData = this.getCurrentMonthData();
        const totalIncome = currentMonthData.incomes.reduce((sum, income) => sum + income.amount, 0);
        const paidExpenses = currentMonthData.expenses.filter(exp => exp.isPaid);
        const totalPaidExpenses = paidExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const pendingExpenses = currentMonthData.expenses.filter(exp =>!exp.isPaid);
        const totalPendingExpenses = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const balance = totalIncome - totalPaidExpenses;

        document.getElementById('kpi-total-income').textContent = this.formatCurrency(totalIncome);
        document.getElementById('kpi-total-expenses').textContent = this.formatCurrency(totalPaidExpenses);
        document.getElementById('kpi-balance').textContent = this.formatCurrency(balance);
        document.getElementById('kpi-pending-bills').textContent = this.formatCurrency(totalPendingExpenses);
        
        this.updateFeedbackMessage(totalIncome, paidExpenses, balance);
        this.renderSpendingGoalsChart(totalIncome, paidExpenses);
        this.renderCategorySpendingChart(paidExpenses);
        this.renderAnnualSummaryChart();
    },

    updateFeedbackMessage: function(totalIncome, paidExpenses, balance) {
        const feedbackEl = document.getElementById('feedback-message');
        const { spendingGoals, feedbackMessages } = this.state.appData.settings;

        if (totalIncome === 0 && paidExpenses.length === 0) {
            feedbackEl.textContent = "Comece adicionando suas entradas e despesas para ver seu resumo.";
            return;
        }

        const essentialGoal = spendingGoals.find(g => g.type === 'Essenciais').goal;
        const nonEssentialGoal = spendingGoals.find(g => g.type === 'Não Essenciais').goal;
        const reserveGoal = spendingGoals.find(g => g.type === 'Reserva').goal;

        const totalEssential = paidExpenses.filter(e => e.type === 'Essenciais').reduce((sum, e) => sum + e.amount, 0);
        const totalNonEssential = paidExpenses.filter(e => e.type === 'Não Essenciais').reduce((sum, e) => sum + e.amount, 0);

        const essentialPercent = totalIncome > 0? totalEssential / totalIncome : 0;
        const nonEssentialPercent = totalIncome > 0? totalNonEssential / totalIncome : 0;
        const reservePercent = totalIncome > 0? balance / totalIncome : 0;

        let message = feedbackMessages.find(m => m.id === 'B').text;

        if (balance < 0) message = feedbackMessages.find(m => m.id === 'F').text;
        else if (reservePercent < (reserveGoal - 0.05)) message = feedbackMessages.find(m => m.id === 'E').text;
        else if (essentialPercent > (essentialGoal + 0.05)) message = feedbackMessages.find(m => m.id === 'D').text;
        else if (nonEssentialPercent > (nonEssentialGoal + 0.05)) message = feedbackMessages.find(m => m.id === 'C').text;
        else if (reservePercent > (reserveGoal + 0.05)) message = feedbackMessages.find(m => m.id === 'A').text;
        
        feedbackEl.textContent = message;
    },

    renderSpendingGoalsChart: function(totalIncome, paidExpenses) {
        const canvas = document.getElementById('spending-goals-chart').getContext('2d');
        const totalEssential = paidExpenses.filter(e => e.type === 'Essenciais').reduce((sum, e) => sum + e.amount, 0);
        const totalNonEssential = paidExpenses.filter(e => e.type === 'Não Essenciais').reduce((sum, e) => sum + e.amount, 0);
        const reserve = Math.max(0, totalIncome - (totalEssential + totalNonEssential));

        const data = {
            labels:,
            datasets: [{
                data: [totalEssential, totalNonEssential, reserve],
                backgroundColor: ['#4a90e2', '#f5a623', '#50e3c2'],
                borderColor: '#ffffff',
                borderWidth: 2,
            }]
        };

        if (this.ui.charts.spendingGoals) {
            this.ui.charts.spendingGoals.data = data;
            this.ui.charts.spendingGoals.update();
        } else {
            this.ui.charts.spendingGoals = new Chart(canvas, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: { callbacks: { label: (context) => {
                            const value = context.raw |

| 0;
                            const percentage = totalIncome > 0? ((value / totalIncome) * 100).toFixed(1) : 0;
                            return `${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
                        }}}
                    }
                }
            });
        }
    },

    renderCategorySpendingChart: function(paidExpenses) {
        const canvas = document.getElementById('category-spending-chart').getContext('2d');
        const spendingByCategory = paidExpenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] |

| 0) + expense.amount;
            return acc;
        }, {});
        const sortedCategories = Object.entries(spendingByCategory).sort(([, a], [, b]) => b - a).slice(0, 7);

        const data = {
            labels: sortedCategories.map(item => item),
            datasets: [{
                label: 'Gasto por Categoria',
                data: sortedCategories.map(item => item[2]),
                backgroundColor: '#4a90e2',
                borderRadius: 4,
            }]
        };

        if (this.ui.charts.categorySpending) {
            this.ui.charts.categorySpending.data = data;
            this.ui.charts.categorySpending.update();
        } else {
            this.ui.charts.categorySpending = new Chart(canvas, {
                type: 'bar', data: data,
                options: {
                    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true } }
                }
            });
        }
    },

    renderAnnualSummaryChart: function() {
        const canvas = document.getElementById('annual-summary-chart').getContext('2d');
        const year = this.state.currentDate.getFullYear();
        const yearData = this.state.appData.data[year] |

| {};
        
        const months =;
        const incomeData =;
        const expenseData =;

        for (let i = 1; i <= 12; i++) {
            const monthKey = String(i).padStart(2, '0');
            const monthData = yearData[monthKey];
            incomeData.push(monthData? monthData.incomes.reduce((s, inc) => s + inc.amount, 0) : 0);
            expenseData.push(monthData? monthData.expenses.filter(e => e.isPaid).reduce((s, exp) => s + exp.amount, 0) : 0);
        }

        const data = {
            labels: months,
            datasets:
        };

        if (this.ui.charts.annualSummary) {
            this.ui.charts.annualSummary.data = data;
            this.ui.charts.annualSummary.update();
        } else {
            this.ui.charts.annualSummary = new Chart(canvas, {
                type: 'bar', data: data,
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());