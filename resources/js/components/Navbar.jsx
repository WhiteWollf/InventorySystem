import { Inventory, Notifications } from "@mui/icons-material";
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    styled,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from "@mui/material";
import Image from "mui-image";
import { useEffect, useState } from "react";
import TabPanel from "./TabPanel";
import React from "react";
import { Link } from "react-router-dom";
import { deepOrange } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import MyAvatar from "./MyAvatar";

function Navbar(props) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    /*<Box sx={{width: '100%'}}>
            <Box sx={{borderBottom : 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Tab 1"></Tab>
                    <Tab label="Tab 2"></Tab>
                    <Tab label="Tab 3"></Tab>
                </Tabs>
            </Box>            
            <TabPanel value={value} index={0}>
                Tab 1
            </TabPanel>
            <TabPanel value={value} index={1}>
                Tab 2
            </TabPanel>
            <TabPanel value={value} index={2}>
                Tab 3
            </TabPanel>
        </Box>
        */

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton
                    sx={{
                        color: "white",
                        display: { xs: "block", sm: "none" },
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Link to="/">
                    <Image
                        src="./images/logo.png"
                        width="150px"
                        duration={500}
                    />
                </Link>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Link to="/shops">
                        <Button sx={{ color: "white" }}>Boltok</Button>
                    </Link>
                    <Link to="/login">
                        <Button
                            sx={{
                                color: "white",
                                display: isAdmin ? "inline" : "none",
                            }}
                        >
                            Termékek
                        </Button>
                    </Link>
                </Box>
                <Box
                    sx={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                    <Badge badgeContent={2} color="error">
                        <Notifications />
                    </Badge>
                    <Box
                        onClick={handleClick}
                        sx={{
                            ":hover": { cursor: "pointer" },
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <MyAvatar name={props.name} />
                        <Typography
                            variant="p"
                            sx={{ display: { xs: "none", sm: "block" } }}
                        >
                            {props.name}
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{ display: { xs: "block", sm: "none" } }}
                >
                    {props.name}
                </Typography>
                <Divider sx={{ display: { xs: "block", sm: "none" } }} />
                <Link to="/profile">
                    <MenuItem onClick={handleClose}>Profil</MenuItem>
                </Link>
                <Link to="/login">
                    <MenuItem onClick={handleClose}>Kijelentkezés</MenuItem>
                </Link>
            </Menu>
        </AppBar>
    );
}

export default Navbar;