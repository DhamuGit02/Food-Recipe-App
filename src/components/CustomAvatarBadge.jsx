import Avatar from '@mui/material/Avatar';
import { Box} from '@mui/material'
import Img from '../images/cake.png'

var StringToColor = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
function CustomAvatarBadge({username}) {
    // console.log(username, "from Avatar")
    const nameParts = username.split(" ")
    // console.log(nameParts)
    return (
        <Box sx={{
            position:'relative',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            width:'40px',
            height:'40px'
        }}>
            <Avatar sx={{backgroundColor:StringToColor(username)}}>{nameParts[0][0] + "" + nameParts[1][0]}</Avatar>
            <Box sx={{
                position:'absolute',
                bottom:0,
                right:5,
                width: 10,
                height: 10,
                backgroundColor: '#44b700',
                borderRadius: '100%'
            }} />
        </Box>
    )
}

CustomAvatarBadge.defaultProps = {
  username: "X X"
}

export default CustomAvatarBadge