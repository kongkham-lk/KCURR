import "../../App.css";
import { useState, useEffect } from "react";
import { retrieveFinancialNews } from "../../util/apiClient";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function FinancialNewsLists() {
    const [newsLists, setNewsLists] = useState([]);

    useEffect(() => {
        async function fetchNewsLists() {
            const newsRes = await retrieveFinancialNews();
            setNewsLists(newsRes.data);
        }
        fetchNewsLists();
    }, []
    )

    return (
        <div style={style.div}>
            {newsLists.length > 0 ?
                <>
                    <Typography
                        variant="h5"
                        color="black"
                        component="div"
                        my={2}
                    >
                        Financial News
                    </Typography>
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
                : <div className="loader"></div>
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
}