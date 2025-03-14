import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { validForm } from '../../../../backend/login';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault(); 
        const status = await validForm(email, password);
        if (status === "success") {
            navigate('/dashboard');
        } else {
            alert("Erreur de connexion, vérifiez vos identifiants !");
        }
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Stack component="form" onSubmit={handleLogin}>  {}
                <Box>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px">Email</Typography>
                    <CustomTextField
                        id="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px">Mot de passe</Typography>
                    <CustomTextField
                        id="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Se souvenir de moi"
                        />
                    </FormGroup>
                    <Typography
                        component={Link}
                        to="/forgot-password"
                        fontWeight="500"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                        }}
                    >
                        Mot de passe oublié ?
                    </Typography>
                </Stack>
                <Box>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                    >
                        Se connecter
                    </Button>
                </Box>
            </Stack>

            {subtitle}
        </>
    );
};

export default AuthLogin;
