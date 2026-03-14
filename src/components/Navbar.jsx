import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Navbar = ({ onMenuClick }) => {
    const { aToken, setAToken } = useContext(AdminContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        setAToken('')
        localStorage.removeItem('aToken')
        toast.success('Logged out successfully')
        navigate('/')
    }

    return (
        <div className="flex justify-between items-center px-3 sm:px-6 lg:px-10 py-3 border-b bg-white shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile menu button */}
                <button 
                    onClick={onMenuClick} 
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                
                <img className="w-28 sm:w-40 cursor-pointer" src={assets.admin_logo} alt="" />
                <p className="border px-2 py-0.5 rounded-full border-gray-500 text-gray-600 text-xs hidden sm:block">Admin</p>
            </div>
            
            <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 sm:px-8 py-2.5 sm:py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
            </button>
        </div>
    )
}

export default Navbar