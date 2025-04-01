<?php

class ObjectifAdapter {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // Récupérer tous les objectifs financiers d'un utilisateur
    public function getObjectifs($id_utilisateur) {
        try {
            $sql = "SELECT * FROM ObjectifFinancier WHERE id_utilisateur = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_utilisateur]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la récupération des objectifs : " . $e->getMessage()];
        }
    }

    // Récupérer un objectif spécifique par son ID
    public function getObjectifById($id_objectif) {
        try {
            $sql = "SELECT * FROM ObjectifFinancier WHERE id_objectif = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_objectif]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la récupération de l'objectif : " . $e->getMessage()];
        }
    }

    // Ajouter un objectif financier
    public function addObjectif($id_utilisateur, $nom_objectif, $montant_cible, $date_limite) {
        try {
            $sql = "INSERT INTO ObjectifFinancier (id_utilisateur, nom_objectif, montant_cible, montant_actuel, date_limite) 
                    VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$id_utilisateur, $nom_objectif, $montant_cible, 0, $date_limite]);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de l'ajout de l'objectif : " . $e->getMessage()];
        }
    }

    // Mettre à jour un objectif financier
    public function updateObjectif($id_objectif, $nom_objectif, $montant_cible, $date_limite) {
        try {
            $sql = "UPDATE ObjectifFinancier 
                    SET nom_objectif = ?, montant_cible = ?, date_limite = ? 
                    WHERE id_objectif = ?";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$nom_objectif, $montant_cible, $date_limite, $id_objectif]);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la mise à jour de l'objectif : " . $e->getMessage()];
        }
    }

        // Mettre à jour un montant d'un objectif financier
        public function updateObjectifAmount($id_objectif, $montant_actuel) {
            try {
                $sql = "UPDATE ObjectifFinancier 
                        SET montant_actuel = ?
                        WHERE id_objectif = ?";
                $stmt = $this->db->prepare($sql);
                return $stmt->execute([$montant_actuel, $id_objectif]);
            } catch (PDOException $e) {
                return ["error" => "Erreur lors de la mise à jour de l'objectif : " . $e->getMessage()];
            }
        }

    // Supprimer un objectif financier
    public function deleteObjectif($id_objectif) {
        try {
            $sql = "DELETE FROM ObjectifFinancier WHERE id_objectif = ?";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$id_objectif]);
        } catch (PDOException $e) {
            return ["error" => "Erreur lors de la suppression de l'objectif : " . $e->getMessage()];
        }
    }

    // Vérifier si un objectif existe
    public function objectifExists($id_objectif) {
        try {
            $sql = "SELECT COUNT(*) FROM ObjectifFinancier WHERE id_objectif = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id_objectif]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
}
