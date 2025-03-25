import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowUpRight, IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from '../../../components/shared/DashboardCard';
import { getSoldeByUser } from '../../../../backend/transactions'; // Import de la fonction

const MonthlyEarnings = ({ id_utilisateur }) => {
  const theme = useTheme();
  const [solde, setSolde] = useState(0);

  useEffect(() => {
    const fetchSolde = async () => {
      const soldeActuel = await getSoldeByUser(id_utilisateur);
      setSolde(soldeActuel);
    };

    fetchSolde();
  }, [id_utilisateur]);

  return (
    <DashboardCard
      title="Solde actuel"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
    >
      <>
        <Typography variant="h3" fontWeight="700">
          {solde.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </Typography>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
