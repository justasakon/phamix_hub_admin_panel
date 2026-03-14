import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'

const Sidebar = ({ isOpen, onClose }) => {
    const { aToken } = useContext(AdminContext)

    const menuItems = [
        { path: '/admin-dashboard', icon: assets.home_icon, label: 'Dashboard' },
        { path: '/all-appointments', icon: assets.appointment_icon, label: 'Appointments' },
        { path: '/add-appointment', icon: assets.add_icon, label: 'Add Appointment' },
        { path: '/add-doctor', icon: assets.add_icon, label: 'Add Doctor' },
        { path: '/doctor-list', icon: assets.people_icon, label: 'Doctors List' },
        { path: '/add-patient', icon: assets.add_icon, label: 'Add Patient' },
        { path: '/patients', icon: assets.people_icon, label: 'Patients' },
    ]

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-white shadow-xl lg:shadow-none
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                min-h-screen
            `}>
                <div className="min-h-screen bg-white">
                    {aToken && (
                        <ul className="text-[#515151] py-4">
                            {/* Mobile close button */}
                            <li className="lg:hidden flex justify-end px-4 mb-4">
                                <button onClick={onClose} className="p-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </li>
                            
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink 
                                        className={({isActive})=>`
                                            flex items-center gap-3.5 px-4 py-3 cursor-pointer
                                            ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : 'hover:bg-gray-50'}
                                        `}
                                        to={item.path}
                                        onClick={onClose}
                                    >
                                        <img src={item.icon} alt="" className="w-5 h-5" />
                                        <span className="hidden md:inline">{item.label}</span>
                                        <span className="md:hidden text-sm">{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}

export default Sidebar