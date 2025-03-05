import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Paper, Box } from "@mui/material";
import LogoIcon from "../assets/ico.png";

const Navbar = () => {
    return (
        <AppBar position="relative" color="primary">
            <Paper elevation={0} sx={{ width: "100%", height: 64 }} >
                <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
                    {/* Logo a la izquierda */}
                    <IconButton edge="start" color="inherit" aria-label="logo" sx={{ position: "absolute", left: 16 }}>
                        <Box component="img" src={LogoIcon} alt="logo" sx={{ width: 60, height: "auto" }} />
                    </IconButton>

                    {/* Título centrado */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                        calculadora de cuotas para excavación
                    </Typography>
                </Toolbar>
            </Paper>
        </AppBar>
    );
};

export default Navbar;
