import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import DashboardCard from "../../../components/shared/DashboardCard.js";
import { useTheme } from "@mui/material/styles"; // Importer useTheme

export default function PieActiveArc() {
  const theme = useTheme(); // Utiliser useTheme pour accéder au thème
  const desktopOS = [
    {
      label: "Windows",
      value: 72.72,
      color: theme.palette.primary.main, // Utilisation de la couleur primaire par défaut
    },
    {
      label: "OS X",
      value: 16.38,
      color: theme.palette.secondary.main, // Utilisation de la couleur secondaire par défaut
    },
    {
      label: "Linux",
      value: 3.83,
      color: theme.palette.success.main, // Utilisation de la couleur de succès par défaut
    },
    {
      label: "Chrome OS",
      value: 2.42,
      color: theme.palette.error.main, // Utilisation de la couleur d'erreur par défaut
    },
    {
      label: "Other",
      value: 4.65,
      color: theme.palette.warning.main, // Utilisation de la couleur d'avertissement par défaut
    },
  ];

  return (
    <DashboardCard title="Revenues / Dépenses par catégorie">
      <PieChart
        series={[
          {
            data: desktopOS,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "blue" },
            color: desktopOS.map(item => item.color), // Appliquer les couleurs du thème
          },
        ]}
        height={400}
      />
    </DashboardCard>
  );
}
