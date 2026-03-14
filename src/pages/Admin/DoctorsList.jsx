import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

const DoctorsList = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingDoctor, setEditingDoctor] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewingPhoto, setViewingPhoto] = useState(null)

    const fetchDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/doctors`, {
                headers: { Authorization: `Bearer ${aToken}` }
            })
            if (data.success) {
                setDoctors(data.doctors)
            }
        } catch (error) {
            toast.error('Failed to fetch doctors')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (aToken) fetchDoctors()
    }, [aToken])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return
        try {
            const { data } = await axios.delete(`${backendUrl}/api/admin/doctors/${id}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            })
            if (data.success) {
                toast.success('Doctor deleted successfully')
                fetchDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to delete doctor')
        }
    }

    const handleToggleAvailability = async (doctor) => {
        try {
            const { data } = await axios.put(`${backendUrl}/api/admin/doctors/${doctor._id}`, 
                { available: !doctor.available },
                { headers: { Authorization: `Bearer ${aToken}` } }
            )
            if (data.success) {
                toast.success(`Doctor ${doctor.available ? 'unavailable' : 'available'}`)
                fetchDoctors()
            }
        } catch (error) {
            toast.error('Failed to update availability')
        }
    }

    const filteredDoctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Doctors List</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speciality</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <img 
                                            src={doctor.Image || assets.upload_area} 
                                            alt={doctor.name}
                                            className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary"
                                            onClick={() => setViewingPhoto(doctor.Image || assets.upload_area)}
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{doctor.name}</p>
                                            <p className="text-sm text-gray-500">{doctor.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{doctor.speciality}</td>
                                    <td className="px-4 py-4 text-gray-600">{doctor.experience}</td>
                                    <td className="px-4 py-4 text-gray-600">${doctor.fees}</td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => handleToggleAvailability(doctor)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                doctor.available 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {doctor.available ? 'Available' : 'Unavailable'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingDoctor(doctor)
                                                    setShowModal(true)
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doctor._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No doctors found
                    </div>
                )}
            </div>

            {showModal && editingDoctor && (
                <EditDoctorModal 
                    doctor={editingDoctor} 
                    onClose={() => {
                        setShowModal(false)
                        setEditingDoctor(null)
                    }}
                    onSuccess={fetchDoctors}
                />
            )}

            {viewingPhoto && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setViewingPhoto(null)}
                >
                    <div className="relative max-w-3xl w-full">
                        <button 
                            onClick={() => setViewingPhoto(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img 
                            src={viewingPhoto} 
                            alt="Doctor Profile" 
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

const EditDoctorModal = ({ doctor, onClose, onSuccess }) => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [docImg, setDocImg] = useState(null)
    const [formData, setFormData] = useState({
        name: doctor.name,
        email: doctor.email,
        password: '',
        speciality: doctor.speciality,
        degree: doctor.degree,
        experience: doctor.experience,
        about: doctor.about,
        fees: doctor.fees,
        address1: doctor.address?.line1 || '',
        address2: doctor.address?.line2 || '',
        available: doctor.available
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = new FormData()
            Object.keys(formData).forEach(key => {
                if (key === 'address1' || key === 'address2') return
                data.append(key, formData[key])
            })
            data.append('address', JSON.stringify({ line1: formData.address1, line2: formData.address2 }))

            if (docImg) {
                data.append('image', docImg)
            }

            const { data: res } = await axios.put(
                `${backendUrl}/api/admin/doctors/${doctor._id}`,
                data,
                { headers: { Authorization: `Bearer ${aToken}`, 'Content-Type': 'multipart/form-data' } }
            )
            toast.success('Doctor updated successfully')
            onSuccess()
            onClose()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update doctor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Edit Doctor</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Doctor Image */}
                        <div className="flex items-center gap-4 mb-6">
                            <label htmlFor="doc-img-edit" className="cursor-pointer">
                                <img 
                                    className="w-20 h-20 bg-gray-100 rounded-full object-cover border-2 border-primary"
                                    src={docImg ? URL.createObjectURL(docImg) : (doctor.Image || assets.upload_area)} 
                                    alt={doctor.name} 
                                />
                            </label>
                            <input 
                                onChange={(e) => setDocImg(e.target.files[0])} 
                                type="file" 
                                id="doc-img-edit" 
                                accept="image/*"
                                className="hidden" 
                            />
                            <div>
                                <p className="font-medium text-gray-700">Doctor Photo</p>
                                <p className="text-sm text-gray-500">Click to change photo</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank)</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                                <select
                                    value={formData.speciality}
                                    onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                >
                                    <option value="General physician">General physician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Gastroenterologist">Gastroenterologist</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                <input
                                    type="text"
                                    value={formData.degree}
                                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                <select
                                    value={formData.experience}
                                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                >
                                    {[...Array(20)].map((_, i) => (
                                        <option key={i+1} value={`${i+1} Year`}>{i+1} Year</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fees ($)</label>
                                <input
                                    type="number"
                                    value={formData.fees}
                                    onChange={(e) => setFormData({...formData, fees: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                                <select
                                    value={formData.available}
                                    onChange={(e) => setFormData({...formData, available: e.target.value === 'true'})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                >
                                    <option value="true">Available</option>
                                    <option value="false">Unavailable</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={formData.address1}
                                    onChange={(e) => setFormData({...formData, address1: e.target.value})}
                                    placeholder="Address Line 1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                                <input
                                    type="text"
                                    value={formData.address2}
                                    onChange={(e) => setFormData({...formData, address2: e.target.value})}
                                    placeholder="Address Line 2"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                            <textarea
                                value={formData.about}
                                onChange={(e) => setFormData({...formData, about: e.target.value})}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DoctorsList