import { AppBar, Box, Button, IconButton, Link, Menu, MenuItem, MenuList, Typography, useTheme } from "@mui/material";
import { AccountCircleOutlined, DarkModeOutlined, LightModeOutlined, LogoutOutlined } from "@mui/icons-material";
import { IProfile } from "@/model/UserModel/IProfile";
import { logout } from "@/actions/auth";
import { useAppDispatch } from "@/hook";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "../themeSwitch";
import { IUser } from "@/model/UserModel";

type Props = {
    mode: 'light' | 'dark',
    toggleColorMode: () => void,
    userProfile: IProfile | undefined
}


const Header = ({ mode, toggleColorMode, userProfile }: Props) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const userData = localStorage.getItem('profile');

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const [user, setUser] = useState<IUser>();

    const open = Boolean(anchorEl)



    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    useEffect(() => {
        if (userData !== null) {
            const getUser = JSON.parse(userData)
            setUser(getUser.result)
        }

    }, [])

    const onLogOut = () => {
        dispatch(logout);
        window.location.reload()
        navigate('/login', { replace: true })
    }



    return (
        <AppBar sx={{
            backgroundColor: theme.palette.background.paper,
        }} position="sticky">
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4" >
                    <Link href='/home' sx={{ color: theme.palette.text.primary, textDecoration: 'none' }}>
                        Card Tracker
                    </Link>
                </Typography>
                {!userProfile && <div className="middle"> <h1>Please <a href="/login">Login</a> first</h1></div>}
                <Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}>
                    {
                        user &&
                        <Button onClick={handleClick}>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>{`${user.name}`}</Typography>
                        </Button>
                    }
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuList>
                            <MenuItem>
                                <IconButton
                                    onClick={() => navigate(`/accountSettings/${user?._id}`)}
                                    sx={{ color: theme.palette.text.primary }}
                                >
                                    <AccountCircleOutlined />
                                    <Typography variant="button">Profile</Typography>
                                </IconButton>
                            </MenuItem>
                            <MenuItem>
                                <IconButton onClick={onLogOut}>
                                    <LogoutOutlined color="error" />
                                    <Typography variant="button" sx={{ color: theme.palette.error.main }}>Log Out</Typography>
                                </IconButton>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <ThemeSwitch mode={mode} handleClick={toggleColorMode} theme={theme} />
                </Box>
            </Box>
        </AppBar >
    )
}

export default Header