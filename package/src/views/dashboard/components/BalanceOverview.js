import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';

const BalanceOverview = () => {

  // Select dropdown for choosing month
  const [month, setMonth] = React.useState('1');
  const handleChange = (event) => setMonth(event.target.value);

  // Chart colors
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;

  // Chart options with modern features
  const options = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 400,
      events: {
        legendMouseover: function (chartContext, seriesIndex, config) {
          chartContext.triggerSeries(seriesIndex); // Highlight series on legend hover
        },
        legendMouseout: function (chartContext, seriesIndex, config) {
          chartContext.resetSeries(); // Reset the series when mouse leaves the legend
        },
      },
    },
    colors: [primary, secondary, success, warning], // More colors for different series
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        columnWidth: '45%',
        borderRadius: 10,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: true,
      width: 2,
      lineCap: 'round',
      colors: ['transparent'],
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'], // White text for labels
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      itemMargin: {
        horizontal: 15,
      },
    },
    grid: {
      show: true,
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Mois',
        style: {
          color: '#adb0bb',
          fontSize: '14px',
        },
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: true,
      y: {
        formatter: (val) => `$${val}`, // Add currency symbol
      },
    },
    animation: {
      enabled: true,
      easing: 'easeInOutQuad',
      speed: 500,
    },
  };

  // Chart data for Solde Actuel and Solde Disponible
  const series = [
    {
      name: 'Solde Actuel',
      data: [1200, 1400, 1600, 1800, 2200, 2500, 3000],
    },
    {
      name: 'Solde Disponible',
      data: [1000, 1300, 1500, 1600, 1900, 2200, 2700],
    },
  ];

  return (
    <DashboardCard
      title="Solde Actuel / Solde Disponible"
      action={
        <Select labelId="month-dd" id="month-dd" value={month} size="small" onChange={handleChange}>
          <MenuItem value={1}>January 2025</MenuItem>
          <MenuItem value={2}>February 2025</MenuItem>
          <MenuItem value={3}>March 2025</MenuItem>
        </Select>
      }
    >
      <Chart options={options} series={series} type="bar" height="400px" />
    </DashboardCard>
  );
};

export default BalanceOverview;