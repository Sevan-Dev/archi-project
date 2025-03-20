import API_BASE_URL from "./config.js";

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

export const addTransaction = async (id_utilisateur, montant, date_transaction, id_categorie, description) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=addTransaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_utilisateur, 
                montant, 
                date: date_transaction,  // Renommé ici
                id_categorie, 
                description
            }),
        });

        if (!response.ok) {
            throw new Error(`La requête a échoué avec le statut: ${response.status}`);
        }

        const responseText = await response.text(); 
        if (!responseText) {
            throw new Error("La réponse du serveur est vide");
        }

        const data = JSON.parse(responseText);        

        if (data.status === 'success') {
            console.log('Transaction ajoutée avec succès');
        } else {
            console.error('Erreur lors de l\'ajout de la transaction:', data.error);
        }
        
        return data;

    } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction :", error);
        return { status: "error", message: error.message };
    }
};



export const updateTransaction = async (id_transaction, montant, date_transaction, id_categorie, description) => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=updateTransaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_transaction, 
                montant, 
                date: date_transaction,  // Renommé ici
                id_categorie, 
                description
            }),
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
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la suppression de la transaction :", error);
        return { status: "error" };
    }
};
