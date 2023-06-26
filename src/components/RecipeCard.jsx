import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { IconButton, ListItemText } from '@mui/material'
import { FcAlarmClock, FcLike } from 'react-icons/fc'
import { BiCheckboxSquare } from 'react-icons/bi'
import prevImg from '../images/img-preview.png'

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes}min`;
    } else {
        return `${minutes}min`;
    }
}

function RecipeCard({ key, id, title, readyInMinutes, likes, isVeg, image, isImageLoading, setImageLoading, uid}) {
    const handleOnLoad = (event) => {
        setImageLoading(false)
    }
    return (
        <Card key={key} sx={{
            position: 'relative',
            width: 300,
            height: 450,
            backgroundColor: 'rgb(50, 50, 50)',
            border: '5px solid orangered',
            borderRadius:'1rem'
        }}>
            <CardMedia
                component="img"
                alt={image}
                width="180"
                image={isImageLoading ? prevImg : image}
                onLoad={handleOnLoad}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{
                    backgroundImage: 'linear-gradient(to top, orangered, orange)',
                    backgroundClip: "text",
                    color: "transparent",
                    fontWeight: 'Bold'
                }}>
                    {title.length <= 35 ? title : title.substring(0, 36) + "..."}
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemText sx={{ color: 'white', marginRight: '20px' }}>
                        Ready in 
                        <FcAlarmClock fontSize={24} />
                        : {formatTime(Number(readyInMinutes))}
                    </ListItemText>
                </Typography>
            </CardContent>
            <CardActions sx={{ position: 'absolute', bottom: '5px', left: '5px' }}>
                <Button
                    size="medium"
                    variant='contained'
                    sx={{ backgroundImage: 'linear-gradient(to top, red, orange)', fontWeigth: '900' }}
                    href={`/view/${id}`}
                    >
                    View Recipe
                </Button>
                <Button startIcon={<FcLike />} sx={{ left: '10px', color: 'white' }}> {likes > 0 ? likes > 1000 ? String(Math.round(likes / 1000)) + "K" : likes : ""}</Button>
                <IconButton sx={{ left: '10px', color: `${isVeg ? 'green' : 'red'}` }}>
                    <BiCheckboxSquare fontSize={34} />
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default RecipeCard