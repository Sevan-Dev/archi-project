import API_BASE_URL from "./config";

export const registerUser = async (nom, prenom, email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=register`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, prenom, email, password })
        });

        const data = await response.json();

        if (data.status === "success") {
            // Stocker l'utilisateur en localStorage après inscription réussie
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data.status;
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return "error";
    }
};
