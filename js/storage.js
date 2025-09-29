const storage = {
    /**
     * Carrega os dados da aplicação do localStorage.
     * Se não houver dados, inicializa com uma estrutura padrão.
     * @returns {object} Os dados da aplicação (configurações e transações).
     */
    loadData: function() {
        const dataString = localStorage.getItem('financeApp_data');
        if (dataString) {
            return JSON.parse(dataString);
        } else {
            // Retorna uma estrutura de dados inicial se nada for encontrado
            return {
                settings: {},
                data: {}
            };
        }
    },

    /**
     * Salva o objeto de dados completo da aplicação no localStorage.
     * @param {object} appData - O objeto de dados completo da aplicação.
     */
    saveData: function(appData) {
        try {
            const dataString = JSON.stringify(appData);
            localStorage.setItem('financeApp_data', dataString);
        } catch (error) {
            console.error("Erro ao salvar os dados no localStorage:", error);
            alert("Não foi possível salvar os dados. O armazenamento pode estar cheio ou desativado.");
        }
    }
};