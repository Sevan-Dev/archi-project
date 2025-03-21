import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import DashboardCard from "../../../components/shared/DashboardCard.js";
import { useTheme } from "@mui/material/styles";
import { getTransactionsByUser } from "../../../../backend/transactions.js";  // Assurez-vous que cette fonction existe et fonctionne correctement
import { getCategories } from "../../../../backend/categorie.js";  // Pour récupérer les catégories si nécessaire

export default function PieActiveArc({ id_utilisateur }) {
  const theme = useTheme();
  const [categoriesData, setCategoriesData] = React.useState([]);  // État pour stocker les données par catégorie

  // Fonction pour récupérer et traiter les transactions
  const getCategoryData = async () => {
    try {
      // Récupérer les transactions de l'utilisateur
      const transactions = await getTransactionsByUser(id_utilisateur);
      console.log("Transactions récupérées : ", transactions);  // Vérification des données

      // Récupérer les catégories (si nécessaire pour les noms ou couleurs)
      const categoriesData = await getCategories();
      const categoriesMap = categoriesData.reduce((acc, cat) => {
        acc[cat.id_categorie] = cat.nom;
        return acc;
      }, {});

      // Calculer le total des montants par catégorie
      const categoryTotals = {};
      transactions.forEach(transaction => {
        const { id_categorie, montant } = transaction;
        if (categoryTotals[id_categorie]) {
          categoryTotals[id_categorie] += montant;
        } else {
          categoryTotals[id_categorie] = montant;
        }
      });

      // Convertir les totaux par catégorie en format compatible avec le graphique
      const formattedData = Object.keys(categoryTotals).map(id_categorie => {
        const categoryName = categoriesMap[id_categorie] || "Inconnu";
        const color = getCategoryColorById(id_categorie);  // Fonction pour obtenir la couleur associée

        return {
          label: categoryName,
          value: categoryTotals[id_categorie],
          color: color,  // Appliquer la couleur associée
        };
      });

      setCategoriesData(formattedData);

    } catch (error) {
      console.error("Erreur lors de la récupération des transactions : ", error);
    }
  };

  // Utiliser useEffect pour récupérer les données au montage du composant
  React.useEffect(() => {
    getCategoryData();
  }, [id_utilisateur]);  // Redemander les données si l'ID utilisateur change

  return (
    <DashboardCard title="Revenues / Dépenses par catégorie">
      <PieChart
        series={[
          {
            data: categoriesData,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "blue" },
            color: categoriesData.map(item => item.color),  // Appliquer les couleurs du thème
          },
        ]}
        height={400}
      />
    </DashboardCard>
  );
}

// Exemple de fonction pour obtenir une couleur en fonction de l'ID de catégorie
const getCategoryColorById = (id_categorie) => {
  const colors = {
    1: "#1976d2",  // Exemple : Revenus = Bleu
    2: "#9c27b0",  // Dépenses fixes = Violet
    3: "#388e3c",  // Dépenses variables = Vert
    4: "#d32f2f",  // Investissements = Rouge
    5: "#fbc02d",  // Épargne = Jaune
    // Ajouter d'autres couleurs si nécessaire
  };
  return colors[id_categorie] || "#000000";  // Par défaut, noir
};
