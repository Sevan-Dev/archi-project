import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import PageContainer from "src/components/container/PageContainer";

// components
import SalesOverview from "./components/SalesOverview";
import MonthlyEarnings from "./components/MonthlyEarnings";
import PieActiveArc from "./components/PieChartActive";
import LinearChart from "./components/LinearChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("../auth/login");
    } else {
      setUserId(user.id); // On récupère l'ID de l'utilisateur
    }
  }, [navigate]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          {/* Graphique Pie à gauche */}
          <Grid item xs={12} lg={8}>
            {userId && <PieActiveArc id_utilisateur={userId} />}
          </Grid>
          {/* Section à droite pour les autres graphiques */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* Premier graphique (par exemple Monthly Earnings) */}
              <Grid item xs={12}>
                {userId && <MonthlyEarnings id_utilisateur={userId} />}
              </Grid>
              {/* Deuxième graphique (par exemple LinearChart) */}
              <Grid item xs={12}>
                {userId && <LinearChart id_utilisateur={userId} />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
