// material
import { styled } from '@mui/material/styles';
import {Card, Typography, Box} from '@mui/material';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
    position: 'absolute',
    marginTop: '19%',
    left: '44%',
    transform: 'translate(-50%, -50%)',
    width: 145,
    height: 145,
    color: '#2c5c61',
    backgroundColor: '#bef2f7',
    border: '2px solid theme.palette.green.dark',
    boxShadow: 24,
    p: 4,
    borderRadius: 10,
    alignItems: 'center',
    '&:hover': {
        backgroundColor: '#f2f2f3',
        color: '#4d4c4a',
        opacity: [0, 0, 0.7],
    }
}));

// ----------------------------------------------------------------------

export default function CurrentlyUsed() {
    return (
        <RootStyle>
            <Box component="span" sx={{ justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{ textAlign: 'center', padding: '11%', fontSize: 15}}>Currently used Disk Space</Typography>
                <Typography variant="h4" sx={{ textAlign: 'center', padding: '2%'}}>0 GB</Typography>
            </Box>
        </RootStyle>
    );
}
