import API_BASE_URL from "./config.js";

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/index.php?action=getCategories`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        return [];
    }
};

export const getCategorieById = async (id_categorie) => {
   try {
       const response = await fetch(`${API_BASE_URL}/index.php?action=getCategorieById&id_categorie=${id_categorie}`);
       return await response.json();
   } catch (error) {
       console.error("Erreur lors de la récupération de la catégorie :", error);
       return null;
   }
};


// await getCategorieById(t.id_categorie).then(data => data.type)