import "../../App.css";
import React, { useState, useEffect } from "react";
import { retrieveFinancialNews } from "../../util/apiClient";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputTextField from "../subComponents/InputTextField";
import { Loading } from '../subComponents/Loading';
import FinancialNewsLists from "./FinancialNewsLists";
import { getUserPreferences, savePrefNewsCategories } from "../../hook/userController";
import { type NewsHeadlines, type User } from "../../lib/types";
import { getBaseColor, getTargetBaseColor } from "../../util/globalVariable";

type FinancialNewsProps = Omit<User, 'onThemeUpdate'> & {
    filter?: boolean;
    isDisplaySM: boolean;
    isOutLineTheme?: boolean;
    newsListsRes: NewsHeadlines[];
}

export default function FinancialNews(props: FinancialNewsProps) {
    const { filter = false, isDisplaySM, isOutLineTheme = true, userId, userPreference, newsListsRes } = props;
    // console.log("Load News!!! ", userPreference);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true); // everytime theme is set, all the state seems to be reset.
    const [newsHeadlinesList, setNewsHeadlinesList] = useState<NewsHeadlines[]>([...newsListsRes]);
    const [inputTrackerTopic, setInputTrackerTopic] = useState<string>("");
    const [newCategories, setNewCategories] = useState<string[]>(
        userPreference !== null && userPreference.newsCategories !== undefined ? [...userPreference.newsCategories] : []
    );
    const isDarkTheme = userPreference !== null && userPreference.theme === "dark";
    // console.log("Load News!!! ", newCategories)

    useEffect(() => {
        async function fetchNewsLists() {
            // console.log("--  >>> fetchNewsLists!!! ", newCategories)
            if (!isInitialLoad) { // Do not fetch new newsList if set new theme
                const newsRes = await retrieveFinancialNews(newCategories);
                if (newsRes !== null)
                    setNewsHeadlinesList(newsRes.data);
            } else {
                const newPref = await getUserPreferences(userId);
                if (newPref !== null && newPref.newsCategories !== undefined)
                    setNewCategories(newPref.newsCategories);
                setIsInitialLoad(false);
            }
        }
        fetchNewsLists();
    }, [isInitialLoad, newCategories, userId])


    const handleAddNewsTopic = () => {
        // console.log("Set News!!!")
        const newNewsTopicList = [...newCategories];
        newNewsTopicList.push(inputTrackerTopic);
        handleNewTopicsUpdate(newNewsTopicList);
        setInputTrackerTopic("") // reset the input tracker, the textbox, after added the news category
    }

    const handleInput = (e: HTMLTextAreaElement) => {
        const newTempInput = e.value;
        setInputTrackerTopic(newTempInput);
    }

    const handleDelete = (index: number) => {
        // console.log("Set News!!!")
        const newNewsTopicList = [...newCategories];
        newNewsTopicList.splice(index, 1);
        handleNewTopicsUpdate(newNewsTopicList);
    }

    const handleNewTopicsUpdate = (newNewsTopicList: string[]) => {
        setNewCategories(newNewsTopicList);
        handleNewsCategoriesCookieUpdate(newNewsTopicList);
    }

    const handleNewsCategoriesCookieUpdate = (newNewsTopics: string[]) => {
        console.log("Save new NewsCategories List to API!!!");
        savePrefNewsCategories(userId, newNewsTopics)
    }

    const targetHoverColor = getTargetBaseColor(isOutLineTheme, !isDarkTheme);

    return (
        <div style={style.div as React.CSSProperties}>
            {newsHeadlinesList.length > 0 ?
                <>
                    <div style={style.subDivHeading}>
                        <Typography
                            variant="h5"
                            color="inherit"
                            component="div"
                            style={{ margin: filter ? "16px 0px" : "16px 0 0 0" }}
                        >
                            {isDisplaySM ? "News" : "Financial News"}
                        </Typography>
                        {filter && <div style={{ ...style.subDivInputField.main, ...(isDisplaySM ? style.subDivInputField.sm : style.subDivInputField.lg) }}>
                            <InputTextField
                                onConvertAmountUpdate={handleInput}
                                inputFieldLabel={isDisplaySM ? "Categories" : "Input Categories"}
                                size="small"
                                displayInput={inputTrackerTopic}
                            />
                            <Button variant="contained" type="submit" onClick={handleAddNewsTopic} style={style.convertButton} >
                                Add
                            </Button>
                        </div>}
                    </div>
                    {filter && <Stack direction="row" style={style.Stack as React.CSSProperties}>
                        {(newCategories)?.map((topic, index) => (
                            <Chip key={topic} label={topic} variant="outlined" onDelete={() => handleDelete(index)} style={style.Chip} />
                        ))}
                    </Stack>}
                    {newsHeadlinesList.map(news => {
                        return (
                            <Link
                                key={news.title}
                                href={news.link}
                                className="hoverCard"
                                sx={isOutLineTheme ? sxStyle.Link.outline : sxStyle.Link.elevate}>
                                {!isDisplaySM ?
                                    <Card
                                        variant={isOutLineTheme ? "outlined" : "elevation"}
                                        sx={{
                                            ...sxStyle.Card, borderRadius: isOutLineTheme ? 0 : 1,
                                            border: isOutLineTheme ? 0 : 'auto',
                                            borderBottom: isOutLineTheme ? `1px solid rgba(224, 224, 224, ${isDarkTheme ? 0.20 : 1})` : 'auto',
                                            background: "none",
                                            padding: isOutLineTheme ? '15px 0px' : 'auto',
                                            '&:hover': !isOutLineTheme ? { boxShadow: '0px 0px 12px #644e243f', transition: '0.2s' } : '',
                                            '&:hover .hoverLink': !isOutLineTheme ? { color: '#0060cd' } : ''
                                        }}
                                    >
                                        {news.thumbnail !== null && !isDisplaySM && <CardMedia
                                            component="img"
                                            sx={sxStyle.CardMedia}
                                            image={news.thumbnail}
                                            alt="Live from space album cover"
                                        />}
                                        <Box sx={{ ...sxStyle.Box, '&:hover': isOutLineTheme ? { borderRight: `8px solid ${targetHoverColor}` } : '' }}>
                                            <FinancialNewsLists news={news} isDisplaySM={isDisplaySM} />
                                        </Box>
                                    </Card> :
                                    <FinancialNewsLists news={news} isDisplaySM={isDisplaySM} />}
                            </Link>
                        )
                    }
                    )}
                </>
                : <Loading />
            }
        </div>
    )
};

const sxStyle = {
    Box: {
        display: 'flex', flexDirection: "column", flex: '1 0 auto', justifyContent: "space-between",
        width: "min-content", padding: "20px"
    },
    Link: {
        elevate: { width: '100%', textDecoration: "none", margin: "7px 0" },
        outline: { margin: 0, textDecoration: 'none', color: "inherit" },
    },
    Card: { display: 'flex', width: '100%', },
    CardMedia: { width: 240, height: 180, objectFit: "cover" },
}

const style = {
    div: { display: "flex", flexDirection: "column", width: "100%" },
    subDivHeading: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
    subDivInputField: {
        main: { display: "flex", alignItems: "center", justifyContent: "flex-end" },
        lg: { width: "25%" },
        sm: { width: "60%" }
    },
    Stack: { display: "flex", flexWrap: "wrap", margin: "0px 0px 12px 0px" },
    Chip: { marginRight: "5px", marginBottom: "5px" },
    convertButton: { marginLeft: "8px", marginTop: "-1.5px" },
}

