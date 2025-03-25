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
   CircularProgress,
   TablePagination,
} from "@mui/material";
import PageContainer from "src/components/container/PageContainer";
import {
   getTransactionsByUser,
   addTransaction,
   updateTransaction,
   deleteTransaction,
} from "../../../backend/transactions";
import { getCategories } from "../../../backend/categorie";

const TransactionPage = () => {
   const navigate = useNavigate();
   const [transactions, setTransactions] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);

   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [filteredTransactions, setFilteredTransactions] = useState([]);
   const [categoryFilter, setCategoryFilter] = useState("");
   const [yearFilter, setYearFilter] = useState(""); // Filtre pour l'année
   const [monthFilter, setMonthFilter] = useState(""); // Filtre pour le mois
   const [minAmountFilter, setMinAmountFilter] = useState("");
   const [maxAmountFilter, setMaxAmountFilter] = useState("");

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
         const categoriesData = await getCategories();

         const categoriesMap = {};
         categoriesData.forEach((cat) => {
            categoriesMap[cat.id_categorie] = cat.nom;
         });

         const categoriesTypeMap = {};
         categoriesData.forEach((cat) => {
            categoriesTypeMap[cat.id_categorie] = cat.type;
         });

         const transactionsWithCategories = data.map((transaction) => ({
            ...transaction,
            type: categoriesTypeMap[transaction.id_categorie] || "Inconnu",
            categorie: categoriesMap[transaction.id_categorie] || "Inconnu",
         }));

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
            (t) => t.id_categorie === categoryFilter
         );
      }

      if (yearFilter) {
         tempTransactions = tempTransactions.filter(
            (t) => new Date(t.date_transaction).getFullYear() === parseInt(yearFilter)
         );
      }

      if (monthFilter) {
         tempTransactions = tempTransactions.filter(
            (t) => new Date(t.date_transaction).getMonth() + 1 === parseInt(monthFilter)
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
      setPage(0);  // Reset page to 0 when filter changes
   };

   useEffect(() => {
      handleFilterChange();
   }, [
      categoryFilter,
      yearFilter,
      monthFilter,
      minAmountFilter,
      maxAmountFilter,
      transactions,
   ]);

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   return (
      <PageContainer title="Transactions" description="Tableau des transactions">
         <Grid container spacing={3}>
            <Grid item xs={12}>
               <Typography variant="h4" gutterBottom>
                  Tableau des Transactions
               </Typography>
            </Grid>
         </Grid>

         {/* Filter controls */}
         <Grid container spacing={3} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={3}>
               <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                     value={categoryFilter}
                     name="categorie"
                     onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                     <MenuItem selected value="">
                        Tous
                     </MenuItem>
                     {categories.map((cat) => (
                        <MenuItem key={cat.id_categorie} value={cat.id_categorie}>
                           {cat.nom}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
               <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Année</InputLabel>
                  <Select
                     value={yearFilter}
                     onChange={(e) => setYearFilter(e.target.value)}
                     name="year"
                  >
                     <MenuItem value="">Toutes</MenuItem>
                     {/* Liste des années */}
                     {Array.from(new Set(transactions.map((t) => new Date(t.date_transaction).getFullYear())))
                        .sort((a, b) => a - b) // Tri des années dans l'ordre croissant
                        .map((year) => (
                           <MenuItem key={year} value={year}>
                              {year}
                           </MenuItem>
                        ))}
                  </Select>
               </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
               <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Mois</InputLabel>
                  <Select
                     value={monthFilter}
                     onChange={(e) => setMonthFilter(e.target.value)}
                     name="month"
                  >
                     <MenuItem value="">Tous</MenuItem>
                     {/* Liste des mois */}
                     {Array.from(new Set(transactions.map((t) => new Date(t.date_transaction).getMonth() + 1)))
                        .sort((a, b) => a - b) // Tri des mois dans l'ordre croissant
                        .map((month) => (
                           <MenuItem key={month} value={month}>
                              {month}
                           </MenuItem>
                        ))}
                  </Select>
               </FormControl>
            </Grid>
            <Grid container item xs={12} sm={6} spacing={2}>
               <Grid item xs={6}>
                  <TextField
                     label="Montant min"
                     type="number"
                     value={minAmountFilter}
                     onChange={(e) => setMinAmountFilter(e.target.value)}
                     fullWidth
                  />
               </Grid>
               <Grid item xs={6}>
                  <TextField
                     label="Montant max"
                     type="number"
                     value={maxAmountFilter}
                     onChange={(e) => setMaxAmountFilter(e.target.value)}
                     fullWidth
                  />
               </Grid>
            </Grid>
         </Grid>

         <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
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
                        <TableCell sx={{ color: "white" }}>Catégorie</TableCell>
                        <TableCell sx={{ color: "white" }}>Date</TableCell>
                        <TableCell sx={{ color: "white" }}>Description</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {filteredTransactions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((t) => (
                           <TableRow key={t.id_transaction}>
                              <TableCell>{t.montant} €</TableCell>
                              <TableCell>{t.type}</TableCell>
                              <TableCell>{t.categorie}</TableCell>
                              <TableCell>{t.date_transaction}</TableCell>
                              <TableCell>{t.description}</TableCell>
                           </TableRow>
                        ))}
                  </TableBody>
               </Table>
               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredTransactions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
               />
            </TableContainer>
         )}
      </PageContainer>
   );
};

export default TransactionPage;
