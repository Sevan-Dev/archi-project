import API_BASE_URL from "./config";

export const getObjectifsByUser = async (id_utilisateur) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=getObjectifs&id_utilisateur=${id_utilisateur}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des objectifs :", error);
        return [];
    }
};
