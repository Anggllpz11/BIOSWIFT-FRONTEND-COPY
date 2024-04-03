import react from 'react';
import  Typography  from "@mui/material/Typography";
import Link from '@mui/material/Link';

export const Copyright = (props:any) =>{
    return(
        <Typography variant="body2" color="text.scondary" align="center" {...props}>
            { 'CopyRight'}
            <Link color='inherit' href='https://github.com/MemcoSoftware/Ziriuz2.0-frontend.git'>
            Ziriuz Front-end Repo
            </Link>
            {new Date().getFullYear()}
        </Typography>
    )
}

