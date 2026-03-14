import React, { useState, createContext, useEffect } from 'react'
import axios from 'axios'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
    const [doctor, setDoctor] = useState(null)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

    useEffect(() => {
        if (dToken) {
            fetchDoctorProfile()
        }
    }, [dToken])

    const fetchDoctorProfile = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
                headers: { Authorization: `Bearer ${dToken}` }
            })
            if (data.success) {
                setDoctor(data.doctor)
            }
        } catch (error) {
            console.error('Failed to fetch doctor profile', error)
            if (error.response?.status === 401) {
                logout()
            }
        }
    }

    const logout = () => {
        setDToken('')
        setDoctor(null)
        localStorage.removeItem('dToken')
    }

    const value = {
        dToken,
        setDToken,
        doctor,
        setDoctor,
        backendUrl,
        logout,
        fetchDoctorProfile
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;