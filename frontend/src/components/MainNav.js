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
import Link from '@mui/material/Link';

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
            <Link href={mainLogo.link} underline="none" sx={sxStyle.Link} >
              {mainLogo.label}
            </Link>
          </Typography>
          <Box sx={sxStyle.BoxSub}>
            {navItems.map((item) => (
              <Link href={item.link} underline="none" key={item.label} sx={sxStyle.Link} >
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
const mainLogo = { label: 'KCURR', link: "#" }
const navItems = [
  { label: 'Rate', link: "#" },
  { label: 'News', link: "#" },
  { label: 'About', link: "#" },
  { label: 'Contact', link: "#" },
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
              <Link href={item.link} underline="none">
                {item.label}
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
};

const sxStyle = {
  BoxMain: { display: 'flex', mb: 14 },
  IconButton: { mr: 2, display: { sm: 'none' } },
  Typography: { flexGrow: 1, display: { xs: 'none', sm: 'block' } },
  Link: { color: '#fff', margin: "15px" },
  BoxSub: { display: { xs: 'none', sm: 'block' }, },
  Drawer: {
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
  },
  BoxPopupSideBar: { textAlign: 'center' },
  TypographyPopupSideBar: { my: 2 },
  ListItemButtonPopupSideBar: { textAlign: 'center' },
}
