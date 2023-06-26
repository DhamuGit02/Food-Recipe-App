import '../styles/RecipeViewPage.css'
import { Box, Container, Grid, List, ListItem, Paper, Typography, ListItemIcon, ListItemText, AppBar, Divider, ListItemAvatar, Avatar, Toolbar, Tooltip, IconButton, Link, Badge } from '@mui/material'
import { FcAlarmClock } from 'react-icons/fc'
import CustomAvatarBadge from './CustomAvatarBadge'
import { AiFillStar } from 'react-icons/ai'
import { IoChevronBackCircleSharp } from 'react-icons/io5'
import FavouritesButton from './FavouritesButton'
import axios from 'axios'
import { useState, useEffect } from 'react'
import LoadingPage from './LoadingPage'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import prevImg from '../images/img-preview.png'
import Logo from '../images/logo.png'

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes}min`;
    } else {
        return `${minutes}min`;
    }
}
function RecipeViewPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("XX")
    const [isImageLoading, setImageLoading] = useState(true)
    const [isLoading, setLoading] = useState(true)
    const [recipe, setRecipe] = useState({
        id: "",
        title: "",
        time: 0,
        equipments: [],
        nutrients: [],
        ingredients: [],
        steps: []
    })
    const handleOnLoad = (event) => {
        setImageLoading(false)
    }
    useEffect(() => {
        const fetchData = async () => {
            const getUseraname = async () => {
                const res = await axios.get(`/api/get-username/${localStorage.getItem('uid')}`)
                console.log(document.URL.split("?")[1])
                console.log(res.data)
                setUsername(res.data.name)
            }
            const getRecipeInformation = async (id) => {
                try {
                    const res = await axios.get(`/api/get-recipe-information/${id}`)
                    console.log(res.data)
                    setRecipe({
                        id: res.data.id,
                        title: res.data.title,
                        time: res.data.time,
                        equipments: res.data.equipments,
                        ingredients: res.data.ingredients,
                        nutrients: res.data.nutrients,
                        steps: res.data.steps
                    })
                } catch (error) {
                    console.log(error)
                }
            }
            await getRecipeInformation(document.URL.split("/")[4])
            await getUseraname()
            setLoading(false)
        }
        fetchData()
    }, [])
    useEffect(() => {
        console.log(recipe)
    }, [recipe])
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {isLoading ? <LoadingPage /> :
                <main className='parent-container'>
                    <AppBar sx={{ backgroundColor: 'rgb(30, 30 ,30)' }}>
                        <Toolbar sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex' }}>
                                <CustomAvatarBadge username={username} />
                                <Tooltip title="back">
                                    <IconButton sx={{ color: 'white', marginLeft: 2 }} onClick={() => navigate("/mainpage")}>
                                        <IoChevronBackCircleSharp />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Add to favourites">
                                    <Link herf="/favourites">
                                        <FavouritesButton recipe={recipe} />
                                    </Link>
                                </Tooltip>
                            </Box>
                            <Badge>
                                <img width={50} src={Logo} alt='logo'></img>
                            </Badge>
                        </Toolbar>
                    </AppBar>
                    <Container maxWidth="lg">
                        <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'} mt={5}>
                            <Grid item xs={12} sm={6} md={4} justifyContent={'center'} alignItems={'center'}>
                                <Box>
                                    <Typography variant='h4' sx={{
                                        backgroundImage: 'linear-gradient(to top, red, orangered)',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 'bold'
                                    }} mb={1} mt={2}>
                                        {recipe.title}
                                    </Typography>
                                    <img src={isImageLoading ? prevImg : `https://spoonacular.com/recipeImages/${document.URL.split("/")[4]}-312x231.jpg`} alt="food-img" style={{ width: '100%', height: '100%', borderRadius: '1rem', border: '10px double orangered' }} onLoad={handleOnLoad} />
                                    <Typography color='white' mt={2} ml={3} mb={2}>
                                        Ready in <FcAlarmClock fontSize={30} /> : {formatTime(Number(recipe.time))}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} mt={2}>
                                <Paper sx={{ flex: '1 1 50%', height: 400, backgroundColor: 'transparent', marginBottom: 2 }}>
                                    <Typography variant='h5' sx={{
                                        margin: '5px 0 5px 20px',
                                        backgroundImage: 'linear-gradient(to top, red, orangered)',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 'bold'
                                    }}>Nutrients</Typography>
                                    <Paper sx={{
                                        width: '90%',
                                        marginLeft: '1rem',
                                        maxHeight: '340px',
                                        overflowY: 'auto',
                                        backgroundColor: 'rgb(40, 40, 40)',
                                        color: 'white'
                                    }}>
                                        <List>
                                            {recipe &&
                                                recipe.nutrients.map((nutrient, index) => (
                                                    <div>
                                                        <ListItem key={index}>
                                                            <ListItemText primary={nutrient.name} secondary={`${nutrient.amount} ${nutrient.unit}`}
                                                                secondaryTypographyProps={{ style: { color: 'lightgrey' } }} />
                                                        </ListItem>
                                                        <Divider sx={{ backgroundColor: 'lightgray' }} />
                                                    </div>
                                                ))}
                                            {/* Add more list items for List 1 */}
                                        </List>
                                    </Paper>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                    <Container maxWidth="lg">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper sx={{ flex: '1 1 50%', height: 400, backgroundColor: 'transparent', marginBottom: 2 }}>
                                    <Typography variant='h5' sx={{
                                        margin: '5px 0 5px 20px',
                                        backgroundImage: 'linear-gradient(to top, red, orangered)',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 'bold'
                                    }}>Ingredients</Typography>
                                    <Divider />
                                    <Paper sx={{
                                        width: '90%',
                                        marginLeft: '1rem',
                                        maxHeight: '340px',
                                        overflowY: 'auto',
                                        backgroundColor: 'rgb(40, 40, 40)',
                                        color: 'white'
                                    }}>
                                        <List>
                                            {recipe && recipe.ingredients.map((ingredient, index) => {
                                                return (
                                                    <div>
                                                        <ListItem key={index}>
                                                            <Typography>{ingredient}</Typography>
                                                        </ListItem>
                                                        <Divider sx={{ backgroundColor: 'lightgray' }} />
                                                    </div>
                                                )
                                            })}
                                            {/* Add more list items for List 1 */}
                                        </List>
                                    </Paper>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper sx={{ flex: '1 1 50%', height: 400, backgroundColor: 'transparent', marginBottom: 2 }}>
                                    <Typography variant='h5' sx={{
                                        margin: '5px 0 5px 20px',
                                        backgroundImage: 'linear-gradient(to top, red, orangered)',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 'bold'
                                    }}>Equipments</Typography>
                                    <Divider />
                                    <Paper sx={{
                                        width: '90%',
                                        marginLeft: '1rem',
                                        maxHeight: '340px',
                                        overflowY: 'auto',
                                        backgroundColor: 'rgb(40, 40, 40)',
                                        color: 'white'
                                    }}>
                                        <List>
                                            {recipe && recipe.equipments.map((equipment, index) => {
                                                return (
                                                    <div>
                                                        <ListItem key={index}>
                                                            <Typography>{equipment}</Typography>
                                                        </ListItem>
                                                        <Divider sx={{ backgroundColor: 'lightgray' }} />
                                                    </div>
                                                )
                                            })}
                                            {/* Add more list items for List 1 */}
                                        </List>
                                    </Paper>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                    <Container maxWidth="lg">
                        <Paper sx={{ flex: '100%', height: 400, backgroundColor: 'transparent', marginBottom: 2 }}>
                            <Typography variant='h5' sx={{
                                margin: '5px 0 5px 20px',
                                backgroundImage: 'linear-gradient(to top, red, orangered)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: 'bold'
                            }}>Procedure</Typography>
                            <Divider />
                            <Paper sx={{
                                width: '90%',
                                marginLeft: '1rem',
                                maxHeight: '340px',
                                overflowY: 'auto',
                                backgroundColor: 'rgb(40, 40, 40)',
                                color: 'white'
                            }}>
                                <List>
                                    {recipe && recipe.steps.map((step, index) => {
                                        return (
                                            <div>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <ListItemAvatar>
                                                            <Avatar sx={{ backgroundColor: "rgb(30, 30 ,30)" }}>
                                                                <AiFillStar color='orangered' fontSize={24} />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                    </ListItemIcon>
                                                    <ListItemText style={{ wordWrap: 'break-word', wordSpacing: 'normal' }}
                                                        primary={'Step ' + (index + 1)}
                                                        secondary={step}
                                                        primaryTypographyProps={{
                                                            style: {
                                                                color: 'white'
                                                            }
                                                        }}
                                                        secondaryTypographyProps={{
                                                            style: {
                                                                color: 'white'
                                                            }
                                                        }}
                                                    />
                                                </ListItem>
                                                <Divider sx={{ backgroundColor: 'lightgray' }} />
                                            </div>
                                        )
                                    })}
                                    {/* Add more list items for List 1 */}
                                </List>
                            </Paper>
                        </Paper>
                    </Container>
                </main>
            }
        </>
    )
}

export default RecipeViewPage