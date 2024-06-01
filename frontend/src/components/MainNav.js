import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
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

export default function MainNav(props) {
  const { isDisplaySM } = props;

  const [mobileScreen, setMobileScreen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileScreen((horizontalScreen) => !horizontalScreen);
  };

  return (
    <Box display='flex' sx={isDisplaySM ? sxStyle.StarterGapForMobile : sxStyle.StarterGap}>
      <AppBar component="nav" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={sxStyle.Typography} >
            <Link to={mainLogo.link} style={sxStyle.mainLogo}>
              <div style={style.logoImg}>
                <img src={embbedLogo.link} alt={embbedLogo.alt} style={{...style.logo, filter: 'saturate(0) brightness(100)'}} />
                {mainLogo.label}
              </div>
            </Link>
          </Typography>
          <Box sx={sxStyle.BoxSub}>
            {navItems.map((item) => (
              <Link to={item.link} key={item.label} style={sxStyle.Link} >
                {item.label}
              </Link>
            ))}
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
          <PopupSideBar navItems={navItems} handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
      </Box>
    </Box>
  );
};

const drawerWidth = "-webkit-fill-available";
const mainLogo = { label: 'KCURR', link: "/" }
const navItems = [
  { label: 'Convertor', link: "/convertor" },
  { label: 'Financial News', link: "/financial-news" },
  { label: 'About', link: "/about" },
  { label: 'Contact', link: "/contact" },
];

const PopupSideBar = ({ navItems, handleDrawerToggle }) => {
  return (
    <Box onClick={handleDrawerToggle}>
      <List sx={sxStyle.ListPopupSideBar}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={sxStyle.ListItemButtonPopupSideBar} href={item.link} >
              <ListItemText primary={item.label} sx={{}}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
};

const embbedLogo = {
  link: "https://img.icons8.com/sf-regular-filled/48/1976d2/currency-exchange.png",
  alt: "KCURR App Logo",
};

const sxStyle = {
  StarterGap: { mb: 14 },
  StarterGapForMobile: { mb: 12 },
  IconButton: { mr: 2, display: { sm: 'none' } },
  Typography: { flexGrow: 1, display: "flex", justifyContent: 'left' },
  Link: { color: '#fff', margin: "15px", textDecoration: "none", },
  mainLogo: { color: '#fff', textDecoration: "none", },
  BoxSub: { display: { xs: 'none', sm: 'block' }, },
  Drawer: {
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
  },
  BoxPopupSideBar: { color: '#1976d2' },
  ListPopupSideBar: { my: 8 },
  ListItemPopupSideBar: {  },
  ListItemButtonPopupSideBar: { textAlign: 'left', borderBottom: "1px solid #00000030", margin: "0px 20px" },
}

const style = {
  logo: { width: "35px", height: "35px", filter: "invert(1)", margin: "0 8px 0 0" },
  Link: {color: "black", textDecoration: "none" },
  logoImg: { display: "flex", alignItems: "center", marginLeft: "15px" },
}
