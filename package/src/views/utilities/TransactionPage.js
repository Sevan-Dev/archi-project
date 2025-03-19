import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Typography,
   Grid,
   TextField,
   Select,
   MenuItem,
   InputLabel,
   FormControl,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Menu,
   IconButton,
   CircularProgress,
} from "@mui/material";
import PageContainer from "src/components/container/PageContainer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
   getTransactionsByUser,
   addTransaction,
   updateTransaction,
   deleteTransaction,
} from "../../../backend/transactions";

import { getCategories, getCategorieById } from "../../../backend/categorie";

const TransactionPage = () => {
   const navigate = useNavigate();

   const [transactions, setTransactions] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);

   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filteredTransactions, setFilteredTransactions] = useState([]);
   const [categoryFilter, setCategoryFilter] = useState("");
   const [dateFilter, setDateFilter] = useState("");
   const [minAmountFilter, setMinAmountFilter] = useState("");
   const [maxAmountFilter, setMaxAmountFilter] = useState("");

   const [open, setOpen] = useState(false);
   const [newTransaction, setNewTransaction] = useState({
      montant: "",
      type: "Débit",
      date: "",
      description: "",
      categorie: "",
   });

   const [anchorEl, setAnchorEl] = useState(null);
   const [selectedTransaction, setSelectedTransaction] = useState(null);

   const user = JSON.parse(localStorage.getItem("user"));

   useEffect(() => {
      if (!user) {
         navigate("../auth/login");
      } else {
         fetchTransactions();
         fetchCategories();
      }
   }, [navigate]);

   const fetchTransactions = async () => {
      setLoading(true);
      try {
         const data = await getTransactionsByUser(user.id);

         const transactionsWithCategories = await Promise.all(
            data.map(async (transaction) => {
               const categorie = await getCategorieById(transaction.categorie);
               return {
                  ...transaction,
                  categorie: categorie ? categorie.nom : "Inconnu",
               };
            })
         );

         setTransactions(transactionsWithCategories);
         setFilteredTransactions(transactionsWithCategories);
      } catch (error) {
         console.error("Erreur lors du chargement des transactions :", error);
      }
      setLoading(false);
   };

   const fetchCategories = async () => {
      try {
         const data = await getCategories();
         setCategories(data);
      } catch (error) {
         console.error("Erreur lors du chargement des catégories :", error);
      }
   };

   const handleFilterChange = () => {
      let tempTransactions = [...transactions];

      if (categoryFilter) {
         tempTransactions = tempTransactions.filter(
            (t) => t.categorie === categoryFilter
         );
      }
      if (dateFilter) {
         tempTransactions = tempTransactions.filter(
            (t) => t.date_transaction === dateFilter
         );
      }
      if (minAmountFilter) {
         tempTransactions = tempTransactions.filter(
            (t) => t.montant >= parseFloat(minAmountFilter)
         );
      }
      if (maxAmountFilter) {
         tempTransactions = tempTransactions.filter(
            (t) => t.montant <= parseFloat(maxAmountFilter)
         );
      }

      setFilteredTransactions(tempTransactions);
      setPage(0);
   };

   useEffect(() => {
      handleFilterChange();
   }, [
      categoryFilter,
      dateFilter,
      minAmountFilter,
      maxAmountFilter,
      transactions,
   ]);

   const handleClickMenu = (event, transaction) => {
      setAnchorEl(event.currentTarget);
      setSelectedTransaction(transaction);
   };

   const handleCloseMenu = () => {
      setAnchorEl(null);
      setSelectedTransaction(null);
   };

   const handleDelete = async () => {
      if (selectedTransaction) {
         try {
            await deleteTransaction(selectedTransaction.id_transaction);
            fetchTransactions(); // Recharge les transactions après la suppression
         } catch (error) {
            console.error(
               "Erreur lors de la suppression de la transaction :",
               error
            );
         }
      }
      handleCloseMenu();
   };

   const handleEdit = () => {
      setNewTransaction({
         id_transaction: selectedTransaction.id_transaction,
         montant: selectedTransaction.montant,
         type: selectedTransaction.type,
         date: selectedTransaction.date_transaction,
         description: selectedTransaction.description,
         categorie: selectedTransaction.categorie,
      });
      setOpen(true);
      handleCloseMenu();
   };

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
      setNewTransaction({
         montant: "",
         type: "Débit",
         date: "",
         description: "",
         categorie: "",
      });
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewTransaction((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async () => {
      try {
         if (newTransaction.id_transaction) {
            // Mise à jour de la transaction existante
            await updateTransaction(newTransaction);
         } else {
            // Ajout d'une nouvelle transaction
            console.log({
              ...newTransaction,
              id_utilisateur: user.id,
           });
            
            await addTransaction({
               ...newTransaction,
               id_utilisateur: user.id,
            });
         }
         fetchTransactions(); // Recharge les transactions après l'ajout ou la mise à jour
         handleClose(); // Ferme la boîte de dialogue
      } catch (error) {
         console.error(
            "Erreur lors de l'ajout ou de la mise à jour de la transaction :",
            error
         );
      }
   };

   return (
      <PageContainer
         title="Transactions"
         description="Tableau des transactions"
      >
         <Grid container spacing={3}>
            <Grid item xs={12}>
               <Typography variant="h4" gutterBottom>
                  Tableau des Transactions
               </Typography>
            </Grid>
         </Grid>

         <Grid container spacing={3} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={3}>
               <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                     value={newTransaction.categorie}
                     name="categorie"
                     onChange={handleInputChange}
                  >
                     {categories.map((cat) => (
                        <MenuItem
                           key={cat.id_categorie}
                           value={cat.id_categorie}
                        >
                           {cat.nom}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
               <TextField
                  label="Date"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
               />
            </Grid>
            <Grid item xs={12} sm={3}>
               <TextField
                  label="Montant min"
                  type="number"
                  value={minAmountFilter}
                  onChange={(e) => setMinAmountFilter(e.target.value)}
                  fullWidth
               />
            </Grid>
            <Grid item xs={12} sm={3}>
               <TextField
                  label="Montant max"
                  type="number"
                  value={maxAmountFilter}
                  onChange={(e) => setMaxAmountFilter(e.target.value)}
                  fullWidth
               />
            </Grid>
         </Grid>

         <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ marginTop: 2 }}
         >
            Ajouter une transaction
         </Button>

         {loading ? (
            <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
         ) : (
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
               <Table>
                  <TableHead>
                     <TableRow sx={{ backgroundColor: "#5d87ff" }}>
                        <TableCell sx={{ color: "white" }}>Montant</TableCell>
                        <TableCell sx={{ color: "white" }}>Type</TableCell>
                        <TableCell sx={{ color: "white" }}>Date</TableCell>
                        <TableCell sx={{ color: "white" }}>
                           Description
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>Catégorie</TableCell>
                        <TableCell sx={{ color: "white" }} />
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {filteredTransactions
                        .slice(
                           page * rowsPerPage,
                           page * rowsPerPage + rowsPerPage
                        )
                        .map((t) => (
                           <TableRow key={t.id_transaction}>
                              <TableCell>{t.montant} €</TableCell>
                              <TableCell>{t.type}</TableCell>
                              <TableCell>{t.date_transaction}</TableCell>
                              <TableCell>{t.description}</TableCell>
                              <TableCell>{t.categorie}</TableCell>
                              <TableCell>
                                 <IconButton
                                    onClick={(e) => handleClickMenu(e, t)}
                                 >
                                    <MoreVertIcon />
                                 </IconButton>
                                 <Menu
                                    anchorEl={anchorEl}
                                    open={
                                       Boolean(anchorEl) &&
                                       selectedTransaction === t
                                    }
                                    onClose={handleCloseMenu}
                                 >
                                    <MenuItem onClick={handleEdit}>
                                       Modifier
                                    </MenuItem>
                                    <MenuItem onClick={handleDelete}>
                                       Supprimer
                                    </MenuItem>
                                 </Menu>
                              </TableCell>
                           </TableRow>
                        ))}
                  </TableBody>
               </Table>
            </TableContainer>
         )}

         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
               {newTransaction.id_transaction
                  ? "Modifier la transaction"
                  : "Ajouter une transaction"}
            </DialogTitle>
            <DialogContent>
               <TextField
                  label="Montant"
                  type="number"
                  name="montant"
                  value={newTransaction.montant}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
               />
               <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  InputLabelProps={{ shrink: true }}
               />
               <TextField
                  label="Description"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
               />
               <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                     value={newTransaction.categorie}
                     name="categorie"
                     onChange={handleInputChange}
                  >
                     {categories.map((cat) => (
                        <MenuItem
                           key={cat.id_categorie}
                           value={cat.id_categorie}
                        >
                           {cat.nom}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Annuler</Button>
               <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
               >
                  {newTransaction.id_transaction ? "Modifier" : "Ajouter"}
               </Button>
            </DialogActions>
         </Dialog>
      </PageContainer>
   );
};

export default TransactionPage;
