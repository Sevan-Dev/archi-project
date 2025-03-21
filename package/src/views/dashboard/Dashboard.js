import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import MonthlyEarnings from './components/MonthlyEarnings';
import ProductPerformance from './components/ProductPerformance';
import PieActiveArc from "./components/PieChartActive";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("../auth/login");
    } else {
      setUserId(user.id);  // On récupère l'ID de l'utilisateur
    }
  }, [navigate]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {userId && <PieActiveArc id_utilisateur={userId} />} 
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <SalesOverview />
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
