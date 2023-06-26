import { AppBar, Toolbar, IconButton, Tooltip, Menu, MenuItem, Badge, Link, Typography, Box, Grid, Switch, Button, List, ListItem, CircularProgress, Divider, duration, Paper, ListItemText, ListItemIcon, Stack, Item } from "@mui/material"
import { MdRestaurantMenu, MdLogout } from 'react-icons/md'
import { BsCloudUpload } from "react-icons/bs"
import { AiTwotoneHome, AiOutlineThunderbolt, AiOutlineWarning } from "react-icons/ai"
import CustomAvatarBadge from "./CustomAvatarBadge"
import Logo from "../images/logo.png"
import { useEffect, useState } from "react"
import { styled } from "@mui/system"
import { motion } from "framer-motion"
import { ToastContainer, toast, Slide } from 'react-toastify'
import ImageResizer from "../utils/ImageResizer"
import axios from "axios"


function colorPicker(value) {
    if (value <= 25) return 'red'
    else if (value > 25 && value <= 50) return 'orange'
    else if (value > 50 && value <= 75) return '#4cbb17'
    else return '#32cd32'
}

const CustomSwitch = styled(Switch)({
    '& .MuiSwitch-thumb': {
        backgroundColor: 'red'
    },
    '& .Mui-checked + .MuiSwitch-track': {
        backgroundColor: 'red !important'
    }
})


function ImageAnalysisPage() {
    const [error, setError] = useState(false)
    const [recognitionType, setRecognitionType] = useState("dish")
    const [buttonClick, setButtonClick] = useState(false)
    const [isDishRecognition, setDishRecognition] = useState(true)
    const [isSegementation, setSegmentation] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null)
    const [username, setUsername] = useState("X X")
    const [imageData, setImageData] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imgSize, setImgSize] = useState(0)
    const [result, setResult] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const showMessage = (messgae, type) => {
        if(type === "warning") {
            toast.warning(messgae, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide
            })
        }
        else {
            toast.error(messgae, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide
            })
        }
    }
    const handleAnalyzeButtonClk = async (event) => {
        if (isDishRecognition && isSegementation) {
            showMessage("Multiple operations prohibited!", "warning")
        }
        else if (imageFile === null) {
            toast.error("Please select an image", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide
            })
        }
        else {
            if (imgSize >= 1) showMessage("File size must be less than 1 MB", "warning")
            else {
                const fileExt = imageFile.name.split(".")[1]
                if(['jpeg', 'jpg'].includes(fileExt)) {
                    if (isDishRecognition) setRecognitionType("dish")
                    if (isSegementation) setRecognitionType("segment")
                    setButtonClick(true)
                    setLoading(true)
                    try {
                        const formData = new FormData()
                        if (isDishRecognition) {
                            formData.append("file", imageFile)
                            formData.append("type", "dish")
                            const res = await axios.post("/api/analyze", formData, { maxBodyLength: 1048576 })
                            setResult(res.data)
                            setLoading(false)
                        }
                        else if (isSegementation) {
                            formData.append("file", imageFile)
                            formData.append("type", "segmentation")
                            const res = await axios.post("/api/analyze", formData, { maxBodyLength: 1048576 })
                            setResult(res.data)
                            console.log(res.data)
                            setLoading(false)
                        }
                        else {
                            setLoading(false)
                            showMessage("please select an operation")
                        }
                    } catch (error) {
                        console.log(error)
                        showMessage("Some error occured while analyzing", "error")
                        setLoading(false)
                    }
                } else showMessage("Invalid file format", "error")
            }
        }
    }
    const handleFileRead = (event) => {
        const file = event.target.files[0]
        setImageFile(file)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            setImageData(e.target.result)
            setImgSize(file.size / (1024 * 1024))
        }
    }
    useEffect(() => {
        setTimeout(() => {
            if (isDishRecognition && isSegementation) toast.warning("Multiple operations prohibited!", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide
            })
        }, 500)
    }, [isDishRecognition, isSegementation])
    useEffect(() => {
        const getUseraname = async () => {
            const res = await axios.get(`/api/get-username/${localStorage.getItem('uid')}`)
            console.log(res.data)
            setUsername(res.data.name)
        }
        getUseraname()
    }, [])
    return (
        <>
            <ToastContainer
                position="top-center"
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
                        <CustomAvatarBadge username={username}/>
                        <Tooltip title="Home">
                            <IconButton href="/mainpage">
                                <AiTwotoneHome fontSize={26} color="white" />
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
                        <CustomAvatarBadge username={username}/>
                    </MenuItem>
                    <MenuItem>
                        <Link sx={{ textDecoration: 'none' }} color={'rgb(255, 255, 255)'} href={"/mainpage"}>
                            <Typography variant='h6' color='white'>Home</Typography>
                        </Link>
                        <Link href="/mainpage">
                            <AiTwotoneHome fontSize={26} color="white" />
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link sx={{ textDecoration: 'none' }} color={'rgb(255, 255, 255)'} href={"/"}>
                            <Typography variant='h6' color='white' marginRight={2}>Logout</Typography>
                        </Link>
                        <Link href="/">
                            <MdLogout fontSize={26} color="white" />
                        </Link>
                    </MenuItem>
                </Menu>
            </AppBar>
            <Grid container spacing={2} bgcolor={'transparent'} mt={8}>
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeIn", delay: 0.5 }}
                    >
                        <Typography textAlign={"center"} m={"10px 0 20px 0"} variant="h4" color={'whitesmoke'}>Make use of our <span className="highlighted-text">Deep Learning models</span> to identify <span className="highlighted-text">Dishes </span> from <span className="highlighted-text">Image </span></Typography>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeIn", delay: 1 }}
                    >
                        <Grid container columnSpacing={2} mt={2} sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 2,
                            '@media screen and (width <= 415px)': {
                                width: '90%',
                                marginInline: 'auto'
                            }
                        }}>
                            <Grid item bgcolor={'rgb(60, 60, 60)'} md={5} sm={5} xs={12} p={2} sx={{ border: '3px solid rgb(120, 120, 120)', borderRadius: '10px', display: 'flex', alignItems: "center", flexDirection: "column" }}>
                                <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" color="lightgray">Recognize dish from an image</Typography>
                                        <CustomSwitch
                                            onClick={(event) => {
                                                setDishRecognition(event.target.checked)
                                            }}
                                            defaultChecked={true}
                                        />
                                    </Box>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" color="lightgray">Identify multiple dishes from an image</Typography>
                                        <CustomSwitch
                                            onClick={(event) => {
                                                setSegmentation(event.target.checked)
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box mt={1} sx={{
                                    width: '90%',
                                    height: '300px',
                                    marginInline: 'auto',
                                    backgroundColor: 'rgb(40, 40, 40)',
                                    overflow: 'hidden',
                                    border: '2px solid rgb(90, 90, 90)',
                                    borderRadius: '10px',
                                    '@media screen and (width <= 415px)': {
                                        width: '100%'
                                    }
                                }}>
                                    {
                                        imageData === null ?
                                            <Box sx={{ width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                <BsCloudUpload
                                                    fontSize={100}
                                                    color="orangered"
                                                />
                                                <Typography paragraph color={'lightgray'}>select an image</Typography>
                                            </Box> :
                                            <img src={imageData} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                    }
                                </Box>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Button variant="contained" sx={{ backgroundImage: "linear-gradient(to top, red, orange)", height: "30px", width: "fit-content", marginTop: 1 }}>
                                        <input type="file" accept="image/jpeg" style={{ position: 'absolute', opacity: 0, cursor: "pointer" }} onChange={handleFileRead} name="image" />
                                        Upload
                                    </Button>
                                    <Button variant="contained" sx={{ backgroundImage: "linear-gradient(to top, red, orange)", height: "30px", width: "fit-content", marginTop: 1 }} onClick={handleAnalyzeButtonClk}>Analyze</Button>
                                </Box>
                                {
                                    isDishRecognition ?
                                        <Typography paragraph color={'lightgray'} mt={2}>
                                            It will recognize only one type of dish from an image and predict it's dish type and probable names.
                                        </Typography> :
                                        <Typography paragraph color={'lightgray'} mt={2}>
                                            It will detect multiple dishes present in an image and give it's most probable names
                                        </Typography>
                                }
                            </Grid>
                            <Grid item md={5} sm={5} xs={12} sx={{
                                border: "3px solid gray",
                                borderRadius: "10px",
                                backgroundColor: "rgb(60, 60, 60)",
                                paddingLeft: "0 !important"
                            }}>
                                {
                                    result === null ?
                                        <Stack spacing={1}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                            <Paper sx={{
                                                backgroundColor: 'rgb(90, 90, 90)',
                                                width: '70%',
                                                '@media screen and (width <= 415px)': {
                                                    width: "90%"
                                                }
                                            }} elevation={2}>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <AiOutlineThunderbolt color="white" fontSize={30} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={"Capabilities"}
                                                        secondary={"Able to recognize various dishes all over the world"}
                                                        primaryTypographyProps={{ style: { color: "white" } }}
                                                        secondaryTypographyProps={{ style: { color: "white" } }}
                                                    />
                                                </ListItem>
                                            </Paper>
                                            <Paper sx={{
                                                backgroundColor: 'rgb(90, 90, 90)',
                                                width: '70%',
                                                '@media screen and (width <= 415px)': {
                                                    width: "90%"
                                                }
                                            }} elevation={2}>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <AiOutlineWarning color="white" fontSize={30} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={"Limitations"}
                                                        secondary={"May not be able to provide exact names of the dish"}
                                                        primaryTypographyProps={{ style: { color: "white" } }}
                                                        secondaryTypographyProps={{ style: { color: "white" } }}
                                                    />
                                                </ListItem>
                                            </Paper>
                                        </Stack> : isLoading ? 
                                        <Box sx={{width:"100%", height:"100%", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
                                            <CircularProgress variant="indeterminate" size={80} sx={{color:"orangered"}}/>
                                            <Typography variant="h6" color={"orangered"}>Analyzing please wait..</Typography>
                                        </Box>
                                        :
                                            recognitionType === "dish" ?
                                                <List sx={{ width: "100%", marginTop: 1 }}>
                                                    <ListItem sx={{ wdith: "100%", display: "flex", justifyContent: "space-between" }}>
                                                        <ListItemText primary="Food Family" secondary={result.foodFamily[0].name} primaryTypographyProps={{ style: { color: "white" } }} secondaryTypographyProps={{ style: { color: "lightgray" } }} />
                                                        <Box sx={{
                                                            position: "relative",
                                                            width: "fit-content",
                                                            height: "fit-content",
                                                        }}>
                                                            <CircularProgress variant="determinate" value={result.foodFamily[0].prob * 100} size={40} sx={{ color: colorPicker(result.foodFamily[0].prob * 100) }} />
                                                            <Typography paragraph color={"lightgray"} sx={{
                                                                position: "absolute",
                                                                top: "50%",
                                                                left: "50%",
                                                                transform: "translate(-50%, -50%)",
                                                                fontSize: "10px"
                                                            }}>{Math.round(result.foodFamily[0].prob * 100)}%</Typography>
                                                        </Box>
                                                    </ListItem>
                                                    <Divider sx={{ backgroundColor: "white" }} />
                                                    <ListItem sx={{ wdith: "100%", display: "flex", justifyContent: "space-between" }}>
                                                        <ListItemText primary="Occasion" secondary={result.occasion} primaryTypographyProps={{ style: { color: "white" } }} secondaryTypographyProps={{ style: { color: "lightgray" } }} />
                                                    </ListItem>
                                                    <Divider sx={{ backgroundColor: "white" }} />
                                                    <ListItem>
                                                        <Typography variant="h5" color={"White"}>Predicted Results</Typography>
                                                    </ListItem>
                                                    {
                                                        result.recognition_results.map((res, index) => {
                                                            return (
                                                                <>
                                                                    <ListItem sx={{ wdith: "100%", display: "flex", justifyContent: "space-between" }} key={index}>
                                                                    <ListItemText primary={res.name} primaryTypographyProps={{ style: { color: "white" } }} secondaryTypographyProps={{ style: { color: "lightgray" } }} />
                                                                    <Box sx={{
                                                                        position: "relative",
                                                                        width: "fit-content",
                                                                        height: "fit-content",
                                                                    }}>
                                                                        <CircularProgress variant="determinate" value={res.prob * 100} size={40} sx={{ color: colorPicker(res.prob * 100) }} />
                                                                        <Typography paragraph color={"lightgray"} sx={{
                                                                            position: "absolute",
                                                                            top: "50%",
                                                                            left: "50%",
                                                                            transform: "translate(-50%, -50%)",
                                                                            fontSize: "10px"
                                                                        }}>{Math.round(res.prob * 100, 1)}%</Typography>
                                                                    </Box>
                                                                </ListItem>
                                                                <Divider sx={{backgroundColor:"white"}}/>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </List> :
                                                <List sx={{ width: "100%", marginTop: 1 }}>
                                                <ListItem>
                                                    <ListItemText primary="Food Family" secondary={result.foodFamily[0].name} primaryTypographyProps={{ style: { color: "white" } }} secondaryTypographyProps={{ style: { color: "lightgray" } }} />
                                                    <Box sx={{
                                                        position: "relative",
                                                        width: "fit-content",
                                                        height: "fit-content",
                                                    }}>
                                                        <CircularProgress variant="determinate" value={result.foodFamily[0].prob * 100} size={40} sx={{ color: colorPicker(result.foodFamily[0].prob * 100) }} />
                                                        <Typography paragraph color={"lightgray"} sx={{
                                                            position: "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform: "translate(-50%, -50%)",
                                                            fontSize: "10px"
                                                        }}>{Math.round(result.foodFamily[0].prob * 100, 0)}%</Typography>
                                                    </Box>
                                                </ListItem>
                                                <Divider sx={{ backgroundColor: "white" }} />
                                                <ListItem sx={{ wdith: "100%", display: "flex", justifyContent: "space-between" }}>
                                                    <ListItemText primary="Occasion" secondary={result.occasion} primaryTypographyProps={{ style: { color: "white" } }} secondaryTypographyProps={{ style: { color: "lightgray" } }} />
                                                </ListItem>
                                                <Divider sx={{ backgroundColor: "white" }} />
                                                <ListItem>
                                                    <Typography variant="h6" color={"white"}>INDENTIFIED DISHES</Typography>
                                                </ListItem>
                                                {
                                                    result.segmentation_results.map((res, index) => {
                                                        return (
                                                            <>
                                                                <ListItem sx={{ wdith: "100%", display: "flex", justifyContent: "space-between" }} key={index}>
                                                                    <ListItemText primary={res.name} primaryTypographyProps={{ style: { color: "white" } }} secondaryTypographyProps={{ style: { color: "lightgray" } }} />
                                                                    <Box sx={{
                                                                        position: "relative",
                                                                        width: "fit-content",
                                                                        height: "fit-content",
                                                                    }}>
                                                                        <CircularProgress variant="determinate" value={res.prob * 100} size={40} sx={{ color: colorPicker(res.prob * 100) }} />
                                                                        <Typography paragraph color={"lightgray"} sx={{
                                                                            position: "absolute",
                                                                            top: "50%",
                                                                            left: "50%",
                                                                            transform: "translate(-50%, -50%)",
                                                                            fontSize: "10px"
                                                                        }}>{Math.round(res.prob * 100)}%</Typography>
                                                                    </Box>
                                                                </ListItem>
                                                                <Divider sx={{ backgroundColor: "white" }} />
                                                            </>
                                                        )
                                                    })  
                                                }
                                            </List>
                                }
                            </Grid>
                        </Grid>
                    </motion.div>
                </Grid>
            </Grid>
        </>
    )
}

export default ImageAnalysisPage