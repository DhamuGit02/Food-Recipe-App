import '../styles/Navbar.css'
import Typography from '@mui/material/Typography'
import { Link, MenuItem, Badge, Toolbar, IconButton } from '@mui/material'
import { MdOutlineDocumentScanner, MdFavorite, MdLogout, MdRestaurantMenu } from 'react-icons/md'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import { useState } from 'react'
import CustomAvatarBadge from './CustomAvatarBadge'
import Logo from '../images/logo.png'

function Navbar({ username, count }) {
    console.log(count)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <nav id="navbar">
            <IconButton id="mobile-menu-icon" onClick={handleClick}>
                <MdRestaurantMenu />
            </IconButton>
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
                    <CustomAvatarBadge username={username} />
                </MenuItem>
                <MenuItem>
                    <Link sx={{textDecoration:'none'}} href="/favourites" color={'rgb(255, 255, 255)'}>
                        <Typography variant='h6' color='white' marginRight={2}>Favourites</Typography>
                    </Link>
                    <Badge badgeContent={count} color='error'>
                        <Link color={'rgb(255, 255, 255)'} href="/favourites">
                            <MdFavorite color='white' fontSize={24} />
                        </Link>
                    </Badge>
                </MenuItem>
                <MenuItem>
                    <Link sx={{textDecoration:'none'}} color={'rgb(255, 255, 255)'}>
                        <Typography variant='h6' color='white' marginRight={2}>Recipe from Image</Typography>
                    </Link>
                    <Link color={'rgb(255, 255, 255)'} href='/image-analysis'>
                        <MdOutlineDocumentScanner color="action" fontSize={24} />
                    </Link>
                </MenuItem>
                <MenuItem >
                    <Link sx={{textDecoration:'none'}} color={'rgb(255, 255, 255)'} href='/'>
                        <Typography variant='h6' color='white' marginRight={2}>Logout</Typography>
                    </Link>
                    <Link href='/' color={'rgb(255, 255, 255)'}>
                        <MdLogout fontSize={24} />
                    </Link>
                </MenuItem>
            </Menu>
            <Toolbar sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: '10px',
                '@media screen and (width <= 415px)': {
                    display: 'none'
                }
            }}>
                <CustomAvatarBadge username={username} />
                <Tooltip title="Favourites">
                    <Badge badgeContent={count === undefined ? 0 : count} color='error'>
                        <Link href='/favourites'>
                            <MdFavorite color="white" fontSize={26} />
                        </Link>
                    </Badge>
                </Tooltip>
                <Tooltip title="Get recipe from image">
                    <Link color='rgb(255, 255, 255)' href="/image-analysis">
                        <MdOutlineDocumentScanner color="white" fontSize={26} />
                    </Link>
                </Tooltip>
                <Tooltip title="logout">
                    <Link href='/' color='rgb(255, 255, 255)'>
                        <MdLogout fontSize={26} />
                    </Link>
                </Tooltip>
            </Toolbar>
            <Badge>
                <img width={50} src={Logo} alt='logo'></img>
            </Badge>
        </nav>

    )
}
export default Navbar;
