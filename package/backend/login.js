import API_BASE_URL from "./config";

export const validForm = async (email, password) => {
    try {
        const response = await fetch('https://devweb.iutmetz.univ-lorraine.fr/~brochot6u/PHP/api/index.php?action=login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.status;

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        return "error";
    }
};
