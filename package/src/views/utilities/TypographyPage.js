import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, TablePagination } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

const TypographyPage = () => {

  const rows = [
    { montant: 1000, type: 'Débit', date: '2025-03-10', description: 'Achat de matériel', categorie: 'Achats' },
    { montant: 200, type: 'Crédit', date: '2025-03-11', description: 'Vente de produit', categorie: 'Vente' },
    { montant: 500, type: 'Débit', date: '2025-03-12', description: 'Abonnement mensuel', categorie: 'Services' },
    { montant: 300, type: 'Crédit', date: '2025-03-13', description: 'Paiement d\'une facture', categorie: 'Services' },
    { montant: 1500, type: 'Débit', date: '2025-03-14', description: 'Achat de logiciels', categorie: 'Achats' },
    { montant: 100, type: 'Crédit', date: '2025-03-15', description: 'Vente de service', categorie: 'Vente' },
    { montant: 700, type: 'Débit', date: '2025-03-16', description: 'Location d\'équipement', categorie: 'Services' },
    { montant: 250, type: 'Crédit', date: '2025-03-17', description: 'Paiement client', categorie: 'Vente' },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer title="Transactions" description="Tableau des transactions">

      {/* Header Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Tableau des Transactions
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Voici une liste des transactions récentes, incluant les montants, types, dates, descriptions et catégories des opérations.
          </Typography>
        </Grid>
      </Grid>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Montant</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Catégorie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Afficher les lignes pour la page actuelle */}
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.montant} €</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.categorie}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage} 
        page={page}
        onPageChange={handleChangePage} 
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </PageContainer>
  );
};

export default TypographyPage;
