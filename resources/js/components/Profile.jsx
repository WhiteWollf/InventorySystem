import {
    Add,
    Edit,
    EditOff,
    PhotoCamera,
    Search,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import {
    Alert,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Rating,
    Snackbar,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, propsef, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Map from "./Map";
import MyAvatar from "./MyAvatar";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "./App";
import axios from "axios";

function Profile() {
    const { user } = useContext(UserContext);
    const cookie = Cookies.get("token");
    const [City, setCity] = useState(user.city);
    const [showPassword, setShowPassword] = useState("");
    const [btnDisable, setBtnDisable] = useState(true);
    const [passDisabled, setPassDisabled] = useState(true);
    const [cityDisabled, setcityDisabled] = useState(true);
    const oldPassword = useRef("");
    const newPassword = useRef("");
    const againPassword = useRef("");
    const city = useRef("");
    const name = useRef("");
    const email = useRef("");
    const [errors, setErrors] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setalertMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [severity, setSeverity] = useState("success");
    const [isQuitting, setIsQuitting] = useState(false);
    const [isDeleteing, setIsDeleteing] = useState(false);
    var formData = new FormData();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const upload = (e) => {
        handleClose();
        //console.log(e.target.files[0]);
        formData.append("image", e.target.files[0]);
        uploadImage();
    };

    const uploadImage = async () => {
        axios
            .post(
                `${process.env.MIX_BACKEND_URL}/myProfile/uploadImage`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + cookie,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setSeverity("success");
                    setalertMessage("K??p sikeresen megv??ltoztatva!");
                    setOpenAlert(true);
                    window.location.reload();
                }
            })
            .catch((response) => {
                if (response.response.status === 422) {
                    setSeverity("error");
                    setalertMessage("Valami hiba t??rt??nt!");
                    setOpenAlert(true);
                }
            });
    };

    const removeImage = async () => {
        axios
            .delete(`${process.env.MIX_BACKEND_URL}/myProfile/deleteImage`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + cookie,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    //console.log(response.data);
                    setSeverity("success");
                    setalertMessage("K??p sikeresen t??r??lve!");
                    setOpenAlert(true);
                    window.location.reload();
                }
            })
            .catch((response) => {
                if (response.response.status === 422) {
                    //console.log(response.response.data);
                    setSeverity("error");
                    setalertMessage("Valami hiba t??rt??nt!");
                    setOpenAlert(true);
                }
            });
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const handleChange = (e) => {
        if (e.target.value == e.target.defaultValue) {
            setBtnDisable(true);
        } else {
            setBtnDisable(false);
        }
    };

    const handleCityChange = (e) => {
        if (e.target.value == e.target.defaultValue) {
            setcityDisabled(true);
        } else {
            setcityDisabled(false);
        }
    };

    const handlePassChange = (e) => {
        if (e.target.value == "") {
            setPassDisabled(true);
        } else {
            setPassDisabled(false);
        }
    };

    const changePassword = async () => {
        axios
            .post(
                `${process.env.MIX_BACKEND_URL}/myProfile/passwordChange`,
                {
                    "old-password": oldPassword.current.value,
                    "new-password": newPassword.current.value,
                    "new-password-repeat": againPassword.current.value,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + cookie,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setPassDisabled(true);
                    setErrors([]);
                    setOpenAlert(true);
                    setSeverity("success");
                    setalertMessage(response.data);
                    window.location.reload();
                }
            })
            .catch((response) => {
                if (response.response.status === 422) {
                    setErrors(response.response.data);
                }
            });
    };

    const changeNameEmail = async () => {
        axios
            .post(
                `${process.env.MIX_BACKEND_URL}/myProfile/nameEmail`,
                {
                    email: email.current.value,
                    name: name.current.value,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + cookie,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setPassDisabled(true);
                    setErrors([]);
                    setOpenAlert(true);
                    setSeverity("success");
                    setalertMessage(response.data);
                    window.location.reload();
                    //console.log("email,name", response.data);
                    //todo
                }
            })
            .catch((response) => {
                if (response.response.status === 422) {
                    setErrors(response.response.data);
                    //console.log(response.response.data);
                }
                if (response.response.status === 409) {
                    setErrors(response.response.data);
                }
            });
    };

    const changeCity = async () => {
        axios
            .post(
                `${process.env.MIX_BACKEND_URL}/myProfile/cityChange`,
                {
                    city: city.current.value,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + cookie,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setPassDisabled(true);
                    setErrors([]);
                    setSeverity("success");
                    setOpenAlert(true);
                    setalertMessage(response.data);
                    window.location.reload();
                }
            })
            .catch((response) => {
                if (response.response.status === 422) {
                    setErrors(response.response.data);
                }
            });
    };

    const deleteProfile = async () => {
        axios
            .delete(`${process.env.MIX_BACKEND_URL}/myProfile/deleteProfile`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + cookie,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    //console.log(response.data);
                    window.location.reload();
                }
            });
    };

    const leaveShop = async () => {
        axios
            .post(
                `${process.env.MIX_BACKEND_URL}/myProfile/leaveShop`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + cookie,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    //console.log(response.data);
                    setalertMessage(response.data);
                    setOpenAlert(true);
                    setSeverity("success");
                    window.location.reload();
                }
            })
            .catch((response) => {
                if (response.response.status === 403) {
                    setalertMessage(response.response.data);
                    setOpenAlert(true);
                    setSeverity("error");
                    setIsQuitting(false);
                }
            });
    };

    useEffect(() => {
        document.title = "Inventory System - Profil";
    }, []);

    return (
        <Box>
            <Grid2
                mt={3}
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Grid2>
                    <Typography variant="h4">Profil be??ll??t??sok</Typography>
                </Grid2>
                <Grid2
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid2>
                        <Badge
                            badgeContent={
                                <IconButton
                                    color="default"
                                    sx={{
                                        border: "1px solid",
                                        backgroundColor: "lightgrey",
                                        ":hover": {
                                            backgroundColor: "grey",
                                        },
                                    }}
                                    size="small"
                                    onClick={handleClick}
                                >
                                    <Edit />
                                </IconButton>
                            }
                            overlap="circular"
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                        >
                            <MyAvatar
                                width={100}
                                height={100}
                                name={user.name}
                            />
                        </Badge>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                        >
                            <MenuItem component="label">
                                Fot?? felt??lt??se
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={upload}
                                />
                            </MenuItem>
                            <MenuItem
                                disabled={user.image_path == null}
                                onClick={() => {
                                    removeImage(), handleClose();
                                }}
                            >
                                Fot?? elt??vol??t??sa
                            </MenuItem>
                        </Menu>
                    </Grid2>
                    <Grid2 container direction="column">
                        <Grid2>
                            <TextField
                                label="N??v"
                                defaultValue={user.name}
                                size="small"
                                onChange={handleChange}
                                inputRef={name}
                                error={errors.name != null}
                                helperText={errors.name}
                            />
                        </Grid2>
                        <Grid2>
                            <TextField
                                label="E-mail c??m"
                                defaultValue={user.email}
                                size="small"
                                onChange={handleChange}
                                inputRef={email}
                                error={errors.email != null}
                                helperText={errors.email}
                            />
                        </Grid2>
                        <Grid2>
                            <Button
                                variant="contained"
                                disabled={btnDisable}
                                onClick={changeNameEmail}
                            >
                                V??ltoztat??sok ment??se
                            </Button>
                        </Grid2>
                    </Grid2>
                    <Grid2
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/*<Grid2>
                            <Typography variant="h5">Jelsz??</Typography>
                        </Grid2>*/}
                        <Grid2>
                            <TextField
                                error={errors["old-password"] != null}
                                helperText={errors["old-password"]}
                                inputRef={oldPassword}
                                onChange={handlePassChange}
                                label="R??gi jelsz??"
                                type={
                                    showPassword.includes("old")
                                        ? "text"
                                        : "password"
                                }
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={
                                                    !showPassword.includes(
                                                        "old"
                                                    )
                                                        ? () =>
                                                              setShowPassword(
                                                                  showPassword +
                                                                      "old"
                                                              )
                                                        : () =>
                                                              setShowPassword(
                                                                  showPassword.replace(
                                                                      "old",
                                                                      ""
                                                                  )
                                                              )
                                                }
                                            >
                                                {showPassword.includes(
                                                    "old"
                                                ) ? (
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
                            <TextField
                                error={errors["new-password"] != null}
                                helperText={
                                    errors["new-password"] == null
                                        ? ""
                                        : errors["new-password"][0]
                                }
                                inputRef={newPassword}
                                onChange={handlePassChange}
                                label="??j jelsz??"
                                type={
                                    showPassword.includes("new")
                                        ? "text"
                                        : "password"
                                }
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={
                                                    !showPassword.includes(
                                                        "new"
                                                    )
                                                        ? () =>
                                                              setShowPassword(
                                                                  showPassword +
                                                                      "new"
                                                              )
                                                        : () =>
                                                              setShowPassword(
                                                                  showPassword.replace(
                                                                      "new",
                                                                      ""
                                                                  )
                                                              )
                                                }
                                            >
                                                {showPassword.includes(
                                                    "new"
                                                ) ? (
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
                            <TextField
                                error={errors["new-password-repeat"] != null}
                                helperText={errors["new-password-repeat"]}
                                inputRef={againPassword}
                                onChange={handlePassChange}
                                label="??j jelsz?? ??jra"
                                type={
                                    showPassword.includes("again")
                                        ? "text"
                                        : "password"
                                }
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={
                                                    !showPassword.includes(
                                                        "again"
                                                    )
                                                        ? () =>
                                                              setShowPassword(
                                                                  showPassword +
                                                                      "again"
                                                              )
                                                        : () =>
                                                              setShowPassword(
                                                                  showPassword.replace(
                                                                      "again",
                                                                      ""
                                                                  )
                                                              )
                                                }
                                            >
                                                {showPassword.includes(
                                                    "again"
                                                ) ? (
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
                            <Button
                                variant="contained"
                                disabled={passDisabled}
                                onClick={changePassword}
                            >
                                Jelsz?? megv??ltoztat??sa
                            </Button>
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Grid2
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    {user.shop == null ? (
                        <Grid2
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography sx={{ fontWeight: "bold" }}>
                                Nem vagy boltnak a tagja!
                            </Typography>
                            <Card
                                variant="outlined"
                                key={user.id}
                                sx={{
                                    m: 2,
                                    width: 300,
                                    height: 300,
                                }}
                            >
                                <CardActionArea>
                                    <CardMedia
                                        sx={{
                                            width: 300,
                                            height: 180,
                                        }}
                                        component="img"
                                        image={"/storage/template.png"}
                                    />
                                </CardActionArea>
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            ":hover": {
                                                cursor: "default",
                                            },
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        Bolt neve
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        V??ros, c??m
                                    </Typography>
                                    <Rating
                                        name="read-only"
                                        value={0}
                                        readOnly
                                    />
                                </CardContent>
                            </Card>
                        </Grid2>
                    ) : (
                        <Grid2
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography sx={{ fontWeight: "bold" }}>
                                Beoszt??s:{" "}
                                {user["permission"] == 10
                                    ? "Tulajdonos"
                                    : user["permission"] == 5
                                    ? "Menedzser"
                                    : "Elad??"}
                            </Typography>
                            <Card
                                variant="outlined"
                                key={user.shop.id}
                                sx={{
                                    m: 2,
                                    width: 300,
                                    height: 300,
                                }}
                            >
                                <Link
                                    to={{
                                        pathname: `/shops/${user.shop.id}`,
                                        search: `?page=profile`,
                                    }}
                                >
                                    <CardActionArea>
                                        <CardMedia
                                            sx={{
                                                width: 300,
                                                height: 180,
                                            }}
                                            component="img"
                                            image={
                                                user.shop.image_path == null
                                                    ? "/storage/template.png"
                                                    : `/storage/${user.shop.image_path}`
                                            }
                                            title={user.shop.name}
                                        />
                                    </CardActionArea>
                                </Link>
                                <CardContent>
                                    <Tooltip
                                        title={user.shop.name}
                                        followCursor
                                        placement="top"
                                    >
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                            sx={{
                                                ":hover": {
                                                    cursor: "default",
                                                },
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {user.shop.name}
                                        </Typography>
                                    </Tooltip>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        {user.shop.city}, {user.shop.address}
                                    </Typography>
                                    <Rating
                                        name="read-only"
                                        value={user.shop.rating}
                                        readOnly
                                    />
                                </CardContent>
                            </Card>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    setIsQuitting(true);
                                }}
                            >
                                Kil??p??s a boltb??l
                            </Button>
                        </Grid2>
                    )}

                    <Grid2
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid2>
                            <TextField
                                inputRef={city}
                                error={errors.city != null}
                                helperText={errors.city}
                                id="txfCity"
                                label="V??ros"
                                size="small"
                                defaultValue={City}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() =>
                                                setCity(txfCity.value)
                                            }
                                        >
                                            <Search />
                                        </IconButton>
                                    ),
                                }}
                                onChange={handleCityChange}
                            />
                        </Grid2>
                        <Grid2 sx={{ width: 330 }}>
                            <Map
                                key={City}
                                location={City || ""}
                                height={330}
                            />
                        </Grid2>
                        <Grid2>
                            <Button
                                variant="contained"
                                disabled={cityDisabled}
                                onClick={changeCity}
                            >
                                V??ros megv??ltoztat??sa
                            </Button>
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setIsDeleteing(true);
                        }}
                    >
                        Fi??k t??rl??se
                    </Button>
                </Grid2>
                <Snackbar
                    open={openAlert}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                >
                    <Alert
                        onClose={handleCloseAlert}
                        severity={severity}
                        sx={{ width: "100%" }}
                    >
                        {alertMessage}
                    </Alert>
                </Snackbar>

                {isQuitting && (
                    <Dialog
                        open={isQuitting}
                        onClose={() => setIsQuitting(false)}
                    >
                        <DialogTitle>Kil??p??s a boltb??l</DialogTitle>
                        <DialogContent>
                            Biztosan ki szeretne l??pni a boltb??l?
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    leaveShop();
                                }}
                            >
                                Kil??p??s
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIsQuitting(false);
                                }}
                                color="error"
                            >
                                M??gse
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}

                {isDeleteing && (
                    <Dialog
                        open={isDeleteing}
                        onClose={() => setIsDeleteing(false)}
                    >
                        <DialogTitle>Fi??k t??rl??se</DialogTitle>
                        <DialogContent>
                            Biztosan t??r??lni szeretn?? a fi??kj??t?
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    deleteProfile();
                                }}
                            >
                                T??rl??s
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIsDeleteing(false);
                                }}
                                color="error"
                            >
                                M??gse
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Grid2>
        </Box>
    );
}

export default Profile;
