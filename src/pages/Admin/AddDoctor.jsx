import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
   const [docImg,setDocImg] = useState(false)
   const [name,setName] = useState('')
   const [email,setEmail] = useState('')
   const [password,setPassword] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   const [experience,setExperience] = useState('1 Year')
   const [fees,setFees] = useState('')
   const [about,setAbout] = useState('')
   const [speciality,setSpeciality] = useState('General physician')
   const [degree,setDegree] = useState('')
   const [address1,setAddress1] = useState('')
   const [address2,setAddress2] = useState('')
   const [loading, setLoading] = useState(false)

   const {backendUrl, aToken} = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        if (!docImg) {
            toast.error('Please upload a doctor photo')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('experience', experience)
            formData.append('about', about)
            formData.append('fees', fees)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(
                `${backendUrl}/api/admin/add-doctor`,
                formData,
                { headers: { Authorization: `Bearer ${aToken}`, 'Content-Type': 'multipart/form-data' } }
            )

            if (data.success) {
                toast.success('Doctor added successfully!')
                // Reset form
                setDocImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setExperience('1 Year')
                setFees('')
                setAbout('')
                setSpeciality('General physician')
                setDegree('')
                setAddress1('')
                setAddress2('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add doctor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-3 md:p-4 w-full flex justify-center">
            <div className="w-full max-w-lg lg:max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Add Doctor</h2>
                <div className="bg-white px-4 py-5 border rounded-xl w-full">
                    <div className="flex items-center gap-4 mb-5 text-gray-500">
                        <label htmlFor="doc-img" className="cursor-pointer shrink-0">
                            <img 
                                className="w-16 h-16 bg-gray-100 rounded-full object-cover" 
                                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                alt="" 
                            />
                        </label>
                        <input 
                            onChange={(e) => setDocImg(e.target.files[0])} 
                            type="file" 
                            id="doc-img" 
                            accept="image/*"
                            className="hidden" 
                        />
                        <p className="text-sm">Upload doctor<br />picture</p>
                    </div>

                    <div className="space-y-3 text-gray-600">
                        <div>
                            <p className="text-sm font-medium mb-1">Doctor Name</p>
                            <input 
                                onChange={(e)=>setName(e.target.value)} 
                                value={name} 
                                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm" 
                                type="text" 
                                placeholder="Name" 
                                required 
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-1">Doctor Email</p>
                            <input 
                                onChange={(e)=>setEmail(e.target.value)} 
                                value={email} 
                                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm" 
                                type="email" 
                                placeholder="Email" 
                                required 
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-1">Doctor Password</p>
                            <div className="relative">
                                <input 
                                    onChange={(e)=>setPassword(e.target.value)} 
                                    value={password} 
                                    className="border rounded-lg px-3 py-2 pr-10 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Password" 
                                    required 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm font-medium mb-1">Experience</p>
                                <select 
                                    onChange={(e)=>setExperience(e.target.value)} 
                                    value={experience} 
                                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                >
                                    {[...Array(20)].map((_, i) => (
                                        <option key={i+1} value={`${i+1} Year`}>{i+1} Year</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">Fees ($)</p>
                                <input 
                                    onChange={(e)=>setFees(e.target.value)} 
                                    value={fees} 
                                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm" 
                                    type="number" 
                                    placeholder="Fees" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm font-medium mb-1">Speciality</p>
                                <select 
                                    onChange={(e)=>setSpeciality(e.target.value)} 
                                    value={speciality} 
                                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
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
                                <p className="text-sm font-medium mb-1">Education</p>
                                <input 
                                    onChange={(e)=>setDegree(e.target.value)} 
                                    value={degree} 
                                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm" 
                                    type="text" 
                                    placeholder="Education" 
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-1">Address</p>
                            <input 
                                onChange={(e)=>setAddress1(e.target.value)} 
                                value={address1} 
                                className="border rounded-lg px-3 py-2 w-full mb-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm" 
                                type="text" 
                                placeholder="Address Line 1" 
                                required 
                            />
                            <input 
                                onChange={(e)=>setAddress2(e.target.value)} 
                                value={address2} 
                                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm" 
                                type="text" 
                                placeholder="Address Line 2" 
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-1">About Doctor</p>
                            <textarea 
                                onChange={(e)=>setAbout(e.target.value)} 
                                value={about} 
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm" 
                                placeholder="Write about doctor" 
                                rows={3} 
                                required 
                            />
                        </div>
                    </div>

                    <button 
                        type="button"
                        disabled={loading}
                        onClick={onSubmitHandler}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-base font-bold py-3 mt-4 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
                    >
                        {loading ? 'Adding...' : 'Add Doctor'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddDoctor