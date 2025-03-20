<?php

class BudgetAdapter {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // Récupérer tous les budgets d'un utilisateur
    public function getBudgets($id_utilisateur) {
        try {
            $sql = "SELECT * FROM Budget WHERE id_utilisateur = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_utilisateur]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la récupération des budgets : " . $e->getMessage()];
        }
    }

    // Récupérer un budget spécifique par son ID
    public function getBudgetById($id_budget) {
        try {
            $sql = "SELECT * FROM Budget WHERE id_budget = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_budget]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la récupération du budget : " . $e->getMessage()];
        }
    }

    // Ajouter un budget
    public function addBudget($id_utilisateur, $montant_max, $id_categorie, $periode) {
        try {
            $sql = "INSERT INTO Budget (id_utilisateur, montant_max, id_categorie, periode) 
                    VALUES (?, ?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$id_utilisateur, $montant_max, $id_categorie, $periode]);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de l'ajout du budget : " . $e->getMessage()];
        }
    }

    // Mettre à jour un budget
    public function updateBudget($id_budget, $montant_max, $id_categorie, $periode) {
        try {
            $sql = "UPDATE Budget 
                    SET montant_max = ?, id_categorie = ?, periode = ? 
                    WHERE id_budget = ?";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$montant_max, $id_categorie, $periode, $id_budget]);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la mise à jour du budget : " . $e->getMessage()];
        }
    }

    // Supprimer un budget
    public function deleteBudget($id_budget) {
        try {
            $sql = "DELETE FROM Budget WHERE id_budget = ?";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$id_budget]);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la suppression du budget : " . $e->getMessage()];
        }
    }

    // Vérifier si un budget existe
    public function budgetExists($id_budget) {
        try {
            $sql = "SELECT COUNT(*) FROM Budget WHERE id_budget = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_budget]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
}
