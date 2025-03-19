import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
} from "@mui/material";
import PageContainer from "src/components/container/PageContainer";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"; // Utilisation de Recharts pour les graphiques

const BudgetGoalPage = () => {
  const [budgets, setBudgets] = useState({});
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  const categories = ["Alimentation", "Logement", "Loisirs", "Transports", "Autres"]; // Catégories possibles pour les budgets

  useEffect(() => {
    // Ici, vous pouvez charger les objectifs et budgets existants depuis votre API ou votre base de données.
    setLoading(false); // Simulation de la fin du chargement
  }, []);

  const handleSubmitBudget = () => {
    if (selectedCategory && budgetAmount) {
      setBudgets((prev) => ({
        ...prev,
        [selectedCategory]: budgetAmount,
      }));
      setBudgetAmount("");
      setSelectedCategory("");
    }
  };

  const handleSubmitGoal = () => {
    if (goalAmount) {
      setGoals((prev) => [...prev, { goal: goalAmount, progress: 0 }]); // Exemple avec un objectif d'épargne sans progression réelle
      setGoalAmount("");
    }
  };

  // Exemple de données pour les graphiques de suivi des budgets
  const budgetData = [
    { category: "Alimentation", budget: 300, spent: 200 },
    { category: "Logement", budget: 1000, spent: 950 },
    { category: "Loisirs", budget: 200, spent: 150 },
    { category: "Transports", budget: 100, spent: 80 },
  ];

  return (
    <PageContainer title="Gestion des Budgets et Objectifs" description="Suivi des budgets et des objectifs d'épargne">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Définir un Budget
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="category-label">Catégorie</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Montant du Budget"
            type="number"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            fullWidth
            sx={{ marginTop: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitBudget}
            sx={{ marginTop: 2 }}
          >
            Ajouter un Budget
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Suivi des Objectifs d'Épargne
          </Typography>
          <TextField
            label="Montant de l'Objectif"
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmitGoal}
            sx={{ marginBottom: 2 }}
          >
            Ajouter un Objectif
          </Button>

          {goals.map((goal, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">Objectif : {goal.goal} €</Typography>
                <Typography>Progression : {goal.progress} €</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Suivi des Budgets
          </Typography>
          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="budget" fill="#8884d8" />
                <Bar dataKey="spent" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default BudgetGoalPage;
