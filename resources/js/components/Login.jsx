import {
    Alert,
    Button,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import Image from "mui-image";
import { Link as MuiLink } from "@mui/material";
import { ErrorSharp, Visibility, VisibilityOff } from "@mui/icons-material";
import Cookies from "js-cookie";
import { UserContext } from "./App";

function Login() {
    const email = useRef("");
    const password = useRef("");
    const [open, setOpen] = useState(false);
    const [alertMessage, setalertMessage] = useState("");
    const [severity, setseverity] = useState("error");
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const { setUser } = useContext(UserContext);

    const login = async () => {
        await axios
            .post(`${process.env.MIX_BACKEND_URL}/login`, {
                email: email.current.value,
                password: password.current.value,
            })
            .then((response) => {
                if (response.status === 200) {
                    email.current.value = "";
                    password.current.value = "";
                    setalertMessage("Sikeres bejelentkezés!");
                    setseverity("success");
                    setErrors([]);
                    setOpen(true);
                    navigate({ pathname: "/home", search: `?page=0` });
                    setUser(response.data.user);
                    //console.log(response.data.user);
                    Cookies.set("token", response.data.token, {
                        expires: 7,
                        path: "/",
                        sameSite: "strict",
                    });
                    //redirect("/home");
                    //setCookie("token", response.data.token, { path: "/" });
                }
            })
            .catch((response) => {
                if (
                    response.response.status === 422 &&
                    response.response.data.message == null
                ) {
                    setErrors(response.response.data);
                    //console.log(response.response.data);
                } else {
                    setalertMessage(response.response.data.message);
                    setseverity("error");
                    setOpen(true);
                    setErrors([]);
                    //console.log(response.response.data);
                }
                if (response.response.status === 403) {
                    setalertMessage(response.response.data.message);
                    setseverity("error");
                    setOpen(true);
                    setErrors([]);
                }
            });
    };

    const handleClose = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        document.title = "Inventory System - Bejelentkezés";
    }, []);

    return (
        <Grid2
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Grid2>
                <Image
                    src="/storage/logo.png"
                    duration={1500}
                    alt="Inventory System Logo"
                />
            </Grid2>
            <Paper elevation={8}>
                <Grid2>
                    <Typography variant="h4">Bejelentkezés</Typography>
                </Grid2>
                <Grid2>
                    <TextField
                        label="E-mail cím"
                        fullWidth
                        variant="outlined"
                        inputRef={email}
                        helperText={errors.email}
                        error={errors.email != null}
                    />
                </Grid2>
                <Grid2>
                    <TextField
                        label="Jelszó"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        inputRef={password}
                        helperText={errors.password}
                        error={errors.password != null}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid2>
                <Grid2>
                    <Button variant="contained" onClick={login}>
                        Bejelentkezés
                    </Button>
                </Grid2>
                <Grid2>
                    <Link to="/register">
                        <Button variant="text">Regisztráció</Button>
                    </Link>
                    <br />
                    <Link to="/forgotpass">
                        <Button variant="text">Elfelejtett jelszó</Button>
                    </Link>
                </Grid2>
            </Paper>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Grid2>
    );
}

export default Login;
