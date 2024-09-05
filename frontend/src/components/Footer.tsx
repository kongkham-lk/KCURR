import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AppBar from '@mui/material/AppBar';
import { getBaseColor, getTargetBaseColor } from '../util/globalVariable';
import React from 'react';
import { type DisplayFlags, type Preference } from '../lib/types';

type FooterProps = DisplayFlags & {
    isOutLineTheme: boolean;
    userPreference: Preference | null;
}

export default function Footer(props: FooterProps) {
    const { isDisplaySM, isOutLineTheme, userPreference } = props;
    const isLightTheme = userPreference === null || userPreference.theme === "light";
    const targetBaseColor = getTargetBaseColor(isOutLineTheme, isLightTheme);

    return (
        <Box
            display='flex'
            sx={{
                minHeight: isDisplaySM ? '42vh' : '30vh',
                ...sxStyle.footerWrapper,
            }}
        >
            <AppBar component="nav" position="relative" sx={{
                ...(isOutLineTheme ?
                    isLightTheme ? sxStyle.Theme.Outline.light
                        : sxStyle.Theme.Outline.dark
                    : sxStyle.Theme.Elevate)
            }}>
                <Box sx={sxStyle.BoxSub}>
                    <List sx={{...sxStyle.ListPopupSideBar, height:commonStyles.prop.fillAvailSpace}}>
                        <ListItem key="product" disablePadding>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, }} gutterBottom>
                                Product
                            </Typography>
                        </ListItem>
                        {navItems.map((item) => {
                            return (
                                <ListItem key={item.label} disablePadding sx={{ width: "fit-content" }} >
                                    <ListItemButton sx={{
                                        p: 0, '&:hover': {
                                            borderLeft: `3px solid ${targetBaseColor}`,
                                            margin: "0 0 0 -18px",
                                            padding: "0 15px",
                                            background: `none`,
                                        }
                                    }} href={item.link} >
                                        <Typography variant="overline">
                                            {item.label}
                                        </Typography>
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                        <ListItem key="toolAndResource" disablePadding>
                            <Stack direction="row" alignItems="center">
                                <IconButton aria-label="github" size="large" sx={{ ml: -1.5 }} >
                                    <GitHubIcon sx={{ color: !isLightTheme ? 'white' : baseColor.lightPrimary }} />
                                </IconButton>
                                <IconButton aria-label="linkedin" size="large" >
                                    <LinkedInIcon sx={{ color: !isLightTheme ? 'white' : baseColor.lightPrimary }} />
                                </IconButton>
                                <IconButton aria-label="instagram" size="large">
                                    <InstagramIcon sx={{ color: !isLightTheme ? 'white' : baseColor.lightPrimary }} />
                                </IconButton>
                            </Stack>
                        </ListItem>
                        <ListItem key="copyRight" disablePadding>
                            <Typography variant="overline">
                                © 2023 KCURR Inc.
                            </Typography>
                        </ListItem>
                    </List>
                </Box>
            </AppBar>
        </Box>
    );
};

const baseColor = getBaseColor();

const navItems = [
    { label: 'Dashboard', link: "/" },
    { label: 'Convertor', link: "/Convertor" },
    { label: 'Chart', link: "/Chart" },
    { label: 'Financial News', link: "/News" },
];

const commonStyles = {
    navPageBorderBottom: {
        Elevate: { borderBottom: `4px solid ${baseColor.white}` },
        Outline: { borderBottom: `4px solid ${baseColor.lightPrimary}` },
        ElevateHover: { borderBottom: `4px solid ${baseColor.white}99` },
        OutlineHover: { borderBottom: `4px solid ${baseColor.lightPrimary}55` },
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
    footerWrapper: { width: '-webkit-fill-available' },
    IconButton: { mr: 1 },
    Typography: { flexGrow: 1, ...commonStyles.alignItemsCenter, justifyContent: 'left', },
    Link: { ...commonStyles.inheritColor, margin: "15px", ...commonStyles.noneTextDeco, ...commonStyles.alignItemsCenter },
    mainLogo: { ...commonStyles.inheritColor, ...commonStyles.noneTextDeco, },
    BoxSub: { alignItems: 'stretch', ml: 5 },
    Drawer: {
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
    },
    BoxPopupSideBar: { color: baseColor.lightPrimary },
    ListPopupSideBar: { mt: '36px' },
    ListItemButtonPopupSideBar: { textAlign: 'left', margin: "0px 20px", py: 0 },
    Theme: {
        Elevate: {
            '& img': { filter: 'saturate(0) brightness(100)' },
            '& #navPage:hover': { borderBottom: `4px solid ${baseColor.white}99` },
            '& #navPage:hover div': { ...commonStyles.subNavPageMargin },
        },
        Outline: {
            light: {
                color: baseColor.lightPrimary,
                background: baseColor.white,
                borderTop: `1.5px solid ${baseColor.lightPrimary}55`
            },
            dark: {
                color: baseColor.white,
                background: baseColor.black,
                borderTop: `1.5px solid ${baseColor.darkPrimary}55`
            }
        },
    },
    themeSetter: { justifyContent: 'center', filter: 'brightness(0.61) contrast(4) saturate(0.3)', margin: '2px -10px 0 0' },
    FillAllWidth: { width: commonStyles.prop.fillAvailSpace },
    NonMargin: { margin: '0px' },
    ListItemButton: {
        borderLeft: "3px solid", margin: "0 0 0 -18px", padding: "0 0 0 15px", background: "none",
        filter: "saturate(0.5) brightness(1.5)"
    },
}
