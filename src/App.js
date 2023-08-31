import './App.css';
import {Navigate, Route, Routes} from 'react-router-dom';
import LoginOrRegister from './pages/LoginOrRegister';
import MyWallet from './pages/wallets/MyWallet';
import HomePage from "./pages/homePage";
import {useDispatch, useSelector} from "react-redux";
import Reports from './pages/reports/Reports';
import PageSearch from "./pages/PageSearch";
import VerifyRegister from "./pages/VerifyRegister";
import ResetPassword from "./pages/ResetPassword";
import AcceptCard from "./components/card/AcceptCard";
import io from "socket.io-client";
import {setSocket} from "./redux/walletSlice";
import {useEffect} from "react";
import Categories from './pages/Categories';

function App() {
    const auth = useSelector(state => state.auth.login.success);

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.login.currentUser);
    const userID = user?.id;
    const email = user?.email;

    useEffect(() => {
        if (auth) {
            const socket = io.connect('https://moneylover-backend-production.up.railway.app');
            socket.emit('login', email);
            socket.on('forwardMessage', async (data) => {
                const {senderEmail, message, walletInfo, permission} = data;
                const savedMessagesJSON = localStorage.getItem(`${userID}_receivedMessages`);
                const savedMessages = savedMessagesJSON ? JSON.parse(savedMessagesJSON) : [];
                const newMessage = { id: Date.now(), senderEmail, message, walletInfo, permission};
                const updatedMessages = [...savedMessages, newMessage];
                localStorage.setItem(`${userID}_receivedMessages`, JSON.stringify(updatedMessages));
            });
            dispatch(setSocket(socket));

            return () => {
                socket.disconnect();
            };
        }
    }, [auth]);

    return (
        <Routes>
            <Route path={"/"} element={auth ? <HomePage/>: <Navigate to='/login'/>}/>
            <Route path={"/login"} element={!auth ? <LoginOrRegister props={true}/> : <Navigate to='/'/>}/>
            {/*<Route path={"/login"} element={<LoginOrRegister props={true}/>}/>*/}
            <Route path={"/register"} element={!auth ? <LoginOrRegister props={false}/> : <Navigate to='/'/>}/>
            <Route path={"/my-wallets"} element={auth ? <MyWallet/>: <Navigate to='/login'/>}></Route>
            <Route path={"/reports"} element={auth ? <Reports/> : <Navigate to='/login'/>}></Route>
            <Route path={"/verify/:token"} element={<VerifyRegister/>}></Route>
            <Route path={"/forgot-password"} element={<ResetPassword/>}></Route>
            <Route path={"/search"} element={auth ? <PageSearch/> : <Navigate to='/'/>}></Route>
            <Route path={"/category"} element={auth ? <Categories/> : <Navigate to='/'/>}></Route>
            <Route path={"/awaiting-shared"} element={auth ? <AcceptCard/> : <Navigate to='/'/>}></Route>

            <Route path={"*"} element={!auth ? <Navigate to='/login'/>: <Navigate to='/'/>}/>
        </Routes>
    );
}

export default App;
