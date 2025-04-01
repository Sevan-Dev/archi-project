  import React, { useEffect, useState } from "react";
  import {
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box,
    Grid,
    Avatar,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
  import { AttachMoney, CarRepair, FlightTakeoff } from "@mui/icons-material";
  import {
    getObjectifsByUser,
    addObjectif,
    deleteObjectif,
    updateObjectif,
    updateObjectifAmount,
  } from "../../../backend/objectifs"; // Assurez-vous de bien importer
  import { useNavigate } from "react-router-dom";

  const FinancialGoalCard = ({ goal, onDelete, onEdit, onUpdateAmount }) => {
    const progress = (goal.montant_actuel / goal.montant_cible) * 100;

    return (
      <Card
        sx={{ maxWidth: 345, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Avatar sx={{ backgroundColor: "primary.main", marginRight: 2 }}>
              {goal.nom_objectif === "Vacances été" ? (
                <FlightTakeoff />
              ) : goal.nom_objectif === "Voiture" ? (
                <CarRepair />
              ) : (
                <AttachMoney />
              )}
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
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
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    progress >= 100 ? "success.main" : "primary.main",
                },
              }}
            />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ marginTop: 1 }}
          >
            {Math.round(progress)}% atteint
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onEdit(goal)}
            >
              Modifier
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onDelete(goal.id_objectif)}
              sx={{ marginLeft: 1 }}
            >
              Supprimer
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => onUpdateAmount(goal)}
              sx={{ marginLeft: 1 }}
            >
              Montant
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const FinancialGoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [userId, setUserId] = useState(null);
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false); // Dialog pour ajouter/éditer un objectif
    const [openUpdateAmountDialog, setOpenUpdateAmountDialog] = useState(false); // Dialog pour mettre à jour le montant
    const [formData, setFormData] = useState({
      nom_objectif: "",
      montant_cible: "",
      montant_actuel: 0,
      date_limite: "",
    });
    const [editingGoal, setEditingGoal] = useState(null);
    const [updateAmount, setUpdateAmount] = useState("");
    let actionType = ""; // 'add' pour ajouter, 'subtract' pour retirer
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
        [e.target.name]: e.target.value,
      });
    };

    const handleAddGoal = async () => {
      const result = await addObjectif(
        userId,
        formData.nom_objectif,
        formData.montant_cible,
        formData.date_limite
      );
      if (!result.error) {
        setOpenAddEditDialog(false);
        setFormData({
          nom_objectif: "",
          montant_cible: "",
          montant_actuel: 0,
          date_limite: "",
        });
        setGoals(await getObjectifsByUser(userId));
      }
    };

    const handleEditGoal = async () => {
      const result = await updateObjectif(
        editingGoal.id_objectif,
        formData.nom_objectif,
        formData.montant_cible,
        formData.date_limite
      );
      if (!result.error) {
        setOpenAddEditDialog(false);
        setEditingGoal(null);
        setFormData({
          nom_objectif: "",
          montant_cible: "",
          montant_actuel: 0,
          date_limite: "",
        });
        setGoals(await getObjectifsByUser(userId));
      } else {
        console.error("Error updating goal:", result.error);
      }
    };

    const handleDeleteGoal = async (id) => {
      const result = await deleteObjectif(id);
      if (!result.error) {
        setGoals(await getObjectifsByUser(userId));
      } else {
        console.error("Error deleting goal:", result.error);
      }
    };

    const openAddDialog = () => {
      setOpenAddEditDialog(true);
      setEditingGoal(null);
      setFormData({
        nom_objectif: "",
        montant_cible: "",
        montant_actuel: 0,
        date_limite: "",
      });
    };

    const openEditDialog = (goal) => {
      setOpenAddEditDialog(true);
      setEditingGoal(goal);
      setFormData({
        nom_objectif: goal.nom_objectif,
        montant_cible: goal.montant_cible,
        montant_actuel: goal.montant_actuel,
        date_limite: goal.date_limite,
      });
    };

    const handleEditGoalAmount = async (goal) => {
      console.log('handleEditGoalAmount appelé pour l\'objectif:', goal); // Vérification de l'objectif passé en paramètre
      
      const parsedAmount = parseFloat(updateAmount);
      console.log('Montant à ajouter ou retirer:', parsedAmount); // Vérification du montant
      console.log(actionType);
      
      let estPositif = actionType === 'add';
      console.log('estPositif:', estPositif); // Vérification si l'action est "ajouter" ou "retirer"
    
      try {
        const result = await updateObjectifAmount(goal.id_objectif, goal.montant_actuel, parsedAmount, estPositif);
        console.log('Réponse de updateObjectifAmount:', result); // Vérification de la réponse de la mise à jour
        if (!result.error) {
          setGoals(await getObjectifsByUser(userId));
          setUpdateAmount('');
          actionType = 'add'; // Réinitialisation après l'opération
          setOpenUpdateAmountDialog(false); // Fermeture de la modale après la mise à jour
        } else {
          console.error('Erreur lors de la mise à jour:', result.error);
          alert(result.error);
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du montant:', error); // Vérification des erreurs
        alert('Erreur lors de la mise à jour du montant');
      }
    };
    

    const handleUpdateAmount = async (goal) => {
      const parsedAmount = parseFloat(updateAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Veuillez entrer un montant valide.");
        return;
      }

      let estPositif = actionType === "add"; // 'add' pour ajouter, 'subtract' pour retirer

      try {
        const result = await updateObjectifAmount(
          goal.id_objectif,
          goal.montant_actuel,
          parsedAmount,
          estPositif
        );
        if (!result.error) {
          setGoals(await getObjectifsByUser(userId));
          setUpdateAmount("");
          setActionType("add"); // Reset to 'add' after operation
          setOpenUpdateAmountDialog(false); // Close the dialog after updating
        } else {
          alert(result.error);
        }
      } catch (error) {
        alert("Erreur lors de la mise à jour du montant");
      }
    };

    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={openAddDialog}
          sx={{ marginBottom: 3 }}
        >
          Ajouter un objectif
        </Button>
        <Grid container spacing={3} sx={{ padding: 3 }}>
          {goals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal.id_objectif}>
              <FinancialGoalCard
                goal={goal}
                onDelete={handleDeleteGoal}
                onEdit={openEditDialog}
                onUpdateAmount={() => {
                  setOpenUpdateAmountDialog(true);
                  setEditingGoal(goal);
                  setUpdateAmount("");
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Dialog pour ajouter/modifier un objectif */}
        <Dialog
          open={openAddEditDialog}
          onClose={() => setOpenAddEditDialog(false)}
        >
          <DialogTitle>
            {editingGoal ? "Modifier l'objectif" : "Ajouter un objectif"}
          </DialogTitle>
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
            <Button onClick={() => setOpenAddEditDialog(false)} color="primary">
              Annuler
            </Button>
            <Button
              onClick={editingGoal ? handleEditGoal : handleAddGoal}
              color="primary"
            >
              {editingGoal ? "Modifier" : "Ajouter"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour mettre à jour le montant */}
        <Dialog
          open={openUpdateAmountDialog}
          onClose={() => setOpenUpdateAmountDialog(false)}
        >
          <DialogTitle>Mettre à jour le montant</DialogTitle>
          <DialogContent>
            <TextField
              label="Montant à ajouter ou retirer"
              value={updateAmount}
              onChange={(e) => setUpdateAmount(e.target.value)}
              fullWidth
              type="number"
            />
  <Box sx={{ marginTop: 2 }}>
    <Button
      variant="contained"
      color="success"
      onClick={() => {
        console.log('Bouton Ajouter cliqué');
        actionType = 'add'; // définit l'action à "ajouter"
        console.log('Action Type:', actionType);
        handleEditGoalAmount(editingGoal); // appelle la fonction pour ajouter le montant
      }}
      sx={{ marginRight: 2 }}
    >
      Ajouter
    </Button>
    <Button
      variant="contained"
      color="error"
      onClick={() => {
        console.log('Bouton Retirer cliqué');
        actionType = 'subtract'; // définit l'action à "retirer"
        console.log('Action Type:', actionType);
        handleEditGoalAmount(editingGoal); // appelle la fonction pour retirer le montant
      }}
    >
      Retirer
    </Button>
  </Box>

          </DialogContent>
        </Dialog>
      </>
    );
  };

  export default FinancialGoalsPage;
