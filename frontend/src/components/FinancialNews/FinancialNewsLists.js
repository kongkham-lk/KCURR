import "../../App.css";
import { useState, useEffect } from "react";
import { retrieveFinancialNews } from "../../util/apiClient";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputTextField from "../InputTextField";
import { Loading } from '../Loading';

export default function FinancialNewsLists(props) {
    const { filter = false } = props;
    const [newsLists, setNewsLists] = useState([]);
    const [tempTopic, setTempTopic] = useState("");
    const [newsTopic, setNewsTopic] = useState(["Stock", "Oil", "Gold", "Business", "Finance", "Bank", "Investment", "Trading", "Tesla", "Apple", "Facebook", "Cryptocurrency",]);

    useEffect(() => {
        async function fetchNewsLists() {
            const newsRes = await retrieveFinancialNews(newsTopic);
            setNewsLists(newsRes.data);
        }
        fetchNewsLists();
    }, [newsTopic]
    )

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
                            my={2}
                        >
                            Financial News
                        </Typography>
                        {filter && <div style={style.subDivInputField}>
                            <InputTextField updateVal={handleInput} inputFieldLabel="Add News Keywords" size="small" displayInput={tempTopic} />
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
                                sx={sxStyle.Link}>
                                <Card sx={sxStyle.Card}>
                                    {news.thumbnail !== null && <CardMedia
                                        component="img"
                                        sx={sxStyle.CardMedia}
                                        image={news.thumbnail}
                                        alt="Live from space album cover"
                                    />}
                                    <Box sx={sxStyle.Box}>
                                        <CardContent sx={sxStyle.CardContent}>
                                            <Typography
                                                className="hoverLink"
                                                variant="h3"
                                                fontSize={20}
                                                fontWeight={700}
                                                underline="none"
                                                color="inherit"
                                                href={news.link}
                                                mb={3}
                                            >
                                                {news.title}
                                            </Typography>
                                            <div>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontSize={16}
                                                    fontWeight={600}
                                                    color="#0060cd"
                                                    component="div"
                                                >
                                                    {news.publisher}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontSize={14}
                                                    color="black"
                                                    component="div"
                                                >
                                                    {news.publishTime}
                                                </Typography>
                                            </div>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Link>
                        )
                    })
                    }
                </>
                : <Loading />
            }
        </div>
    )
};

const sxStyle = {
    CardContent: { flex: '1 0 auto', display: "flex", flexDirection: "column", justifyContent: "space-between", },
    Box: { display: 'flex', flexDirection: 'column', width: "100%" },
    Link: { width: '100%', textDecoration: "none", margin: "7px 0" },
    Card: { display: 'flex', width: '100%' },
    CardMedia: { width: 240, height: 180, objectFit: "cover" },
}

const style = {
    div: { display: 'flex', flexDirection: "column", width: '100%' },
    subDivHeading: { display: "flex", justifyContent: "space-between", alignItems: "center", },
    subDivInputField: { display: "flex", alignItems: "center", width: "25%" },
    Stack: { display: "flex", flexWrap: "wrap", marginBottom: "20px" },
    Chip: { marginRight: "5px", marginBottom: "5px" },
    convertButton: { marginLeft: "8px", marginTop: "-1.5px" },
}