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

    // Chart options (Area chart)
    const optionsAreaChart = {
        chart: {
            type: 'area',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            height: '100%', // Zone carrée
            width: '100%',  // S'adapte à la zone
            toolbar: {
                show: true,  // Affiche la barre d'outils
                tools: {
                    zoomin: false,    // Désactive le bouton zoom-in
                    zoomout: false,   // Désactive le bouton zoom-out
                    pan: false,       // Désactive le bouton pan (main)
                    reset: false,     // Désactive le bouton de réinitialisation (maison)
                    zoom: false,      // Désactive le bouton zoom
                    toggleFullscreen: false, // Désactive le bouton plein écran
                    print: false,     // Désactive le bouton imprimer
                    download: true,   // Garde le bouton télécharger
                },
            },
        },
        colors: [primary, secondary],
        stroke: {
            width: 3,
            curve: 'smooth', // Lignes courbes pour plus de fluidité
        },
        fill: {
            type: 'gradient', // Remplissage en dégradé sous la courbe
            gradient: {
                shadeIntensity: 0.3,
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
        },
        markers: {
            size: 4,
            colors: ['#fff'],
            strokeColors: [primary, secondary],
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
            position: 'bottom', // Légende en bas
            horizontalAlign: 'center', // Centré
            offsetX: 0, // Décalage horizontal pour ajuster la position si nécessaire
            offsetY: 10, // Décalage vertical pour éloigner la légende du graphique
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

    // Data pour le graphique en aires
    const seriesAreaChart = [
        {
            name: 'Revenus',
            data: revenus,
        },
        {
            name: 'Dépenses',
            data: depenses,
        },
    ];

    // Générer des années dynamiques
    const years = [];
    for (let i = 2020; i <= 2025; i++) {
        years.push(i);
    }

    return (
        <DashboardCard title="Évolution Mensuelle" action={
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
                options={optionsAreaChart}
                series={seriesAreaChart}
                type="area"
                height="283px"  // Taille définie pour le graphique
            />
        </DashboardCard>
    );
};

export default SalesOverview;
