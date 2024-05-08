import "../../App.css";
import { useState, useEffect } from "react";
import { retrieveFinancialNews } from "../../util/apiClient";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function FinancialNewsLists() {
    const [newsLists, setNewsLists] = useState([]);
    const theme = useTheme();

    console.log("newsLists => ", newsLists)

    useEffect(() => {
        async function fetchNewsLists() {
            const newsRes = await retrieveFinancialNews();
            setNewsLists(newsRes.data);
        }
        fetchNewsLists();
    }, []
    )

    return (
        <div style={{ display: 'flex', flexDirection: "column", width: '100%' }}>
            {newsLists.length > 0 ?
                <>
                    <Typography variant="h5" color="black" component="div" my={2}>
                        Financial News
                    </Typography>
                    {newsLists.map(news => {
                        return (
                            <a href={news.link} className="hoverCard" style={{ width: '100%', textDecoration: "none", margin: "7px 0" }}>
                                <Card sx={{ display: 'flex', width: '100%' }}>
                                    {news.thumbnail !== null && <CardMedia
                                        component="img"
                                        sx={{ width: 300 }}
                                        image={news.thumbnail}
                                        alt="Live from space album cover"
                                    />}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                                        <CardContent sx={{ flex: '1 0 auto', display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
                                            <Link className="hoverLink" level="h3" fontSize={20} fontWeight={700} underline="none" color="inherit" href={news.link} mb={3}>{news.title}</Link>
                                            <div>
                                                <Typography variant="subtitle1" fontSize={16} fontWeight={600} color="#0060cd" component="div">
                                                    {news.publisher}
                                                </Typography>
                                                <Typography variant="subtitle1" fontSize={14} color="black" component="div">
                                                    {news.publishTime}
                                                </Typography>
                                            </div>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </a>
                        )
                    })
                    }
                </>
                : <div className="loader"></div>
            }
        </div>
    )
};
