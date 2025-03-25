import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import DashboardCard from "../../../components/shared/DashboardCard.js";
import { useTheme } from "@mui/material/styles";
import { getTransactionsByUser } from "../../../../backend/transactions.js";
import { getCategories } from "../../../../backend/categorie.js";

export default function PieActiveArc({ id_utilisateur }) {
  const theme = useTheme();
  const [categoriesData, setCategoriesData] = React.useState([]);

  const getCategoryData = async () => {
    try {
      // Récupérer les transactions
      const transactions = await getTransactionsByUser(id_utilisateur);

      // Récupérer les catégories pour avoir les noms
      const categoriesData = await getCategories();
      const categoriesMap = categoriesData.reduce((acc, cat) => {
        acc[cat.id_categorie] = cat.nom;
        return acc;
      }, {});

      // Calculer les totaux par catégorie
      const categoryTotals = {};
      transactions.forEach((transaction) => {
        const { id_categorie, montant } = transaction;
        if (!categoryTotals[id_categorie]) {
          categoryTotals[id_categorie] = 0;
        }
        categoryTotals[id_categorie] += Number(montant); // S'assurer que c'est un nombre
      });

      // Transformer en format pour PieChart
      const formattedData = Object.entries(categoryTotals).map(
        ([id_categorie, total]) => ({
          id: `cat-${id_categorie}`, // Clé unique
          label: categoriesMap[id_categorie] || "Inconnu",
          value: total,
          color: getCategoryColorById(parseInt(id_categorie, 10)), // Associer une couleur
        })
      );

      setCategoriesData(formattedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
    }
  };

  // Utiliser useEffect pour récupérer les données au montage du composant
  React.useEffect(() => {
    getCategoryData();
  }, [id_utilisateur]); // Redemander les données si l'ID utilisateur change

  return (
    <DashboardCard title="Revenues / Dépenses par catégorie">
      <PieChart
        series={[
          {
            data: categoriesData, // Chaque élément a un `id`, `label`, `value`, et `color`
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "blue" },
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
    1: "#1976d2", // Exemple : Revenus = Bleu
    2: "#9c27b0", // Dépenses fixes = Violet
    3: "#388e3c", // Dépenses variables = Vert
    4: "#d32f2f", // Investissements = Rouge
    5: "#fbc02d", // Épargne = Jaune
    // Ajouter d'autres couleurs si nécessaire
  };
  return colors[id_categorie] || "#000000"; // Par défaut, noir
};
