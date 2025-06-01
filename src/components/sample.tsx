import  {GoogleLogin} from '@react-oauth/google';
import { combineSlices } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


export function Sample() {
    const navigate = useNavigate();
    const userData: any = window.localStorage.getItem("userData");
    const parsedUserData = JSON.parse(userData);
    return (

        <GoogleLogin
        onSuccess={credentialResponse => {
            if (credentialResponse.credential) {
                console.log(credentialResponse);
                window.localStorage.setItem("token", credentialResponse.credential);
                console.log(jwtDecode(credentialResponse.credential));
                window.localStorage.setItem("userData", JSON.stringify(jwtDecode(credentialResponse.credential)));
                navigate('/');
            } else {
                console.error("No credential received");
            }
        }}
        onError={() => {
            console.log('Login Failed');
        }}
    />
    
    
    ); 
}