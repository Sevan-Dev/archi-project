import API_BASE_URL from "./config.js";

export const getBudgetByUser = async (id_utilisateur) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=getBudget&id_utilisateur=${id_utilisateur}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération du budget :", error);
        return {};
    }
};
