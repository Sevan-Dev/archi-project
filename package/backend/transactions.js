import API_BASE_URL from "./config";

export const getTransactionsByUser = async (id_utilisateur) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=getTransactions&id_utilisateur=${id_utilisateur}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des transactions :", error);
        return [];
    }
};

export const addTransaction = async (transaction) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=addTransaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction),
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction :", error);
        return { status: "error" };
    }
};

export const updateTransaction = async (transaction) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=updateTransaction`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction),
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la modification de la transaction :", error);
        return { status: "error" };
    }
};

export const deleteTransaction = async (id_transaction) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=deleteTransaction&id_transaction=${id_transaction}`, {
            method: "DELETE",
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la suppression de la transaction :", error);
        return { status: "error" };
    }
};
