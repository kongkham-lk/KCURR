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

export default function MainNav(props) {
  const { isDisplaySM, isOutLineTheme, onChangeTheme } = props;

  const [mobileScreen, setMobileScreen] = useState(false);
  const [state, setState] = useState(isOutLineTheme);

  const handleChange = () => {
    setState(!state);
    onChangeTheme(!state);
  };

  const handleDrawerToggle = () => {
    setMobileScreen((horizontalScreen) => !horizontalScreen);
  };

  return (
    <Box 
      display='flex' 
      sx={{
        ...(isDisplaySM ? sxStyle.StarterGapForMobile : sxStyle.StarterGap), 
        ...(isOutLineTheme ? sxStyle.Theme.Outline : sxStyle.Theme.Elevate)
        }}
    >
      <AppBar component="nav" sx={{ ...sxStyle.bringToTop, color: 'inherit' }}>
        <Toolbar id="subNav">
          <Typography id="navMain" variant="h6" sx={sxStyle.Typography} >
            <Link to={mainLogo.link} style={sxStyle.mainLogo}>
              <div style={style.logoImg}>
                <img src={embbedLogo.link} alt={embbedLogo.alt} style={style.logo} />
                {mainLogo.label}
              </div>
            </Link>
          </Typography>
          <Box sx={sxStyle.BoxSub}>
            {navItems.map((item) => (
                <Link id="navPage" to={item.link} key={item.label} style={{...sxStyle.Link, margin: '0px' }} >
                  <Box sx={sxStyle.Link}>
                    {item.label}
                  </Box>
                </Link>
            ))}
            <FormControl component="fieldset" variant="standard" sx={sxStyle.themeSetter}>
              <FormControlLabel
                mx={0}
                control={
                  <Switch checked={state.gilad} onChange={handleChange} defaultChecked/>
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
          <PopupSideBar navItems={navItems} handleDrawerToggle={handleDrawerToggle} isOutLineTheme={isOutLineTheme} onChangeTheme={onChangeTheme}/>
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

const PopupSideBar = ({ navItems, handleDrawerToggle, isOutLineTheme, onChangeTheme }) => {

  const Theme = {
    Outline: 'outline',
    Elevate: 'elevate',
  }

  const [alignment, setAlignment] = useState(isOutLineTheme ? Theme.Outline : Theme.Elevate);


  const handleChange = (event, newAlignment) => {
    if (newAlignment === null || newAlignment === alignment)
      return;

    setAlignment(newAlignment);
    onChangeTheme(newAlignment);
  };

  return (
    <Box onClick={handleDrawerToggle}>
      <List sx={sxStyle.ListPopupSideBar}>
        <Box  pt={1} px={3} pb={2.5} sx={{...sxStyle.ToggleButton}}>   
          <Typography variant="overline" display="block" color='gray'>Theme</Typography>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={sxStyle.ToggleButton}
          >
            <ToggleButton value={Theme.Elevate} sx={sxStyle.ToggleButton}>{Theme.Elevate}</ToggleButton>
            <ToggleButton value={Theme.Outline} sx={sxStyle.ToggleButton}>{Theme.Outline}</ToggleButton>
          </ToggleButtonGroup>
          </Box>
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

const baseColor = "1876d2";

const embbedLogo = {
  link: `https://img.icons8.com/sf-regular-filled/48/${baseColor}/currency-exchange.png`,
  alt: "KCURR App Logo",
};

const sxStyle = {
  StarterGap: { mb: 14, '& #subNav': {display: 'flex', alignItems: 'stretch'} },
  StarterGapForMobile: { mb: 12 },
  IconButton: { mr: 1, display: { sm: 'none' } },
  Typography: { flexGrow: 1, display: "flex", justifyContent: 'left', alignItems: 'center' },
  Link: { color: 'inherit', margin: "15px", textDecoration: "none", display: 'flex', alignItems: 'center'},
  mainLogo: { color: 'inherit', textDecoration: "none", },
  BoxSub: { display: { xs: 'none', sm: 'flex' }, alignItems: 'stretch' },
  Drawer: {
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
  },
  BoxPopupSideBar: { color: '#1976d2' },
  ListPopupSideBar: { my: 8 },
  ListItemPopupSideBar: {  },
  ListItemButtonPopupSideBar: { textAlign: 'left', borderBottom: "1px solid #00000030", margin: "0px 20px" },
  Theme: {
    Elevate: {color: 'white', '& img': {filter: 'saturate(0) brightness(100)'}, '& #navPage:hover': {borderBottom: '3px solid white'}, '& #navPage:hover div': {marginBottom: '12px'},},
    Outline: {
                color: `#${baseColor}`, fontWeight: 500,
                // '& img': {filter: 'saturate(0) brightness(0)'},
                '& nav': { boxShadow: 'none', background: 'white'}, 
                '& #navMain': { fontWeight: 600,}, 
                '& #subNav': {borderBottom: `1.5px solid #${baseColor}`},
                '& #navPage:hover': {borderBottom: `3px solid #${baseColor}`}, '& #navPage:hover div': {marginBottom: '12px'},
             },
  },
  themeSetter: {justifyContent: 'center', filter: 'brightness(0.61) contrast(4) saturate(0.3)', marginTop: '2px', marginRight: '-10px'},
  bringToTop: {zIndex: (theme) => theme.zIndex.drawer + 1},
  ToggleButton: {width: '-webkit-fill-available'}
}

const style = {
  logo: { width: "35px", height: "35px", margin: "0 8px 0 0" },
  Link: {color: "black", textDecoration: "none" },
  logoImg: { display: "flex", alignItems: "center", marginLeft: "15px" },
}
