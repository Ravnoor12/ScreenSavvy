import client from "./client"

export const createUser = async (userInfo)=>{
    try{
        const {data} = await client.post('/user/create',userInfo);  //data is id,name and email 
        return data;
    }
    catch (error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error:error.message || error}; 
    }
}

export const verifyUserEmail = async (userInfo)=>{
    try{
        const {data} = await client.post('/user/verify-email',userInfo); //userInfo consist of OTP and userId
        return data;
    }
    catch (error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error:error.message || error}; 
    }
}

export const signInUser = async (userInfo)=>{
    try{
        const {data} = await client.post('/user/signin',userInfo); //userInfo consist of name,user._id,email,jwt token
        return data;
    }
    catch (error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error:error.message || error}; 
    }
}

export const getIsAuth = async (token)=>{
    try{
        const {data} = await client.get('/user/is-auth',{
            headers:{
                Authorization: 'Bearer ' + token,
                accept: "application/json"   // to accept json data
            }
        }); //userInfo consist of name,user._id,email,jwt token
        return data;
    }
    catch (error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error:error.message || error}; 
    }
}

export const forgetPassword = async (email)=>{
    try{
        const {data} = await client.post('/user/forget-password',{email});
        return data;
    }
    catch (error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error:error.message || error}; 
    }
}

export const verifyPasswordResetToken = async (token,userId)=>{
    try{
        const {data} = await client.post('/user/verify-password-reset-token',{token,userId});
        return data;
    }
    catch (error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error:error.message || error}; 
    }
}

export const resetPassword = async (passwordInfo)=>{ //passwordInfo is userId, token and new password
    try{
        const {data} = await client.post('/user/reset-password',passwordInfo);
        return data;
    }
    catch (error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error:error.message || error}; 
    }
}

export const resentEmailVerificationToken = async (userId)=>{ //passwordInfo is userId, token and new password
    try{
        const {data} = await client.post('/user/resend-email-verification-token',{userId});
        return data;
    }
    catch (error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error:error.message || error}; 
    }
}