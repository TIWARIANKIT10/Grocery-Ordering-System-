import React from 'react'
import { userAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
const Login = () => {
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const {setShowUserLogin, setUser, navigate, api, setCardItem} = userAppContext()

    // Close on Escape, like every other modal on the site.
    React.useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") setShowUserLogin(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [setShowUserLogin]);

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            const {data} = await api.post(`/api/user/${state}`,{name ,email,password});
            if(data.success){
                navigate('/')
                setUser(data.user)
                // Restore the account's saved cart. Without
                // this the cart-sync effect immediately POSTs
                // the (empty) guest cart over the server's.
                setCardItem(data.user.cartItems || {})
                setShowUserLogin(false)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-base text-gray-600 bg-black/50' onClick={()=> setShowUserLogin(false)}>

        <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-full max-w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <label htmlFor="login-name">Name</label>
                    <input id="login-name" autoComplete="name" onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <label htmlFor="login-email">Email</label>
                <input id="login-email" autoComplete="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <label htmlFor="login-password">Password</label>
                <input id="login-password" autoComplete={state === "login" ? "current-password" : "new-password"} minLength={state === "register" ? 8 : undefined} onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <button type="button" onClick={() => setState("login")} className="text-primary cursor-pointer">click here</button>
                </p>
            ) : (
                <p>
                    Create an account? <button type="button" onClick={() => setState("register")} className="text-primary cursor-pointer">click here</button>
                </p>
            )}
            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
        </div>
    );
};
export default Login
