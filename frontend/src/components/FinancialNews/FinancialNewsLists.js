import "../../App.css";
import Typography from '@mui/material/Typography';

export default function FinancialNews(props) {
    const { news, isDisplaySM } = props;

    return (
        <>
            <div style={{ ...sxStyle.NewsList.main, ...(isDisplaySM && sxStyle.NewsList.sm) }}>
                <Typography
                    component="div"
                    variant="subtitle1"
                    fontSize={16}
                    fontWeight={600}
                    style={style.newsPublisher}
                >
                    {news.publisher}
                </Typography>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography
                        className="hoverLink"
                        variant="h3"
                        fontSize={20}
                        fontWeight={700}
                        underline="none"
                        color="black"
                        mb={3}
                    >
                        {news.title}
                    </Typography>
                    {isDisplaySM && <span>
                        <img src={news.thumbnail} alt="News Thumbnail" style={style.smallThumbnamil} />
                    </span>}
                </div>
            </div>
            <Typography
                variant="subtitle1"
                fontSize={14}
                color="#858585"
                component="div"
            >
                {news.diffTimeInHour > 23 ? news.publishTime : news.diffTimeInHour + 'h'}
            </Typography>
        </>
    )
};

const sxStyle = {
    NewsList: {
        main: { flex: '1 0 auto', display: "flex", flexDirection: "column" },
        sm: { borderTop: "1px solid #cdcdcd", paddingTop: "20px" }
    },
}

const style = {
    newsPublisher: { width: "fit-content", marginBottom: "12px", color: "black", borderBottom: "1px solid #cbcbcb" },
    smallThumbnamil: { width: "72px", height: "72px", margin: "0 0 0 10px", borderRadius: "8px" },
}