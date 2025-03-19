import API_BASE_URL from "./config.js";

export const validForm = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.status === "success") {
            // Stocker l'utilisateur en localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data.status;
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        return "error";
    }
};
