// Firebase Configuration Module
const firebaseConfig = {
    init: () => {
        firebase.initializeApp({
            apiKey: 'sua-api-key',
            authDomain: 'seu-projeto.firebaseapp.com',
            databaseURL: 'https://seu-projeto.firebaseio.com',
            projectId: 'seu-projeto'
        });
    },
    auth: () => firebase.auth(),
    db: () => firebase.database()
};

// UI Utilities Module
const UI = {
    showToast: (msg, type = 'info') => {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.className = `toast toast-`{type}`;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 2500);
    },
    formatCurrency: (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
    showModal: (id) => document.getElementById(id)?.showModal(),
    closeModal: (id) => document.getElementById(id)?.close()
};

export { firebaseConfig, UI };
