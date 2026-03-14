import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (aToken) {
            fetchStats()
            // Refresh stats every 30 seconds for real-time updates
            const interval = setInterval(fetchStats, 30000)
            return () => clearInterval(interval)
        }
    }, [aToken])

    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments/stats`, {
                headers: { Authorization: `Bearer ${aToken}` }
            })
            console.log('Stats response:', data)
            if (data.success) {
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Failed to fetch stats', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const statCards = [
        { 
            label: 'Total Doctors', 
            value: stats?.totalDoctors || 0, 
            icon: '👨‍⚕️',
            color: 'bg-purple-50 text-purple-600'
        },
        { 
            label: 'Total Patients', 
            value: stats?.totalPatients || 0, 
            icon: '👥',
            color: 'bg-indigo-50 text-indigo-600'
        },
        { 
            label: 'Total Appointments', 
            value: stats?.totalAppointments || 0, 
            icon: '📅',
            color: 'bg-blue-50 text-blue-600'
        },
        { 
            label: 'Pending', 
            value: stats?.pendingAppointments || 0, 
            icon: '⏳',
            color: 'bg-yellow-50 text-yellow-600'
        },
        { 
            label: 'Completed', 
            value: stats?.completedAppointments || 0, 
            icon: '✅',
            color: 'bg-green-50 text-green-600'
        },
        { 
            label: 'Cancelled', 
            value: stats?.cancelledAppointments || 0, 
            icon: '❌',
            color: 'bg-red-50 text-red-600'
        },
    ]

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const chartData = stats?.appointmentsByMonth || []
    const maxCount = Math.max(...chartData.map(d => d.count), 1)

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Revenue</h3>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-3xl">💰</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">${stats?.totalRevenue?.toLocaleString() || 0}</p>
                        <p className="text-sm text-gray-500">Total earnings from appointments</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointments Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointments (Last 6 Months)</h3>
                    <div className="h-64">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="_id" 
                                        tickFormatter={(value) => months[value - 1]}
                                        stroke="#6b7280"
                                        fontSize={12}
                                    />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#fff', 
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value, name) => [value, 'Appointments']}
                                        labelFormatter={(label) => months[label - 1]}
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#16a34a" 
                                        radius={[4, 4, 0, 0]}
                                        name="Appointments"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Doctors */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Doctors</h3>
                    <div className="space-y-4">
                        {stats?.topDoctors?.length > 0 ? stats.topDoctors.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{doc.doctorName}</p>
                                        <p className="text-xs text-gray-500">{doc.count} appointments</p>
                                    </div>
                                </div>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${(doc.count / (stats?.topDoctors?.[0]?.count || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-500">
                                No doctor data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="/add-doctor" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                    <div className="text-2xl mb-2">👨‍⚕️</div>
                    <p className="text-sm font-medium text-gray-700">Add Doctor</p>
                </a>
                <a href="/doctor-list" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <p className="text-sm font-medium text-gray-700">Manage Doctors</p>
                </a>
                <a href="/all-appointments" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                    <div className="text-2xl mb-2">📅</div>
                    <p className="text-sm font-medium text-gray-700">View Appointments</p>
                </a>
                <a href="/patients" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <p className="text-sm font-medium text-gray-700">View Patients</p>
                </a>
            </div>
        </div>
    )
}

export default Dashboard