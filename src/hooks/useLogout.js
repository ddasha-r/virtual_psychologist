import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        localStorage.removeItem("access")
        localStorage.removeItem("persist")
        localStorage.removeItem("role")
        setAuth({});
        // try {
        //     const response = await axios('/logout', {
        //         withCredentials: true
        //     });
        //     console.log(JSON.stringify(response?.data))
        // } catch (err) {
        //     console.error(err);
        // }
    }

    return logout;
}

export default useLogout
