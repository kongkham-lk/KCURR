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

export default function Footer(props) {
    const { isDisplaySM, isOutLineTheme } = props;

    return (
        <Box
            display='flex'
            sx={{
                minHeight: isDisplaySM ? '42vh' : '30vh',
                ...sxStyle.footerWrapper,
                ...(isOutLineTheme ? sxStyle.Theme.Outline : sxStyle.Theme.Elevate),
            }}
        >
            <Box sx={sxStyle.BoxSub}>
                <List sx={sxStyle.ListPopupSideBar} height={commonStyles.prop.fillAvailSpace}>
                    <ListItem key="product" disablePadding>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, }} gutterBottom>
                            Product
                        </Typography>
                    </ListItem>
                    {navItems.map((item) => {
                        return (
                            <ListItem key={item.label} disablePadding >
                                <ListItemButton sx={{ p: 0 }} href={item.link} >
                                    <Typography variant="overline">
                                        {item.label}
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                    <ListItem key="toolAndResource" disablePadding>
                        <Stack direction="row" alignItems="center">
                            <IconButton aria-label="github" size="large" sx={{ pl: 0 }} >
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
                    <ListItem key="copyRight" disablePadding>
                        <Typography variant="overline">
                            © 2023 KCURR Inc.
                        </Typography>
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
    footerWrapper: { width: '-webkit-fill-available' },
    IconButton: { mr: 1 },
    Typography: { flexGrow: 1, ...commonStyles.alignItemsCenter, justifyContent: 'left', },
    Link: { ...commonStyles.inheritColor, margin: "15px", ...commonStyles.noneTextDeco, ...commonStyles.alignItemsCenter },
    mainLogo: { ...commonStyles.inheritColor, ...commonStyles.noneTextDeco, },
    BoxSub: { alignItems: 'stretch', ml: 5 },
    Drawer: {
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
    },
    BoxPopupSideBar: { color: `#${baseColor.sub}` },
    ListPopupSideBar: { mt: '36px' },
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
