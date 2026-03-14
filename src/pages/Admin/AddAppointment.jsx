import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddAppointment = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        doctorId: '',
        patientId: '',
        date: '',
        slotTime: '',
        amount: ''
    })

    useEffect(() => {
        if (aToken) {
            fetchDoctors()
            fetchPatients()
        }
    }, [aToken])

    const fetchDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/doctors`, {
                headers: { Authorization: `Bearer ${aToken}` }
            })
            if (data.success) {
                setDoctors(data.doctors)
            }
        } catch (error) {
            console.error('Failed to fetch doctors')
        }
    }

    const fetchPatients = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/patients`, {
                headers: { Authorization: `Bearer ${aToken}` }
            })
            if (data.success) {
                setPatients(data.patients)
            }
        } catch (error) {
            console.error('Failed to fetch patients')
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        
        // Auto-fill amount when doctor is selected
        if (name === 'doctorId') {
            const doctor = doctors.find(d => d._id === value)
            if (doctor) {
                setFormData(prev => ({ ...prev, amount: doctor.fees }))
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.doctorId || !formData.patientId || !formData.date || !formData.slotTime || !formData.amount) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/appointments`,
                formData,
                { headers: { Authorization: `Bearer ${aToken}` } }
            )

            if (data.success) {
                toast.success('Appointment created successfully!')
                setFormData({
                    doctorId: '',
                    patientId: '',
                    date: '',
                    slotTime: '',
                    amount: ''
                })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create appointment')
        } finally {
            setLoading(false)
        }
    }

    // Generate time slots
    const timeSlots = []
    for (let hour = 9; hour <= 17; hour++) {
        timeSlots.push(`${hour}:00`)
        timeSlots.push(`${hour}:30`)
    }

    return (
        <div className="p-3 md:p-4 w-full flex justify-center">
            <div className="w-full max-w-lg lg:max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Add Appointment</h2>
                <form onSubmit={handleSubmit} className="bg-white px-4 py-5 border rounded-xl w-full">
                    <div className="space-y-3 text-gray-600">
                        <div>
                            <p className="text-sm font-medium mb-1">Select Doctor *</p>
                            <select
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                required
                            >
                                <option value="">Choose a doctor</option>
                                {doctors.map(doc => (
                                    <option key={doc._id} value={doc._id}>
                                        {doc.name} - {doc.speciality}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-1">Select Patient *</p>
                            <select
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                required
                            >
                                <option value="">Choose a patient</option>
                                {patients.map(patient => (
                                    <option key={patient._id} value={patient._id}>
                                        {patient.name} - {patient.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm font-medium mb-1">Appointment Date *</p>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">Time Slot *</p>
                                <select
                                    name="slotTime"
                                    value={formData.slotTime}
                                    onChange={handleChange}
                                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    required
                                >
                                    <option value="">Select time</option>
                                    {timeSlots.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-1">Amount ($) *</p>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                placeholder="Amount"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-base font-bold py-3 mt-4 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
                    >
                        {loading ? 'Creating...' : 'Create Appointment'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddAppointment
