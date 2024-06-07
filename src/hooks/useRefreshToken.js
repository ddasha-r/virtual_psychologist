import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        /*const response = await axios.get('/refresh', {
            withCredentials: true
        });*/
        setAuth(prev => {
            let accessToken = localStorage.getItem("access");
            const role = Number(localStorage.getItem("role"));
            return {
                ...prev,
                roles: [role], //response.data.role,
                accessToken: accessToken
            }
        });
        let accessToken = localStorage.getItem("access")
        return accessToken;
    }
    return refresh;
};

export default useRefreshToken;
