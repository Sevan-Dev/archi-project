import React, { useState } from "react";
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
  TablePagination,
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
} from "@mui/material";
import PageContainer from "src/components/container/PageContainer";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const TransactionPage = () => {
  const initialRows = [
    {
      id: Date.now(),
      montant: 1000,
      type: "Débit",
      date: "2025-03-10",
      description: "Achat de matériel",
      categorie: "Achats",
    },
    {
      id: Date.now() + 1,
      montant: 200,
      type: "Crédit",
      date: "2025-03-11",
      description: "Vente de produit",
      categorie: "Vente",
    },
    {
      id: Date.now() + 2,
      montant: 500,
      type: "Débit",
      date: "2025-03-12",
      description: "Abonnement mensuel",
      categorie: "Services",
    },
    {
      id: Date.now() + 3,
      montant: 300,
      type: "Crédit",
      date: "2025-03-13",
      description: "Paiement d'une facture",
      categorie: "Services",
    },
    {
      id: Date.now() + 4,
      montant: 1500,
      type: "Débit",
      date: "2025-03-14",
      description: "Achat de logiciels",
      categorie: "Achats",
    },
    {
      id: Date.now() + 5,
      montant: 100,
      type: "Crédit",
      date: "2025-03-15",
      description: "Vente de service",
      categorie: "Vente",
    },
    {
      id: Date.now() + 6,
      montant: 700,
      type: "Débit",
      date: "2025-03-16",
      description: "Location d'équipement",
      categorie: "Services",
    },
    {
      id: Date.now() + 7,
      montant: 250,
      type: "Crédit",
      date: "2025-03-17",
      description: "Paiement client",
      categorie: "Vente",
    },
  ];

  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredRows, setFilteredRows] = useState(rows);
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
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClickMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDelete = () => {
    const updatedRows = rows.filter((row) => row.id !== selectedRow.id);
    setRows(updatedRows);
    const filteredData = filterRows(updatedRows);
    setFilteredRows(filteredData);
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setNewTransaction({ ...selectedRow });
    setOpen(true);
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleSubmit = () => {
    let updatedRows;
    if (newTransaction.id) {
      // Mise à jour de l'ancienne ligne modifiée
      updatedRows = rows.map((row) =>
        row.id === newTransaction.id ? { ...newTransaction } : row
      );
    } else {
      // Ajout d'une nouvelle ligne
      updatedRows = [...rows, { ...newTransaction, id: Date.now() }];
    }

    // Mettre à jour les lignes
    setRows(updatedRows);
    const filteredData = filterRows(updatedRows);
    setFilteredRows(filteredData);

    // Fermer le formulaire et réinitialiser les données de la transaction
    setOpen(false);
    setNewTransaction({
      montant: "",
      type: "Débit",
      date: "",
      description: "",
      categorie: "",
    });
  };

  const filterRows = (data = rows) => {
    let tempRows = data;

    if (categoryFilter) {
      tempRows = tempRows.filter((row) => row.categorie === categoryFilter);
    }

    if (dateFilter) {
      tempRows = tempRows.filter((row) => row.date === dateFilter);
    }

    if (minAmountFilter) {
      tempRows = tempRows.filter((row) => row.montant >= parseFloat(minAmountFilter));
    }

    if (maxAmountFilter) {
      tempRows = tempRows.filter((row) => row.montant <= parseFloat(maxAmountFilter));
    }

    return tempRows;
  };

  React.useEffect(() => {
    const filteredData = filterRows();
    setFilteredRows(filteredData);
    setPage(0);
  }, [categoryFilter, dateFilter, minAmountFilter, maxAmountFilter]);

  return (
    <PageContainer title="Transactions" description="Tableau des transactions">
      {/* Header Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Tableau des Transactions
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Voici une liste des transactions récentes, incluant les montants,
            types, dates, descriptions et catégories des opérations.
          </Typography>
        </Grid>
      </Grid>

      {/* Filter Section */}
      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {/* Filters */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Catégorie"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="Achats">Achats</MenuItem>
              <MenuItem value="Vente">Vente</MenuItem>
              <MenuItem value="Services">Services</MenuItem>
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
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Montant minimum"
            type="number"
            value={minAmountFilter}
            onChange={(e) => setMinAmountFilter(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Montant maximum"
            type="number"
            value={maxAmountFilter}
            onChange={(e) => setMaxAmountFilter(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Add Transaction Button */}
      <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ marginTop: 2 }}>
        Ajouter une transaction
      </Button>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#5d87ff" }}>
              <TableCell sx={{ color: "white" }}>Montant</TableCell>
              <TableCell sx={{ color: "white" }}>Type</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Description</TableCell>
              <TableCell sx={{ color: "white" }}>Catégorie</TableCell>
              <TableCell sx={{ color: "white" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.montant} €</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.categorie}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleClickMenu(e, row)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedRow === row}
                      onClose={handleCloseMenu}
                    >
                      <MenuItem onClick={handleEdit}>Modifier</MenuItem>
                      <MenuItem onClick={handleDelete}>Supprimer</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />

      {/* Dialog for adding/editing transaction */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newTransaction.id ? "Modifier la transaction" : "Ajouter une transaction"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Montant"
                type="number"
                fullWidth
                name="montant"
                value={newTransaction.montant}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newTransaction.type}
                  name="type"
                  onChange={handleInputChange}
                  label="Type"
                >
                  <MenuItem value="Débit">Débit</MenuItem>
                  <MenuItem value="Crédit">Crédit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={newTransaction.categorie}
                  name="categorie"
                  onChange={handleInputChange}
                  label="Catégorie"
                >
                  <MenuItem value="Achats">Achats</MenuItem>
                  <MenuItem value="Vente">Vente</MenuItem>
                  <MenuItem value="Services">Services</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Annuler</Button>
          <Button onClick={handleSubmit} color="primary">{newTransaction.id ? "Modifier" : "Ajouter"}</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default TransactionPage;
  