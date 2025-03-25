import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import { getTransactionsByYear } from '../../../../backend/transactions.js'; // Fonction à appeler

const SalesOverview = ({ id_utilisateur }) => {
    // State
    const [year, setYear] = useState('2025'); // Année par défaut
    const [revenus, setRevenus] = useState([]);
    const [depenses, setDepenses] = useState([]);

    const handleYearChange = (event) => {
        setYear(event.target.value);  // Met à jour l'année
    };

    // Chart colors
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // Chart options
    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },

        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ],
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };

    // Utilisation de la fonction getTransactionsByYear dans useEffect
    useEffect(() => {
        const fetchTransactions = async () => {
            const { revenus, depenses } = await getTransactionsByYear(id_utilisateur, year);

            // Vérification que les données sont valides
            if (Array.isArray(revenus) && Array.isArray(depenses)) {
                setRevenus(revenus);
                setDepenses(depenses);
            } else {
                console.error("Les données des transactions sont invalides.");
            }
        };

        fetchTransactions();
    }, [year, id_utilisateur]);  // Rechargement des données lorsque l'année change

    // Data pour le graphique
    const seriescolumnchart = [
        {
            name: 'Revenus ce mois-ci',
            data: revenus,
        },
        {
            name: 'Dépenses ce mois-ci',
            data: depenses,
        },
    ];

    // Générer des années dynamiques
    const years = [];
    for (let i = 2020; i <= 2025; i++) {
        years.push(i);
    }

    return (
        <DashboardCard title="Revenus / Dépenses Annuels" action={
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="year-select-label">Année</InputLabel>
                <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={year}
                    onChange={handleYearChange}
                    size="small"
                >
                    {years.map((yearOption) => (
                        <MenuItem key={yearOption} value={yearOption}>
                            {yearOption}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        }>
            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="370px"
            />
        </DashboardCard>
    );
};

export default SalesOverview;
