import React, { useState, useEffect, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorDashboard = () => {
    const { backendUrl, dToken, doctor, logout } = useContext(DoctorContext)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0
    })

    const fetchAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: { Authorization: `Bearer ${dToken}` }
            })
            if (data.success) {
                setAppointments(data.appointments)
                
                setStats({
                    total: data.appointments.length,
                    pending: data.appointments.filter(a => a.status === 'pending' && !a.cancelled).length,
                    completed: data.appointments.filter(a => a.status === 'completed').length,
                    cancelled: data.appointments.filter(a => a.cancelled).length
                })
            }
        } catch (error) {
            console.error('Failed to fetch appointments', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (dToken && doctor) fetchAppointments()
    }, [dToken, doctor])

    const handleStatusChange = async (id, newStatus) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/appointments/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${dToken}` } }
            )
            if (data.success) {
                toast.success(`Appointment marked as ${newStatus}`)
                fetchAppointments()
            }
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleCancelAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return
        try {
            const { data } = await axios.put(`${backendUrl}/api/admin/appointments/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${dToken}` }
            })
            if (data.success) {
                toast.success('Appointment cancelled')
                fetchAppointments()
            }
        } catch (error) {
            toast.error('Failed to cancel appointment')
        }
    }

    const handleLogout = () => {
        logout()
        window.location.href = '/doctor-login'
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 min-h-screen bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>
                    <p className="text-gray-500">Welcome, Dr. {doctor?.name}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                    <p className="text-gray-500 text-sm">Total</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl shadow-sm p-4 md:p-6">
                    <p className="text-yellow-600 text-sm">Pending</p>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-700">{stats.pending}</p>
                </div>
                <div className="bg-green-50 rounded-xl shadow-sm p-4 md:p-6">
                    <p className="text-green-600 text-sm">Completed</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-700">{stats.completed}</p>
                </div>
                <div className="bg-red-50 rounded-xl shadow-sm p-4 md:p-6">
                    <p className="text-red-600 text-sm">Cancelled</p>
                    <p className="text-2xl md:text-3xl font-bold text-red-700">{stats.cancelled}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">My Appointments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {appointments.map((apt) => (
                                <tr key={apt._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{apt.userData?.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">{apt.userData?.email || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{formatDate(apt.date)}</td>
                                    <td className="px-4 py-4 text-gray-600">{apt.slotTime}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            apt.cancelled 
                                                ? 'bg-red-100 text-red-800' 
                                                : apt.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : apt.status === 'confirmed'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {apt.cancelled ? 'Cancelled' : apt.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        {!apt.cancelled && (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={apt.status}
                                                    onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                                                    className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${
                                                        apt.status === 'completed' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : apt.status === 'confirmed'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : apt.status === 'in-progress'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : apt.status === 'failed'
                                                            ? 'bg-red-100 text-red-800'
                                                            : apt.status === 'no-show'
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="failed">Failed</option>
                                                    <option value="no-show">No Show</option>
                                                </select>
                                                <button
                                                    onClick={() => handleCancelAppointment(apt._id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Cancel"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        {apt.cancelled && (
                                            <span className="text-gray-400 text-sm">Cancelled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {appointments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No appointments found
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorDashboard
