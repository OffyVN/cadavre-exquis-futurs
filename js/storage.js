/**
 * Cadavre Exquis des Futurs — Storage
 * Gestion de la persistence localStorage
 */

const STORAGE_PREFIX = 'cadavre_exquis_';

const Storage = {
    /**
     * Sauvegarde une réponse de formulaire
     */
    saveResponse(token, data) {
        const key = STORAGE_PREFIX + 'response_' + token;
        const payload = {
            ...data,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(payload));
        return payload;
    },

    /**
     * Charge une réponse sauvegardée
     */
    loadResponse(token) {
        const key = STORAGE_PREFIX + 'response_' + token;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    /**
     * Marque une réponse comme soumise
     */
    submitResponse(token, data) {
        const payload = {
            ...data,
            submittedAt: new Date().toISOString()
        };
        return this.saveResponse(token, payload);
    },

    /**
     * Vérifie si une réponse a été soumise
     */
    isSubmitted(token) {
        const response = this.loadResponse(token);
        return response && response.submittedAt;
    },

    /**
     * Efface une réponse
     */
    clearResponse(token) {
        const key = STORAGE_PREFIX + 'response_' + token;
        localStorage.removeItem(key);
    }
};
