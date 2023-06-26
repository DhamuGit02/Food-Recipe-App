import cookingImg from '../images/cooking.png'
import {Box, LinearProgress, Typography} from '@mui/material'
import {styled} from '@mui/system'

const CustomLinearProgress = styled(LinearProgress)({
    backgroundColor: 'rgb(40, 40, 40)',
    '& .MuiLinearProgress-bar1Indeterminate': {
        backgroundColor:'orangered'
    },
    '& .MuiLinearProgress-bar2Indeterminate' : {
        backgroundColor:'orange'
    }
})
function LoadingPage () {
    return (
        <div className="loading-container" style={{
            width:'100%',
            height:'100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        }}>
            <Box sx={{width:200}}>
                <img src={cookingImg} style={{width:'100%'}}/>
                <CustomLinearProgress sx={{marginTop:2}}/>
            </Box>
        </div>
    )
}

export default LoadingPage