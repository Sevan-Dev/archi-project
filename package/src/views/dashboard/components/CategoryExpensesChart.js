import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import { IconArrowDownRight, IconCurrencyDollar } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";
import { margin, padding } from "@mui/system";

const CategoryExpensesChart = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const errorlight = "#fdede8";

  // chart options
  const optionspiechart = {
    chart: {
      type: "pie",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      }
    },
    labels: ["Alimentation", "Loyer", "Loisirs"],
    colors: [primary, secondary, "#96BCFF"],
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      y: {
        formatter: (value) => `$${value}`,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      itemMargin: {
        vertical: 5,
      },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        expandOnClick: true,
        customScale: 0.9,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
  };

  // chart data
  const seriespiechart = [35, 15, 10];

  return (
    <DashboardCard
      title="Dépenses par Catégorie"
      footer={
        <Chart
          options={optionspiechart}
          series={seriespiechart}
          type="pie"
          height="280px"
        />
      }
    >
      <Typography variant="h3" fontWeight="700" mt="-20px">
        $6,820
      </Typography>
    </DashboardCard>
  );
};

export default CategoryExpensesChart;
