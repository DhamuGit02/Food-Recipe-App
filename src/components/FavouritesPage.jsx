import { Box, AppBar, Toolbar, IconButton, Tooltip, Typography, Menu, MenuItem, Grid, TextField, CircularProgress, Badge, Link } from "@mui/material"
import { AiTwotoneHome } from "react-icons/ai"
import { MdLogout, MdOutlineDocumentScanner, MdRestaurantMenu } from "react-icons/md"
import CustomAvatarBadge from "./CustomAvatarBadge"
import { useState, useEffect } from "react"
import axios from "axios"
import FavouriteCard from "./FavouriteCard"
import { styled } from "@mui/system"
import Logo from '../images/logo.png'
import EmptyImg from '../images/no-records.svg'
import { motion, AnimatePresence } from 'framer-motion'

const CustomTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .Mui-focused': {
        color: 'white'
    }
});
function FavouritesPage() {
    const [deleteCount, setDeleteCount] = useState(0)
    const [query, setQuery] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null)
    const [username, setUsername] = useState("XX")
    const [favourites, setFavourites] = useState({})
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleQuery = (event) => {
        setQuery(event.target.value)
    }
    const getUseraname = async () => {
        const res = await axios.get(`/api/get-username/${localStorage.getItem('uid')}`)
        console.log(res.data)
        setUsername(res.data.name)
    }
    const getFavourites = async () => {
        try {
            const res = await axios.get(`/api/get-favourites/${localStorage.getItem('uid')}`)
            setFavourites(res.data.list)
            console.log(favourites)
            setTimeout(() => {
                setLoading(false)
            }, 1500)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            await getUseraname()
            await getFavourites()
            setLoading(false)
        }
        fetchData()
    }, [])
    useEffect(() => {
        getFavourites()
    }, [deleteCount])
    return (
        <Box elevation={0} sx={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgb(30, 30, 30)'
        }}>
            <AppBar sx={{
                backgroundColor: 'rgb(50, 50, 50)'
            }}>
                <Toolbar sx={{
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <IconButton onClick={handleClick} sx={{
                        display: 'none',
                        '@media screen and (width <= 415px)': {
                            display: 'block'
                        }
                    }}>
                        <MdRestaurantMenu fontSize={26} color="white" />
                    </IconButton>
                    <Toolbar sx={{
                        '@media screen and (width <= 415px)': {
                            display: 'none'
                        }
                    }}>
                        <CustomAvatarBadge username={isLoading ? "X X" : username} />
                        <Tooltip title="Home">
                            <IconButton href="/mainpage">
                                <AiTwotoneHome fontSize={26} color="white" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Get recipe from image">
                            <IconButton href="/image-analysis">
                                <MdOutlineDocumentScanner fontSize={26} color="white" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Logout">
                            <IconButton href="/">
                                <MdLogout fontSize={26} color="white" />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                    <Badge>
                        <img width={50} src={Logo} alt="logo"></img>
                    </Badge>
                </Toolbar>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    id="basic-menu"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem>
                        <CustomAvatarBadge username={isLoading ? "X X" : username} />
                    </MenuItem>
                    <MenuItem>
                        <Link sx={{textDecoration:'none'}} color={'rgb(255, 255, 255)'} href={"unkown"}>
                            <Typography variant='h6' color='white'>Get recipe from image</Typography>
                        </Link>
                        <Link href="/image-analysis">
                            <MdOutlineDocumentScanner fontSize={26} color="white" />
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link sx={{textDecoration:'none'}} color={'rgb(255, 255, 255)'} href={"/mainpage"}>
                            <Typography variant='h6' color='white'>Home</Typography>
                        </Link>
                        <Link href="/mainpage">
                            <AiTwotoneHome fontSize={26} color="white" />
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link sx={{textDecoration:'none'}} color={'rgb(255, 255, 255)'} href={"/"}>
                            <Typography variant='h6' color='white' marginRight={2}>Logout</Typography>
                        </Link>
                        <Link href="/">
                            <MdLogout fontSize={26} color="white" />
                        </Link>
                    </MenuItem>
                </Menu>
            </AppBar>
            <Grid sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Box sx={{
                    width: '80%',
                    height: '500px',
                    backgroundColor: 'rgb(50, 50, 50)',
                    marginTop: '5%',
                    border: '1px solid rgb(90, 90, 90)',
                    borderRadius: '5px',
                    padding: '5px',
                    overflowY: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '@media screen and (max-width: 415px)': {
                        width: '95%',
                        marginTop: '25%'
                    },
                    '@media screen and (min-width: 416px) and (max-width: 1280px)': {
                        width: '90%',
                        marginTop: 10
                    }
                }}>
                    {
                        isLoading ?
                            <div style={{ textAlign: 'center' }}>
                                <CircularProgress sx={{ color: "whitesmoke" }} />
                                <Typography variant="h6" color={"whitesmoke"}>Fetching your list</Typography>
                            </div>
                            :
                            favourites.length === 0 ?
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <img src={EmptyImg} width={'150px'} style={{ opacity: 0.8 }}></img>
                                    <Typography variant="h6" color={'rgb(100, 100, 100)'}>You don't have any favourites !</Typography>
                                </div>
                                :
                                <div style={{ height: '500px', width:"100%"}}>
                                    <AnimatePresence>
                                        {query === null
                                            ? favourites.map(recipe => (
                                                <motion.div
                                                    key={recipe.id}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                >
                                                    <FavouriteCard
                                                        title={recipe.title}
                                                        image={recipe.image}
                                                        time={recipe.time}
                                                        id={recipe.id}
                                                        setDeleteCount={setDeleteCount}
                                                        deleteCount={deleteCount}
                                                    />
                                                </motion.div>
                                            ))
                                            : favourites
                                                .filter(recipe => recipe.title.toLowerCase().includes(query.toLowerCase()))
                                                .map(recipe => (
                                                    <motion.div
                                                        key={recipe.id}
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    >
                                                        <FavouriteCard
                                                            title={recipe.title}
                                                            image={recipe.image}
                                                            time={recipe.time}
                                                            id={recipe.id}
                                                            setDeleteCount={setDeleteCount}
                                                            deleteCount={deleteCount}
                                                        />
                                                    </motion.div>
                                                ))}
                                    </AnimatePresence>
                                </div>
                    }
                </Box>
                <Box width={'80%'} justifyContent={"space-between"} display={"flex"} mt={2} sx={{
                    '@media screen and (max-width: 415px)': {
                        flexDirection: 'column'
                    }
                }}>
                    <CustomTextField id="standard-basic" label="Search" variant="standard" onChange={handleQuery} />
                    <Typography color={'rgb(120, 120, 120)'} variant="h5" marginTop={1}>Recipes {favourites.length}</Typography>
                </Box>
            </Grid>
        </Box>
    )
}

export default FavouritesPage