<?php

class CategorieAdapter {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // Récupérer toutes les catégories
    public function getCategories() {
        try {
            $sql = "SELECT * FROM Categorie";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la récupération des catégories : " . $e->getMessage()];
        }
    }

    // Récupérer une catégorie spécifique par son ID
    public function getCategorieById($id_categorie) {
        try {
            $sql = "SELECT * FROM Categorie WHERE id_categorie = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_categorie]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la récupération de la catégorie : " . $e->getMessage()];
        }
    }

    // Vérifier si une catégorie existe
    public function categorieExists($id_categorie) {
        try {
            $sql = "SELECT COUNT(*) FROM Categorie WHERE id_categorie = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_categorie]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
}
