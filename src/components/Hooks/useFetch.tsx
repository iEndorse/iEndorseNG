import { useState, useEffect } from 'react';

const useFetch = (url:string,apiMethod:string, onSuccess:any, onError:any ) => {
    const [ data, setData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(!false);
    const [error, setError] = useState<any>();

    const fetchApi = async () => {
        setLoading(true);
        try{
            const apiResponse = await fetch(url, {
                headers:{
                    "content-type": "application/json",
                    "Authorization": `Bearer ${window.localStorage.getItem("token")}`   
                }
            });
            if (!apiResponse.ok) {
                throw new Error('Failed to fetch');
              }
            const responseData =await apiResponse.json();
            if(apiResponse.ok){
                setData(responseData.data);
                onSuccess();
                setLoading(false);
            }
        }catch(err){
            console.error(err);
            onError();
            setLoading(false);
            // setError(err)
        }

    }


    const refreshApi = async () => {

        setLoading(true);
        try{
            const apiResponse = await fetch(url, {
                
                method:apiMethod,
                headers:{
                    "content-type": "application/json",
                    "Authorization": `Bearer ${window.localStorage.getItem("token")}`        
                }
            });
            if (!apiResponse.ok) {
                throw new Error('Failed to fetch');
              }
            const responseData = await apiResponse.json();
            if(apiResponse.ok){
                setData(responseData.data);
                onSuccess();
                setLoading(false);
            }
        }catch(err){
            console.log(err);
            // onError();
        }
    }



    useEffect(()=>{
        fetchApi();
    },[])
    return { data, refreshApi, loading, error }
}

export default useFetch;
