import API_BASE_URL from "./config.js";
import { getCategorieById } from "./categorie.js"; // Assurons-nous que tu as cette fonction dans le bon fichier

export const getTransactionsByUser = async (id_utilisateur) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/index.php?action=getTransactions&id_utilisateur=${id_utilisateur}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions :", error);
    return [];
  }
};

export const addTransaction = async (
  id_utilisateur,
  montant,
  date_transaction,
  id_categorie,
  description
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/index.php?action=addTransaction`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_utilisateur,
          montant,
          date: date_transaction, // Renommé ici
          id_categorie,
          description,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`La requête a échoué avec le statut: ${response.status}`);
    }

    const responseText = await response.text();
    if (!responseText) {
      throw new Error("La réponse du serveur est vide");
    }

    const data = JSON.parse(responseText);

    if (data.status === "success") {
      console.log("Transaction ajoutée avec succès");
    } else {
      console.error("Erreur lors de l'ajout de la transaction:", data.error);
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la transaction :", error);
    return { status: "error", message: error.message };
  }
};

export const updateTransaction = async (
  id_transaction,
  montant,
  date_transaction,
  id_categorie,
  description
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/index.php?action=updateTransaction`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_transaction,
          montant,
          date: date_transaction, // Renommé ici
          id_categorie,
          description,
        }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la modification de la transaction :", error);
    return { status: "error" };
  }
};

export const deleteTransaction = async (id_transaction) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/index.php?action=deleteTransaction&id_transaction=${id_transaction}`,
      {
        method: "GET",
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la suppression de la transaction :", error);
    return { status: "error" };
  }
};

export const getSoldeByUser = async (id_utilisateur) => {
  try {
    const transactions = await getTransactionsByUser(id_utilisateur);

    let revenus = 0;
    let depenses = 0;

    for (const transaction of transactions) {
      const montant = parseFloat(transaction.montant);
      const id_categorie = transaction.id_categorie; 
      const categorie = await getCategorieById(id_categorie); 
      if (categorie.type !== "revenu") {
        depenses += montant;
      } else {
        revenus += montant; 
      }
    }

    const solde = revenus - depenses; 
    return solde;
  } catch (error) {
    console.error("Erreur lors du calcul du solde :", error);
    return 0;
  }
};

export const getTransactionsByYear = async (id_utilisateur, year) => {
    try {
        // Récupérer toutes les transactions pour l'utilisateur
        const transactions = await getTransactionsByUser(id_utilisateur);

        // Si les transactions ne sont pas un tableau, retourner un tableau vide
        if (!Array.isArray(transactions)) {
            throw new Error("Les transactions doivent être un tableau");
        }

        // Créer un tableau pour stocker les revenus et dépenses mensuels
        let revenusParMois = Array(12).fill(0);  // Array pour les revenus (12 mois)
        let depensesParMois = Array(12).fill(0); // Array pour les dépenses (12 mois)

        // Parcourir toutes les transactions et les regrouper par mois
        transactions.forEach((transaction) => {
            const montant = parseFloat(transaction.montant);
            const date = new Date(transaction.date_transaction); // Convertir la date
            const mois = date.getMonth();  // 0 (janvier) à 11 (décembre)
            
            // Vérifier si l'année de la transaction correspond à l'année sélectionnée
            if (date.getFullYear() === parseInt(year)) {
                // Si c'est un revenu (par exemple id_categorie === 1 pour les revenus)
                if (transaction.id_categorie === 1) { 
                    revenusParMois[mois] += montant;
                } else {  // Sinon c'est une dépense
                    depensesParMois[mois] += Math.abs(montant); // Toujours prendre la valeur absolue des dépenses
                }
            }
        });

        // Retourner l'objet avec les revenus et dépenses par mois
        return {
            revenus: revenusParMois,
            depenses: depensesParMois,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions mensuelles par année:', error);
        return { revenus: Array(12).fill(0), depenses: Array(12).fill(0) };
    }
};
