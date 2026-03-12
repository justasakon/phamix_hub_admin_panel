import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [state, setState] = useState('Admin');
    const [adminEmail, setEmail] = useState('');
    const [adminPassword, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Added loading state

    const { setAToken, backendUrl } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Start loading

        try {
            if (state === 'Admin') {
                const { data } = await axios.post(`${backendUrl}/api/admin/loginAdmin`, {
                    email: adminEmail, // Ensure correct keys
                    password: adminPassword
                });

                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAToken(data.token);
                } else {
                    toast.error(data.message); // Show error message from server
                }
            } else {
                // Handle other states if necessary
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Error occurred during login');
            } else if (error.request) {
                toast.error('No response from server. Please try again later.');
            } else {
                toast.error('Error: ' + error.message);
            }
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto item-start p-8 sm:min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-[#09f069]'>{state}</span> Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={adminEmail} 
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                        type="email" 
                        required 
                    />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <div className='relative'>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={adminPassword} 
                            className='border border-[#DADADA] rounded w-full p-2 mt-1 pr-10' 
                            type={showPassword ? "text" : "password"} 
                            required 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'>
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>
                <button 
                    className='bg-[#09f069] text-white w-full py-2 rounded-md text-base' 
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'} 
                </button>
                {
                    state === 'Admin'
                    ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
                    : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
                }
            </div>
        </form>
    );
};

export default Login;