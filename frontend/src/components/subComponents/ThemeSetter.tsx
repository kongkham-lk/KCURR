import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ContrastIcon from '@mui/icons-material/Contrast';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { getBaseColor, getThemeOptions } from '../../util/globalVariable';
import { ThemeOption, type User } from '../../lib/types';

type ThemeSetterProps = Omit<User, "userId">;

export default function ThemeSetter(props: ThemeSetterProps) {
    const { userPreference, onThemeUpdate } = props;
    const [theme, setTheme] = useState<string>(userPreference.theme)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isDarkTheme = userPreference.theme === "dark";
    const targetGrey = !isDarkTheme ? baseColor.greyDark : baseColor.greyLight;

    // reload again when getting the correct theme set on initial load
    useEffect(() => {

    }, [theme])

    // cant specify the right type of param somehow
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const getThemeIcon = (targetTheme: string | undefined, styling = {}, isPrimary = false) => {
        if (targetTheme === "light")
            return <LightModeOutlinedIcon fontSize="small" sx={styling} color={isPrimary ? "primary" : undefined} />
        else if (targetTheme === "dark")
            return <DarkModeOutlinedIcon fontSize="small" sx={styling} />
        else
            return <ContrastIcon fontSize="small" sx={styling} />
    }

    const handleThemeUpdate = (newTheme: ThemeOption): void => {
        console.log("handleThemeUpdate: ", newTheme);
        onThemeUpdate(newTheme.iconType);
        setTheme(newTheme.iconType);
    }

    const sxStyle = {
        mainTheme: { color: theme === "light" ? "" : "white", },
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
                sx={sxStyle.mainTheme}
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
                    sx: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '15ch',
                        p: 1,
                        '& ul': { p: 0 }
                    },
                }}
            >
                <MenuItem key="Back" onClick={handleClose}>
                    <ArrowBackIosOutlinedIcon fontSize="small" sx={{ color: targetGrey }} /> <span style={{ marginLeft: "10px", color: targetGrey }}>Back</span>
                </MenuItem>
                {themeOptions.map((option) => (
                    <MenuItem key={option.iconType} selected={option.iconType.toLowerCase() === theme} onClick={() => handleThemeUpdate(option)}>
                        {getThemeIcon(option.iconType)} <span style={{ marginLeft: "10px" }}>{option.label}</span>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

const themeOptions = getThemeOptions();
const baseColor = getBaseColor();

const ITEM_HEIGHT = 48;