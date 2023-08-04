import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function MainNav() {
  const [mobileScreen, setMobileScreen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileScreen((horizontalScreen) => !horizontalScreen);
  };

  return (
    <Box sx={sxStyle.BoxMain}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={sxStyle.IconButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={sxStyle.Typography} >
            <Link to={mainLogo.link} style={sxStyle.mainLogo}>
              <div style={style.logoImg}>
                <img width="60" height="60" src={embbedLogo.link} alt={embbedLogo.alt} style={style.logo} />
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
        </Toolbar>
      </AppBar>
      <Box>
        <Drawer
          variant="temporary"
          open={mobileScreen}
          onClose={handleDrawerToggle}
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

const drawerWidth = 240;
const mainLogo = { label: 'KCURR', link: "/" }
const navItems = [
  { label: 'Convertor', link: "/convertor" },
  { label: 'Financial News', link: "/financial-news" },
  { label: 'About', link: "/about" },
  { label: 'Contact', link: "/contact" },
];

const PopupSideBar = ({ navItems, handleDrawerToggle }) => {
  return (
    <Box onClick={handleDrawerToggle} sx={sxStyle.BoxPopupSideBar}>
      <Typography variant="h6" sx={sxStyle.TypographyPopupSideBar}>
        {mainLogo.label}
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={sxStyle.ListItemButtonPopupSideBar}>
              <Link href={item.link} underline="none" style={style.Link}>
                {item.label}
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
};

const embbedLogo = {
  link: "https://img.icons8.com/external-icongeek26-outline-icongeek26/64/external-money-currency-icongeek26-outline-icongeek26-9.png",
  alt: "external-money-currency-icongeek26-outline-icongeek26-9",
};

const sxStyle = {
  BoxMain: { display: 'flex', mb: 14 },
  IconButton: { mr: 2, display: { sm: 'none' } },
  Typography: { flexGrow: 1, display: "flex", justifyContent: { xs: 'center', sm: 'left' }, marginLeft: { xs: '-100px', sm: 'auto' }},
  Link: { color: '#fff', margin: "15px", textDecoration: "none", },
  mainLogo: { color: '#fff', textDecoration: "none", },
  BoxSub: { display: { xs: 'none', sm: 'block' }, },
  Drawer: {
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
  },
  BoxPopupSideBar: { textAlign: 'center' },
  TypographyPopupSideBar: { my: 2 },
  ListItemButtonPopupSideBar: { textAlign: 'center' },
}

const style = {
  logo: { width: "42px", height: "42px", filter: "invert(1)", margin: "0 8px 0 0" },
  Link: {color: "black", textDecoration: "none"},
  logoImg: { display: "flex", alignItems: "center", marginLeft: "15px" },
}