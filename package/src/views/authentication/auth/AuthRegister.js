import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import { registerUser } from "../../../../backend/register";

const AuthRegister = ({ title, subtitle, subtext }) => {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà connecté
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validateForm = () => {
    let newErrors = {};

    if (!nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!prenom.trim()) newErrors.prenom = "Le prénom est requis.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "L'email est invalide.";
    }

    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const status = await registerUser(nom, prenom, email, password);
    if (status === "success") {
      navigate("/dashboard");
    } else {
      setErrors({
        global: "Erreur lors de l'inscription. Veuillez réessayer.",
      });
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Box component="form" onSubmit={handleRegister}>
        <Stack mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="nom"
            mb="5px"
          >
            Nom
          </Typography>
          <CustomTextField
            id="nom"
            variant="outlined"
            fullWidth
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          {errors.nom && (
            <Stack alignItems="left">
              <Typography color="#ff3333">{errors.nom}</Typography>
            </Stack>
          )}

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="prenom"
            mb="5px"
            mt="25px"
          >
            Prénom
          </Typography>
          <CustomTextField
            id="prenom"
            variant="outlined"
            fullWidth
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
          {errors.prenom && (
            <Stack alignItems="left">
              <Typography color="#ff3333">{errors.prenom}</Typography>
            </Stack>
          )}

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
            mt="25px"
          >
            Adresse Email
          </Typography>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <Stack alignItems="left">
              <Typography color="#ff3333">{errors.email}</Typography>
            </Stack>
          )}

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
            mt="25px"
          >
            Mot de passe
          </Typography>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <Stack alignItems="left">
              <Typography color="#ff3333">{errors.password}</Typography>
            </Stack>
          )}
        </Stack>

        {/* Message d'erreur global si l'inscription échoue */}
        {errors.global && (
          <Typography color="#ff3333" textAlign="center" mb={2}>
            {errors.global}
          </Typography>
        )}

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          S'inscrire
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
