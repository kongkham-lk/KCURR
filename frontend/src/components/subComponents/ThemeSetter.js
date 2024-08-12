import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ContrastIcon from '@mui/icons-material/Contrast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const options = [
    { iconType: 'color', label: 'Color' },
    { iconType: 'light', label: 'Light' },
    { iconType: 'dark', label: 'Dark' },
];

const ITEM_HEIGHT = 48;

export default function ThemeSetter(props) {
    const { userPreference, onThemeUpdate } = props;
    const [theme, setTheme] = useState(userPreference.theme)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    console.log("theme: ", theme)

    useEffect(() => {

    }, [theme])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getThemeIcon = (targetTheme, styling = {}, isPrimary = false) => {
        if (targetTheme === "light")
            return <LightModeIcon sx={styling} color={isPrimary ? "primary" : ""}/>
        else if (targetTheme === "dark")
            return <DarkModeIcon sx={styling} />
        else
            return <ContrastIcon sx={styling} />
    }

    const handleThemeUpdate = (newTheme) => {
        console.log("handleThemeUpdate: ", newTheme);
        onThemeUpdate(newTheme.iconType);
        setTheme(newTheme.iconType);
    }
console.log(theme)
    const sxStyle = {
        mainTheme: { width: "30px", height: "30px", color: theme === "light" ? "" : "white", },
    }

    return (
        <div>
            <IconButton
                aria-label="Set Theme"
                id="theme-Setter"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                iconStyle={sxStyle.mainTheme}
            >
                {getThemeIcon(theme, sxStyle.mainTheme, true)}
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        // width: '20ch',
                    },
                }}
            >
                <MenuItem key="Back" onClick={handleClose}>
                    <ArrowBackIcon /> <span style={{ marginLeft: "10px" }}>Back</span>
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.iconType} selected={option.iconType.toLowerCase() === theme} onClick={() => handleThemeUpdate(option)}>
                        {getThemeIcon(option.iconType)} <span style={{ marginLeft: "10px" }}>{option.label}</span>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}