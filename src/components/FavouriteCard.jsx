import { Box, Toolbar, IconButton, Tooltip, Typography, Card, CardMedia, CardContent, Button, Divider } from "@mui/material"
import { MdDelete } from "react-icons/md"
import { FcAlarmClock } from 'react-icons/fc'
import axios from "axios"

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes}min`;
    } else {
        return `${minutes}min`;
    }
}


function FavouriteCard({ title, image, time, id, key, setDeleteCount, deleteCount}) {
    const handleDelete = async (event) => {
        event.preventDefault()
        try {
            const res = await axios.post("/api/delete-recipe-from-favourites", {uid:localStorage.getItem('uid'), id:event.currentTarget.parentNode.childNodes[1].id})
            setDeleteCount(deleteCount + 1)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Card key={key} sx={{
            minWidth:"100%",
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgb(40, 40, 40)',
            borderRadius: '10px',
            border: '2px solid rgb(70, 70, 70)',
            margin: '5px 0 10px 0'
        }}>
            <Box sx={{
                width: '15%',
                height: '150px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '@media screen and (width <= 415px)': {
                    width: '40%'
                },
                '@media screen and ((width > 415px) and (width <= 1280px))': {
                    width: '20%'
                }
            }}>
                <Box width={'80%'}>
                    <CardMedia component="img" image={image} sx={{
                        borderRadius: '10px',
                        width: '100%',
                        objectFit: 'contain',
                        '@media screen and (width <= 415px)': {
                            width: '100%'
                        },
                        '@media screen and ((width > 415px) and (width <= 1280px))': {
                            width: '110%'
                        }
                    }} />
                </Box>
            </Box>
            <Box width={'85%'} sx={{
                '@media screen and (width <= 415px)': {
                    width: '60%'
                }
            }}>
                <CardContent>
                    <Typography variant="h5" color={'white'} sx={{
                        backgroundImage: 'linear-gradient(to top, red, orangered)',
                        backgroundClip: 'text !important',
                        color: 'transparent',
                        fontWeight: 'bold',
                        '@media screen and (width <= 415px)': {
                            fontSize: '16px'
                        },
                        '@media screen and ((width > 415px) and (width <= 1280px))': {
                            fontSize: '20px'
                        }
                    }}>{title}</Typography>
                    <Divider sx={{ backgroundColor: 'white' }} />
                    <Typography variant="h6" color={'whitesmoke'}>Ready in <FcAlarmClock fontSize={20} />&nbsp;&nbsp;{formatTime(time)}</Typography>
                    <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="contained" sx={{
                            backgroundImage: "linear-gradient(to top, red, orangered)",
                            marginTop: 1,
                            fontSize: '12px',
                            '@media screen and ((width > 415px) and (width <= 1280px))': {
                                fontSize: '12px'
                            }
                        }} href={`/view/${id}`}>View</Button>
                        <Tooltip title="Delete recipe">
                            <IconButton id={id} onClick={handleDelete}>
                                <MdDelete color="darkred" fontSize={30}/>
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </CardContent>
            </Box>
        </Card>
    )
}

export default FavouriteCard