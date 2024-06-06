import "../../App.css";
import { useState, useEffect } from "react";
import { retrieveFinancialNews } from "../../util/apiClient";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputTextField from "../InputTextField";
import { Loading } from '../Loading';
import FinancialNewsLists from "./FinancialNewsLists";

export default function FinancialNews(props) {
    const { filter = false, isDisplaySM, isOutLineTheme } = props;
    const [newsLists, setNewsLists] = useState([]);
    const [tempTopic, setTempTopic] = useState("");
    const [newsTopic, setNewsTopic] = useState(["Stock", "Business", "Finance", "Bank", "Investment", "Trading", "Tesla", "Apple", "Facebook", "Cryptocurrency",]);

    useEffect(() => {
        async function fetchNewsLists() {
            const newsRes = await retrieveFinancialNews(newsTopic);
            setNewsLists(newsRes.data);
        }
        fetchNewsLists();
    }, [newsTopic]
    )

    useEffect(() => {

    }, [isOutLineTheme])

    const handleAddNewsTopic = (e) => {
        const updateNewsTopic = [...newsTopic];
        updateNewsTopic.push(tempTopic);
        setTempTopic("")
        setNewsTopic(updateNewsTopic);
    }

    const handleInput = (e) => {
        const newTempInput = e.value;
        setTempTopic(newTempInput);
    }

    const handleDelete = (index) => {
        newsTopic.splice(index, 1);
        const updateNewsTopic = [...newsTopic];
        setNewsTopic(updateNewsTopic);
    }

    return (
        <div style={style.div}>
            {newsLists.length > 0 ?
                <>
                    <div style={style.subDivHeading}>
                        <Typography
                            variant="h5"
                            color="black"
                            component="div"
                            style={{margin: filter ? "16px 0px" : "16px 0 0 0"}}
                        >
                            {isDisplaySM ? "News" : "Financial News"}
                        </Typography>
                        {filter && <div style={{...style.subDivInputField.main, ...(isDisplaySM ? style.subDivInputField.sm : style.subDivInputField.lg)}}>
                            <InputTextField updateVal={handleInput} inputFieldLabel={isDisplaySM ? "Categories" : "Input Categories"} size="small" displayInput={tempTopic} />
                            <Button variant="contained" type="submit" onClick={handleAddNewsTopic} style={style.convertButton} >
                                Add
                            </Button>
                        </div>}
                    </div>
                    {filter && <Stack direction="row" style={style.Stack}>
                        {newsTopic?.map((topic, index) => (
                            <Chip label={topic} variant="outlined" onDelete={() => handleDelete(index)} style={style.Chip} />
                        ))}
                    </Stack>}
                    {newsLists.map(news => {
                        return (
                            <Link
                                key={news.title}
                                href={news.link}
                                className="hoverCard"
                                sx={isOutLineTheme ? {margin: 0, textDecoration: 'none'} : sxStyle.Link}>
                                {!isDisplaySM ? 
                                    <Card 
                                        variant={isOutLineTheme ? "outlined" : "elevation"} 
                                        sx={{
                                            ...sxStyle.Card, borderRadius: isOutLineTheme ? 0 : 1,
                                            border: isOutLineTheme && 0,
                                            borderBottom: isOutLineTheme && '1px solid rgba(0, 0, 0, 0.12)',
                                            padding: isOutLineTheme && '15px 0px',
                                            '&:hover': !isOutLineTheme && { boxShadow: '0px 0px 12px #644e243f', transition: '0.2s' }, 
                                            '&:hover .hoverLink': !isOutLineTheme && {color: '#0060cd'}
                                        }}
                                    >
                                        {news.thumbnail !== null && !isDisplaySM && <CardMedia
                                            component="img"
                                            sx={sxStyle.CardMedia}
                                            image={news.thumbnail}
                                            alt="Live from space album cover"
                                        />}
                                        <Box sx={{...sxStyle.Box, '&:hover': isOutLineTheme && {borderRight: '8px solid #00afff48'}}}>
                                            <FinancialNewsLists news={news} isDisplaySM={isDisplaySM} />
                                        </Box>
                                    </Card> : 
                                    <FinancialNewsLists news={news} isDisplaySM={isDisplaySM} />}
                            </Link>
                        )}
                    )}
                </>
                : <Loading />
            }
        </div>
    )
};

const sxStyle = {
    Box: { display: 'flex', flexDirection: 'column', width: "100%", flex: '1 0 auto', justifyContent: "space-between", 
            width: "min-content", padding: "20px" },
    Link: { width: '100%', textDecoration: "none", margin: "7px 0" },
    Card: { display: 'flex', width: '100%', },
    CardMedia: { width: 240, height: 180, objectFit: "cover" },
}

const style = {
    div: { display: 'flex', flexDirection: "column", width: '100%' },
    subDivHeading: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"},
    subDivInputField: {
        main: { display: "flex", alignItems: "center", justifyContent: "flex-end" },
        lg: { width: "25%" },
        sm: { width: "60%" }
    },
    Stack: { display: "flex", flexWrap: "wrap", margin: "0px 0px 12px 0px" },
    Chip: { marginRight: "5px", marginBottom: "5px" },
    convertButton: { marginLeft: "8px", marginTop: "-1.5px" },
}


