import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { savePrefTheme } from '../hook/userController';

export default function MainNav(props) {
    const { isDisplayMD, isOutLineTheme, userId, userPreference, onThemeUpdate, currentUrl } = props;
    const [mobileScreen, setMobileScreen] = useState(false);
    const [state, setState] = useState(isOutLineTheme);

    // update userPref's theme base on user's interaction, then invoke outer layer's method to save new userPref to API
    const handleThemeUpdate = (newState) => {
        setState(newState);
        const newTheme = newState === true ? "outlined" : 'elevation';
        const newPreference = { ...userPreference };
        newPreference.theme = newTheme;
        console.log("Save new Theme!!!");
        onThemeUpdate(newState);
        savePrefTheme(userId, newTheme)
    };

    // determined if it is on mobile screen
    const handleDrawerToggle = () => {
        setMobileScreen((horizontalScreen) => !horizontalScreen);
    };

    // refresh webpage manually when the same link is clicked
    const handleRefreshPage = (link) => {
        if (link === currentUrl.pathname)
            window.location.reload();
    }

    return (
        <Box display='flex' sx={isOutLineTheme ? sxStyle.Theme.Outline : sxStyle.Theme.Elevate}>
            <AppBar component="nav" sx={{ ...sxStyle.bringToTop, ...commonStyles.inheritColor }}>
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
                            const isCurrentPage = (item.link.substring(item.link.indexOf("/") - 1) === currentUrl.pathname) // when current url is at homePage, '/' 
                                                    || (currentUrl.pathname !== "/" && item.link.substring(item.link.indexOf("/")).includes(currentUrl.pathname.substring(1)));
                            return (
                                <Link
                                    id="navPage"
                                    to={item.link}
                                    key={item.label}
                                    style={{
                                        ...sxStyle.Link,
                                        ...sxStyle.NonMargin,
                                        ...(isCurrentPage && {
                                            ...(isOutLineTheme ? commonStyles.navPageBorderBottom.Outline : commonStyles.navPageBorderBottom.Elevate),
                                        }),
                                    }}
                                    onClick={() => handleRefreshPage(item.link)}
                                >
                                    <Box sx={{ ...sxStyle.Link, ...(isCurrentPage && commonStyles.subNavPageMargin) }}>
                                        {isDisplayMD ? item.label.substring(item.label.indexOf(" ")) : item.label}
                                    </Box>
                                </Link>
                            )
                        })}
                        <FormControl component="fieldset" variant="standard" sx={sxStyle.themeSetter}>
                            <FormControlLabel
                                sx={sxStyle.NonMargin}
                                control={
                                    <Switch checked={!state} onChange={() => handleThemeUpdate(!state)} />
                                }
                            />
                        </FormControl>
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
                        isOutLineTheme={isOutLineTheme}
                        onThemeUpdate={handleThemeUpdate}
                    />
                </Drawer>
            </Box>
        </Box>
    );
};

const mainLogo = { label: 'KCURR', link: "/" }
const navItems = [
    { label: 'Dashboard', link: "/" },
    { label: 'Convertor', link: "/Convertor" },
    { label: 'Chart', link: "/Chart" },
    { label: 'Financial News', link: "/News" },
];

const PopupSideBar = ({ navItems, handleDrawerToggle, isOutLineTheme, onThemeUpdate }) => {

    const Theme = {
        Outline: { name: 'outline', isOutline: true },
        Elevate: { name: 'elevate', isOutline: false },
    }

    const [alignment, setAlignment] = useState(isOutLineTheme ? Theme.Outline.name : Theme.Elevate.name);

    const handleChange = (event, newAlignment) => {
        if (newAlignment === null || newAlignment === alignment)
            return;

        setAlignment(newAlignment);

        if (event.target.value === Theme.Outline.name)
            onThemeUpdate(Theme.Outline.isOutline);
        else if (event.target.value === Theme.Elevate.name)
            onThemeUpdate(Theme.Elevate.isOutline);
    };

    const checkToggleDrawer = (event) => {
        if (event.target.value !== Theme.Outline.name && event.target.value !== Theme.Elevate.name)
            handleDrawerToggle();
    }

    return (
        <Box onClick={checkToggleDrawer} height={commonStyles.prop.fillAvailSpace}>
            <List sx={sxStyle.ListPopupSideBar} height={commonStyles.prop.fillAvailSpace}>
                <Box pt={1} px={3} pb={2.5} sx={{ ...sxStyle.FillAllWidth }}>
                    <Typography variant="overline" display="block" color='gray'>Theme</Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                        sx={sxStyle.FillAllWidth}
                    >
                        <ToggleButton sx={sxStyle.FillAllWidth} value={Theme.Elevate.name}>{Theme.Elevate.name}</ToggleButton>
                        <ToggleButton sx={sxStyle.FillAllWidth} value={Theme.Outline.name}>{Theme.Outline.name}</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton sx={sxStyle.ListItemButtonPopupSideBar} href={item.link} >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
};

const baseColor = {
    main: "1876d2",
    sub: "1976d2"
};

const embbedLogo = {
    link: `https://img.icons8.com/sf-regular-filled/48/${baseColor.main}/currency-exchange.png`,
    alt: "KCURR App Logo",
};

const commonStyles = {
    navPageBorderBottom: {
        Elevate: { borderBottom: '4px solid white' },
        Outline: { borderBottom: `4px solid #${baseColor.main}` },
        ElevateHover: { borderBottom: '4px solid #ffffff99' },
        OutlineHover: { borderBottom: `4px solid #${baseColor.main}55` },
    },
    subNavPageMargin: { marginBottom: '11px' },
    alignItemsStretch: { display: 'flex', alignItems: 'stretch' },
    alignItemsCenter: { display: 'flex', alignItems: 'center' },
    inheritColor: { color: 'inherit' },
    noneTextDeco: { textDecoration: "none", },
    prop: {
        fillAvailSpace: '-webkit-fill-available'
    },
};

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
    BoxPopupSideBar: { color: `#${baseColor.sub}` },
    ListPopupSideBar: { my: 8 },
    ListItemButtonPopupSideBar: { textAlign: 'left', borderBottom: "1px solid #00000030", margin: "0px 20px" },
    Theme: {
        Elevate: {
            color: 'white',
            '& img': { filter: 'saturate(0) brightness(100)' },
            '& #navPage:hover': { ...commonStyles.navPageBorderBottom.ElevateHover },
            '& #navPage:hover div': { ...commonStyles.subNavPageMargin },
        },
        Outline: {
            color: `#${baseColor.main}`,
            fontWeight: 500,
            '& nav': { boxShadow: 'none', background: 'white' },
            '& #navMain': { fontWeight: 600, },
            '& #subNav': { borderBottom: `1.5px solid #${baseColor.main}55`, ...commonStyles.alignItemsStretch },
            '& #navPage:hover': { ...commonStyles.navPageBorderBottom.OutlineHover },
            '& #navPage:hover div': { ...commonStyles.subNavPageMargin },
        },
    },
    themeSetter: { justifyContent: 'center', filter: 'brightness(0.61) contrast(4) saturate(0.3)', marginTop: '2px', marginRight: '-10px' },
    bringToTop: { zIndex: (theme) => theme.zIndex.drawer + 1 },
    FillAllWidth: { width: commonStyles.prop.fillAvailSpace },
    NonMargin: { margin: '0px' }
}

const style = {
    logo: { width: "30px", height: "30px", margin: "0 8px 0 0" },
    Link: { color: "black", ...commonStyles.noneTextDeco },
    logoImg: { ...commonStyles.alignItemsCenter, marginLeft: "15px" },
}
