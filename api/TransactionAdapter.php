<?php

class TransactionAdapter
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    // Récupérer toutes les transactions d'un utilisateur
    public function getTransactions($id_utilisateur)
    {
        try {
            $sql = "SELECT * FROM Transaction WHERE id_utilisateur = ? ORDER BY date_transaction DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_utilisateur]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la récupération des transactions : " . $e->getMessage()];
        }
    }

    // Récupérer une transaction spécifique par son ID
    public function getTransactionById($id_transaction)
    {
        try {
            $sql = "SELECT * FROM Transaction WHERE id_transaction = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_transaction]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la récupération de la transaction : " . $e->getMessage()];
        }
    }

    // Ajouter une transaction
    public function addTransaction($id_utilisateur, $montant, $id_categorie, $description, $date_transaction)
    {
        try {
            $sql = "INSERT INTO Transaction (id_utilisateur, montant, date_transaction, id_categorie, description) 
                    VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_utilisateur, $montant, $date_transaction, $id_categorie, $description]);
    
            return true; 
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de l'ajout de la transaction : " . $e->getMessage()]);
            exit;
        }
    }
    
    

    // Mettre à jour une transaction
    public function updateTransaction($id_transaction, $montant, $id_categorie, $description, $date_transaction)
    {
        try {
            $sql = "UPDATE Transaction SET montant = ?, date_transaction = ?, id_categorie = ?, description = ? WHERE id_transaction = ?";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$montant, $date_transaction, $id_categorie, $description, $id_transaction]);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la mise à jour de la transaction : " . $e->getMessage()];
        }
    }

    // Supprimer une transaction
    public function deleteTransaction($id_transaction)
    {
        try {
            $sql = "DELETE FROM Transaction WHERE id_transaction = ?";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$id_transaction]);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la suppression de la transaction : " . $e->getMessage()];
        }
    }

    // Vérifier si une transaction existe
    public function transactionExists($id_transaction)
    {
        try {
            $sql = "SELECT COUNT(*) FROM Transaction WHERE id_transaction = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_transaction]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
}
