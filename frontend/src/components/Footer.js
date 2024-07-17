import { useState } from 'react';
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
import Stack from '@mui/material/Stack';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer(props) {
    const { isDisplaySM, isOutLineTheme } = props;

    return (
        <Box
            display='flex'
            sx={{
                ...sxStyle.footerWrapper,
                ...(isOutLineTheme ? sxStyle.Theme.Outline : sxStyle.Theme.Elevate),
            }}
        >
            <Box sx={sxStyle.BoxSub}>
                <List sx={sxStyle.ListPopupSideBar} height={commonStyles.prop.fillAvailSpace}>
                    <ListItem key="product" sx={{ ml: 4.5, mt: 1 }} disablePadding>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, }} gutterBottom>
                            Product
                        </Typography>
                    </ListItem>
                    {navItems.map((item) => {
                        return (
                            <ListItem key={item.label} disablePadding >
                                <ListItemButton sx={sxStyle.ListItemButtonPopupSideBar} href={item.link} >
                                    <Typography variant="overline">
                                        {item.label}
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                    <ListItem key="toolAndResource" sx={{ ml: 3.5, mt: 1 }} disablePadding>
                        <Stack direction="row" alignItems="center">
                            <IconButton aria-label="github" size="large" >
                                <GitHubIcon sx={{ color: !isOutLineTheme ? 'white' : `#${baseColor.main}` }} />
                            </IconButton>
                            <IconButton aria-label="linkedin" size="large" >
                                <LinkedInIcon sx={{ color: !isOutLineTheme ? 'white' : `#${baseColor.main}` }} />
                            </IconButton>
                            <IconButton aria-label="instagram" size="large">
                                <InstagramIcon sx={{ color: !isOutLineTheme ? 'white' : `#${baseColor.main}` }} />
                            </IconButton>
                        </Stack>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

const baseColor = {
    main: "1876d2",
    sub: "1976d2"
};

const navItems = [
    { label: 'Dashboard', link: "/" },
    { label: 'Convertor', link: "/Convertor" },
    { label: 'Chart', link: "/Chart" },
    { label: 'Financial News', link: "/News" },
];

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
    inheritColor: { color: 'black' },
    noneTextDeco: { textDecoration: "none", },
    prop: {
        fillAvailSpace: '-webkit-fill-available'
    },
};

const drawerWidth = commonStyles.prop.fillAvailSpace;

const sxStyle = {
    footerWrapper: { width: '-webkit-fill-available', mt: 5 },
    IconButton: { mr: 1 },
    Typography: { flexGrow: 1, ...commonStyles.alignItemsCenter, justifyContent: 'left', },
    Link: { ...commonStyles.inheritColor, margin: "15px", ...commonStyles.noneTextDeco, ...commonStyles.alignItemsCenter },
    mainLogo: { ...commonStyles.inheritColor, ...commonStyles.noneTextDeco, },
    BoxSub: { alignItems: 'stretch' },
    Drawer: {
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
    },
    BoxPopupSideBar: { color: `#${baseColor.sub}` },
    ListPopupSideBar: { mt: '36px', mb: '12px' },
    ListItemButtonPopupSideBar: { textAlign: 'left', margin: "0px 20px", py: 0 },
    Theme: {
        Elevate: {
            color: 'white',
            background: `#${baseColor.main}`,
            '& img': { filter: 'saturate(0) brightness(100)' },
            '& #navPage:hover': { ...commonStyles.navPageBorderBottom.ElevateHover },
            '& #navPage:hover div': { ...commonStyles.subNavPageMargin },
        },
        Outline: {
            color: `#${baseColor.main}`,
            borderTop: `1.5px solid #${baseColor.main}55`
        },
    },
    themeSetter: { justifyContent: 'center', filter: 'brightness(0.61) contrast(4) saturate(0.3)', marginTop: '2px', marginRight: '-10px' },
    bringToTop: { zIndex: (theme) => theme.zIndex.drawer + 1 },
    FillAllWidth: { width: commonStyles.prop.fillAvailSpace },
    NonMargin: { margin: '0px' }
}
