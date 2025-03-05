import React, { MouseEvent, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { savePrefTheme } from '../hook/userController';
import ThemeSetter from './subComponents/ThemeSetter';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ContrastIcon from '@mui/icons-material/Contrast';
import { getBaseColor, getTargetBaseColor, getThemeOptions } from '../util/globalVariable';
import { type DisplayFlags, type ThemeOption, type User } from '../lib/types';

type MainNavProps = DisplayFlags & User & {
    currentPath: string;
    isOutLineTheme: boolean;
}

type navItem = {
    label: string;
    link: string;
}

type PopupSideBarProps = {
    navItems: navItem[];
    handleDrawerToggle: () => void;
    onThemeUpdate: (newState: string) => Promise<void>
    state: string
}

export default function MainNav(props: MainNavProps) {
    const { isDisplayMD, isOutLineTheme, userId, userPreference, onThemeUpdate, currentPath } = props;
    const [mobileScreen, setMobileScreen] = useState<boolean>(false);
    const [state, setState] = useState<string>(userPreference !== null ? userPreference.theme : "");
    const isLightTheme = state === "light";

    // update userPref's theme base on user's interaction, then invoke outer layer's method to save new userPref to API
    const handleThemeUpdate = async (newState: string) => {
        setState(newState);
        console.log("Save new Theme!!!", newState);
        onThemeUpdate(newState);
        await savePrefTheme(userId, newState);
    };

    // determined if it is on mobile screen
    const handleDrawerToggle = () => {
        setMobileScreen((horizontalScreen) => !horizontalScreen);
    };

    // refresh webpage manually when the same link is clicked
    const handleRefreshPage = (link: string) => {
        if (link === currentPath)
            window.location.reload();
    }

    const targetBaseColor: string = getTargetBaseColor(isOutLineTheme, isLightTheme);
    const targetBackgroundColor: string = isOutLineTheme && state === "light" ? "white" : "";

    return (
        <Box
            display='flex'
            sx={
                isOutLineTheme ?
                    isLightTheme ? sxStyle.Theme.Outline.light
                        : sxStyle.Theme.Outline.dark
                    : sxStyle.Theme.Elevate
            }>
            <AppBar
                component="nav"
                sx={{ ...sxStyle.bringToTop, backgroundColor: targetBackgroundColor }}
            >
                <Toolbar id="subNav" sx={commonStyles.alignItemsStretch}>
                    <Typography id="navMain" variant="h6" sx={sxStyle.Typography} >
                        <Link to={mainLogo.link} style={sxStyle.mainLogo}>
                            <div style={style.logoImg}>
                                <img src={embbedLogo.link} alt={embbedLogo.alt} style={style.logo} />
                                {mainLogo.label}
                            </div>
                        </Link>
                    </Typography>
                    <Box sx={sxStyle.BoxSub}>
                        {navItems.map((item) => {
                            const isCurrentPage = (item.link.substring(item.link.indexOf("/") - 1) === currentPath) // when current url is at homePage, '/' 
                                || (currentPath !== "/" && item.link.substring(item.link.indexOf("/")).includes(currentPath.substring(1)));
                            return (
                                <Link
                                    id="navPage"
                                    to={item.link}
                                    key={item.label}
                                    style={{
                                        ...sxStyle.Link,
                                        ...sxStyle.NonMargin,
                                        borderBottom: isCurrentPage ? `4px solid ${targetBaseColor}` : "",
                                        // '& :hover': { borderBottom: `4px solid ${targetBaseColor}99` },
                                        ...(getHoverLink(targetBaseColor))
                                    }}
                                    onClick={() => handleRefreshPage(item.link)}
                                >
                                    <Box sx={{ ...sxStyle.Link, ...(isCurrentPage && commonStyles.subNavPageMargin) }}>
                                        {isDisplayMD ? item.label.substring(item.label.indexOf(" ")) : item.label}
                                    </Box>
                                </Link>
                            )
                        })}
                        <Box sx={{ ...sxStyle.themeSetter, display: "flex", alignItems: "center" }} >
                            <ThemeSetter userPreference={userPreference} onThemeUpdate={handleThemeUpdate} />
                        </Box>
                    </Box>
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerToggle}
                        sx={sxStyle.IconButton}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box>
                <Drawer
                    variant="temporary"
                    open={mobileScreen}
                    onClose={handleDrawerToggle}
                    anchor="right"
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={sxStyle.Drawer}
                >
                    <PopupSideBar
                        navItems={navItems}
                        handleDrawerToggle={handleDrawerToggle}
                        onThemeUpdate={handleThemeUpdate}
                        state={state}
                    />
                </Drawer>
            </Box>
        </Box>
    );
};

const mainLogo: navItem = { label: 'KCURR', link: "/" }
const navItems: navItem[] = [
    { label: 'Dashboard', link: "/" },
    { label: 'Convertor', link: "/convertor" },
    { label: 'Chart', link: "/chart" },
    { label: 'Financial News', link: "/news" },
];

const PopupSideBar = ({ navItems, handleDrawerToggle, onThemeUpdate, state }: PopupSideBarProps) => {

    const themeOptions: ThemeOption[] = getThemeOptions();

    const getThemeIcon = (targetTheme: string, styling = {}, isPrimary = false) => {
        if (targetTheme === "light")
            return <LightModeOutlinedIcon sx={styling} color={isPrimary ? "primary" : undefined} />
        else if (targetTheme === "dark")
            return <DarkModeOutlinedIcon sx={styling} />
        else
            return <ContrastIcon sx={styling} />
    }

    const [theme, setTheme] = useState<string>(state);

    const handleChange = (event: MouseEvent, newTheme: string | null) => {
        if (newTheme === null || newTheme === theme)
            return;
        console.log("Save theme!!! ", newTheme)
        setTheme(newTheme);
        onThemeUpdate(newTheme);
    };

    const checkToggleDrawer = () => {
        // console.log(newTheme)
        // const checkEachTargetTheme = obj => obj.iconType == newTheme;
        // if (!themeOptions.some(checkEachTargetTheme))
        handleDrawerToggle();
    }

    return (
        <Box onClick={checkToggleDrawer} height={commonStyles.prop.fillAvailSpace}>
            <List sx={{ ...sxStyle.ListPopupSideBar, height: commonStyles.prop.fillAvailSpace }}>
                <Box pt={1} px={3} pb={2.5} sx={{ ...sxStyle.FillAllWidth }}>
                    <Typography variant="overline" display="block" color='gray'>Theme</Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={theme}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                        sx={sxStyle.FillAllWidth}
                    >
                        {themeOptions.map((option) => (
                            <ToggleButton key={option.iconType} sx={sxStyle.FillAllWidth} value={option.iconType}> {/* onClick={() => checkToggleDrawer(option.iconType)}> */}
                                {getThemeIcon(option.iconType)}<span style={{ marginLeft: "10px" }}>{option.label}</span>
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <Link style={sxStyle.link} to={item.link} >
                            <ListItemText primary={item.label} />
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
};

const baseColor = getBaseColor();

const embbedLogo = {
    link: `https://img.icons8.com/sf-regular-filled/48/${baseColor.lightPrimary.substring(1)}/currency-exchange.png`,
    alt: "KCURR App Logo",
};

const commonStyles = {
    subNavPageMargin: { marginBottom: '11px' },
    alignItemsStretch: { display: 'flex', alignItems: 'stretch' },
    alignItemsCenter: { display: 'flex', alignItems: 'center' },
    inheritColor: { color: 'inherit' },
    noneTextDeco: { textDecoration: "none", },
    prop: { fillAvailSpace: '-webkit-fill-available' },
};

const mainOutlineStyle = {
    fontWeight: 500,
    '& #navMain': { fontWeight: 600, },
    '& #navPage:hover div': { ...commonStyles.subNavPageMargin },
}

const drawerWidth = commonStyles.prop.fillAvailSpace;

const sxStyle = {
    IconButton: { mr: 1, display: { sm: 'none' } },
    Typography: { flexGrow: 1, ...commonStyles.alignItemsCenter, justifyContent: 'left', },
    Link: { ...commonStyles.inheritColor, margin: "15px", ...commonStyles.noneTextDeco, ...commonStyles.alignItemsCenter },
    mainLogo: { ...commonStyles.inheritColor, ...commonStyles.noneTextDeco, },
    BoxSub: { display: { xs: 'none', sm: 'flex' }, alignItems: 'stretch' },
    Drawer: {
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
    },
    BoxPopupSideBar: { color: baseColor.lightPrimary },
    ListPopupSideBar: { my: 8 },
    ListItemButtonPopupSideBar: { textAlign: 'left', borderBottom: "1px solid #00000030", margin: "0px 20px" },
    Theme: {
        Elevate: {
            color: baseColor.white,
            '& img': { filter: 'saturate(0) brightness(100)' },
            '& #navPage:hover': { borderBottom: `4px solid ${baseColor.white}99` },
            '& #navPage:hover div': { ...commonStyles.subNavPageMargin },
        },
        Outline: {
            light: {
                ...mainOutlineStyle,
                '& nav': { color: baseColor.lightPrimary, boxShadow: 'none' },
                '& #subNav': { borderBottom: `1.5px solid ${baseColor.lightPrimary}55`, ...commonStyles.alignItemsStretch },
                '& #navPage:hover': { borderBottom: `4px solid ${baseColor.lightPrimary}55` },
            },
            dark: {
                ...mainOutlineStyle,
                '& nav': { color: baseColor.white, boxShadow: 'none' },
                '& #subNav': { borderBottom: `1.5px solid ${baseColor.darkPrimary}55`, ...commonStyles.alignItemsStretch },
                '& #navPage:hover': { borderBottom: `4px solid ${baseColor.darkPrimary}55` },
            }
        },
    },
    themeSetter: { justifyContent: 'center', marginTop: '2px', marginRight: '-10px' },
    bringToTop: { zIndex: (theme: any) => theme.zIndex.drawer + 1 },
    FillAllWidth: { width: commonStyles.prop.fillAvailSpace },
    NonMargin: { margin: '0px' },
    link: {color: 'inherit', textDecoration: 'none', width: '100%', margin: '0px 5%', padding: '2% 5%', borderBottom: '1px solid rgb(170, 170, 170, 0.35)'}
}

const style = {
    logo: { width: "30px", height: "30px", margin: "0 8px 0 0" },
    Link: { color: "black", ...commonStyles.noneTextDeco },
    logoImg: { ...commonStyles.alignItemsCenter, marginLeft: "15px" },
}


const getHoverLink = (targetBaseColor: string) => {
    return { '& :hover': { borderBottom: `4px solid ${targetBaseColor}99` } }
}