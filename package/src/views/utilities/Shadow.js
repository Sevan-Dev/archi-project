import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Grid, Avatar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AttachMoney, CarRepair, FlightTakeoff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getObjectifsByUser, addObjectif, deleteObjectif, updateObjectif } from '../../../backend/objectifs'; // Assurez-vous de bien importer
import { useNavigate } from 'react-router-dom';

const FinancialGoalCard = ({ goal, onDelete, onEdit }) => {
  const progress = (goal.montant_actuel / goal.montant_cible) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card sx={{ maxWidth: 345, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Avatar sx={{ backgroundColor: 'primary.main', marginRight: 2 }}>
              {goal.nom_objectif === 'Vacances été' ? <FlightTakeoff /> : goal.nom_objectif === 'Voiture' ? <CarRepair /> : <AttachMoney />}
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {goal.nom_objectif}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Actuellement : {goal.montant_actuel}€ | Prix : {goal.montant_cible}€
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: progress >= 100 ? 'success.main' : 'primary.main',
                },
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ marginTop: 1 }}>
            {Math.round(progress)}% atteint
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Button variant="outlined" color="primary" onClick={() => onEdit(goal)}>Modifier</Button>
            <Button variant="outlined" color="error" onClick={() => onDelete(goal.id_objectif)} sx={{ marginLeft: 1 }}>Supprimer</Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FinancialGoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nom_objectif: '',
    montant_cible: '',
    montant_actuel: 0,
    date_limite: ''
  });
  const [editingGoal, setEditingGoal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("../auth/login");
    } else {
      setUserId(user.id);
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      const fetchGoals = async () => {
        const data = await getObjectifsByUser(userId);
        setGoals(data);
      };
      fetchGoals();
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddGoal = async () => {
    const result = await addObjectif(userId, formData.nom_objectif, formData.montant_cible, formData.date_limite);
    if (!result.error) {
      setOpenDialog(false);
      setFormData({ nom_objectif: '', montant_cible: '', montant_actuel: 0, date_limite: '' });
      setGoals(await getObjectifsByUser(userId)); 
    }
  };

  const handleEditGoal = async () => {
    const result = await updateObjectif(editingGoal.id_objectif, formData.nom_objectif, formData.montant_cible, formData.montant_actuel, formData.date_limite);
    if (!result.error) {
      setOpenDialog(false);
      setEditingGoal(null);
      setFormData({ nom_objectif: '', montant_cible: '', montant_actuel: 0, date_limite: '' });
      setGoals(await getObjectifsByUser(userId));
    }
  };

  const handleDeleteGoal = async (id) => {
    const result = await deleteObjectif(id);
    if (!result.error) {
      setGoals(await getObjectifsByUser(userId));
    }
  };

  const openAddDialog = () => {
    setOpenDialog(true);
    setEditingGoal(null);
    setFormData({ nom_objectif: '', montant_cible: '', montant_actuel: 0, date_limite: '' });
  };

  const openEditDialog = (goal) => {
    setOpenDialog(true);
    setEditingGoal(goal);
    setFormData({
      nom_objectif: goal.nom_objectif,
      montant_cible: goal.montant_cible,
      montant_actuel: goal.montant_actuel,
      date_limite: goal.date_limite
    });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={openAddDialog} sx={{ marginBottom: 3 }}>
        Ajouter un objectif
      </Button>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {goals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal.id_objectif}>
            <FinancialGoalCard
              goal={goal}
              onDelete={handleDeleteGoal}
              onEdit={openEditDialog}
            />
          </Grid>
        ))}
      </Grid>

      {/* Dialog de formulaire */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingGoal ? 'Modifier l\'objectif' : 'Ajouter un objectif'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom de l'objectif"
            name="nom_objectif"
            value={formData.nom_objectif}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Montant cible"
            name="montant_cible"
            value={formData.montant_cible}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Montant actuel"
            name="montant_actuel"
            value={formData.montant_actuel}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date limite"
            name="date_limite"
            value={formData.date_limite}
            onChange={handleChange}
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={editingGoal ? handleEditGoal : handleAddGoal} color="primary">
            {editingGoal ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FinancialGoalsPage;
