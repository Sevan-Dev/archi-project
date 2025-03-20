<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'Database.php';
require_once 'TransactionAdapter.php';
require_once 'BudgetAdapter.php';
require_once 'ObjectifAdapter.php';
require_once 'UserAdapter.php';
require_once 'CategorieAdapter.php';

$userAdapter = new UserAdapter();
$transactionAdapter = new TransactionAdapter();
$budgetAdapter = new BudgetAdapter();
$objectifAdapter = new ObjectifAdapter();
$categorieAdapter = new CategorieAdapter();

if (isset($_GET['action'])) {
    $action = $_GET['action'];


    switch ($action) {
        // AUTHENTIFICATION
        case 'login':
            $data = json_decode(file_get_contents('php://input'), true) ?? $_GET;
            if (isset($data['email'], $data['password'])) {
                echo json_encode($userAdapter->loginUser($data['email'], $data['password']));
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Paramètres manquants']);
            }
            break;

        case 'register':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                if (isset($data['nom'], $data['prenom'], $data['email'], $data['password'])) {
                    $result = $userAdapter->registerUser($data['nom'], $data['prenom'], $data['email'], $data['password']);
                    echo json_encode(['status' => $result ? 'success' : 'error']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Paramètres manquants']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Utilisez une requête POST pour l’inscription']);
            }
            break;

        // TRANSACTIONS
        case 'getTransactions':
            if (isset($_GET['id_utilisateur'])) {
                echo json_encode($transactionAdapter->getTransactions($_GET['id_utilisateur']));
            }
            break;

            case 'addTransaction':
                $data = json_decode(file_get_contents('php://input'), true);
                if (isset($data['id_utilisateur'], $data['montant'], $data['type'], $data['id_categorie'], $data['description'], $data['date'])) {
                    try {
                        $result = $transactionAdapter->addTransaction(
                            $data['id_utilisateur'],
                            $data['montant'],
                            $data['type'],
                            $data['id_categorie'],
                            $data['description'],
                            $data['date']
                        );
            
                        // Vérification du succès et renvoi de la réponse JSON
                        if ($result) {
                            echo json_encode(['status' => 'success']);
                        } else {
                            echo json_encode(['status' => 'error', 'message' => 'Failed to insert transaction']);
                        }
                        exit;
                    } catch (Exception $e) {
                        // Si une erreur se produit lors de l'exécution de la requête, renvoyer une erreur en JSON
                        echo json_encode(["error" => "Erreur lors de l'ajout de la transaction : " . $e->getMessage()]);
                        exit;
                    }
                } else {
                    echo json_encode(["error" => "Données manquantes pour l'ajout de la transaction"]);
                    exit;
                }
                break;
            



        case 'deleteTransaction':
            if (isset($_GET['id_transaction'])) {
                $result = $transactionAdapter->deleteTransaction($_GET['id_transaction']);
                echo json_encode(['status' => $result ? 'success' : 'error']);
            }
            break;

        case 'updateTransaction':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['id_transaction'], $data['montant'], $data['type'], $data['id_categorie'], $data['description'], $data['date'])) {
                $result = $transactionAdapter->updateTransaction(
                    $data['id_transaction'],
                    $data['montant'],
                    $data['type'],
                    $data['id_categorie'],
                    $data['description'],
                    $data['date']
                );
                echo json_encode(['status' => $result ? 'success' : 'error']);
            }
            break;

        // CATEGORIES (Ajout des actions pour les catégories)
        case 'getCategories':
            // Récupérer toutes les catégories
            echo json_encode($categorieAdapter->getCategories());
            break;

        case 'getCategorieById':
            if (isset($_GET['id_categorie'])) {
                // Récupérer une catégorie par son ID
                echo json_encode($categorieAdapter->getCategorieById($_GET['id_categorie']));
            } else {
                echo json_encode(['status' => 'error', 'message' => 'ID de catégorie manquant']);
            }
            break;

        // BUDGETS
        case 'getBudgets':
            if (isset($_GET['id_utilisateur'])) {
                echo json_encode($budgetAdapter->getBudgets($_GET['id_utilisateur']));
            }
            break;

        case 'addBudget':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['id_utilisateur'], $data['montant_max'], $data['id_categorie'], $data['periode'])) {
                $result = $budgetAdapter->addBudget($data['id_utilisateur'], $data['montant_max'], $data['id_categorie'], $data['periode']);
                echo json_encode(['status' => $result ? 'success' : 'error']);
            }
            break;

        case 'updateBudget':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['id_budget'], $data['montant_max'], $data['id_categorie'], $data['periode'])) {
                $result = $budgetAdapter->updateBudget($data['id_budget'], $data['montant_max'], $data['id_categorie'], $data['periode']);
                echo json_encode(['status' => $result ? 'success' : 'error']);
            }
            break;

        case 'deleteBudget':
            if (isset($_GET['id_budget'])) {
                $result = $budgetAdapter->deleteBudget($_GET['id_budget']);
                echo json_encode(['status' => $result ? 'success' : 'error']);
            }
            break;

        // OBJECTIFS FINANCIERS
        case 'getObjectifs':
            if (isset($_GET['id_utilisateur'])) {
                echo json_encode($objectifAdapter->getObjectifs($_GET['id_utilisateur']));
            }
            break;

        case 'addObjectif':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['id_utilisateur'], $data['nom_objectif'], $data['montant_cible'], $data['date_limite'])) {
                $result = $objectifAdapter->addObjectif($data['id_utilisateur'], $data['nom_objectif'], $data['montant_cible'], $data['date_limite']);
                echo json_encode(['status' => $result ? 'success' : 'error']);
            }
            break;

        case 'updateObjectif':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['id_utilisateur'], $data['nom_objectif'], $data['montant_cible'], $data['montant_actuel'], $data['date_limite'])) {
                $result = $objectifAdapter->updateObjectif($data['id_utilisateur'], $data['nom_objectif'], $data['montant_cible'], $data['montant_actuel'], $data['date_limite']);
                echo json_encode(['status' => $result ? 'success' : 'error']);
            }
            break;

        case 'deleteObjectif':
            if (isset($_GET['id_objectif'])) {
                $result = $objectifAdapter->deleteObjectif($_GET['id_objectif']);
                echo json_encode(['status' => $result ? 'success' : 'error']);
            }
            break;

        default:
            echo json_encode(['status' => 'error', 'message' => 'Action inconnue']);
            break;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Aucune action spécifiée']);
}
