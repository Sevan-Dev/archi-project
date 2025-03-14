fetch('https://devweb.iutmetz.univ-lorraine.fr/~brochot6u/PHP/api/index.php?action=login', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: "alice.dupont@example.com",
        password: "motdepasse123"
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Erreur :", error));