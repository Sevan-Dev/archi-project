import API_BASE_URL from './config.js'; // Assurez-vous que cette variable contient l'URL correcte de ton API

// Fonction générique pour envoyer des requêtes POST
const postRequest = async (url, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/index.php${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    // Vérifier si la réponse contient du JSON valide
    const result = await response.text(); // Utiliser .text() pour récupérer la réponse brute
    try {
      return JSON.parse(result); // Essayer de parser la réponse en JSON
    } catch (error) {
      throw new Error('Réponse du serveur non JSON : ' + result); // Gérer les erreurs de parsing
    }
  } catch (error) {
    console.error(`Erreur lors de la requête POST à ${url}:`, error);
    return { error: error.message };
  }
};


// Récupérer les objectifs financiers d'un utilisateur
export const getObjectifsByUser = async (id_utilisateur) => {
  try {
    const response = await fetch(`${API_BASE_URL}/index.php?action=getObjectifs&id_utilisateur=${id_utilisateur}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des objectifs');
    }
    const data = await response.json();
    return data; // Renvoie les objectifs récupérés
  } catch (error) {
    console.error("Erreur lors de la récupération des objectifs :", error);
    return [];
  }
};

// Ajouter un objectif financier
export const addObjectif = async (id_utilisateur, nom_objectif, montant_cible, date_limite) => {
  const data = { id_utilisateur, nom_objectif, montant_cible, date_limite };
  return await postRequest('/?action=addObjectif', data);
};

// Mettre à jour un objectif financier
export const updateObjectif = async (id_objectif, nom_objectif, montant_cible, montant_actuel, date_limite) => {
  const data = { id_objectif, nom_objectif, montant_cible, montant_actuel, date_limite };
  return await postRequest('/?action=updateObjectif', data);
};

// Supprimer un objectif financier
export const deleteObjectif = async (id_objectif) => {
  const data = { id_objectif };
  return await postRequest('/?action=deleteObjectif', data);
};

