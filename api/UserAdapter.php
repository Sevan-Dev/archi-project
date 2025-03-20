<?php
 
class UserAdapter {
    private $db;
 
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
 
    public function registerUser($nom, $prenom, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $query = "INSERT INTO Utilisateur (nom, prenom, email, password) VALUES (:nom, :prenom, :email, :password)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute(['nom' => $nom, 'prenom' => $prenom, 'email' => $email, 'password' => $hashedPassword]);
    }
 
    public function loginUser($email, $password) {
        $query = "SELECT * FROM Utilisateur WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
 
        if ($user && password_verify($password, $user['password'])) {
            return ['status' => 'success', 'user' => ['id' => $user['id_utilisateur'], 'email' => $user['email']]];
        } else {
            return ['status' => 'error', 'message' => 'Identifiants incorrects'];
        }
    }
}