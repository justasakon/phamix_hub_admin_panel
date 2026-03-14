import React, { useContext, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import DoctorContextProvider from './context/DoctorContext';
import { DoctorContext } from './context/DoctorContext';
import Navbar from './components/Navbar';
import Sidebar from './components/sidebar';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import AddAppointment from './pages/Admin/AddAppointment';
import AddPatient from './pages/Admin/AddPatient';
import DoctorsList from './pages/Admin/DoctorsList';
import PatientsList from './pages/Admin/PatientsList';
import Dashboard from './pages/Admin/Dashboard';
import Login from './pages/Login';
import DoctorLogin from './pages/Doctor/DoctorLogin';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <DoctorContextProvider>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      {dToken ? (
        <DoctorDashboard />
      ) : aToken ? (
        <div className="bg-gray-50 min-h-screen flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex flex-1 items-start">
            <Sidebar 
              isOpen={sidebarOpen} 
              onClose={() => setSidebarOpen(false)} 
            />
            <div className="flex-1 w-full lg:w-auto overflow-y-auto h-[calc(100vh-60px)]">
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/admin-dashboard' element={<Dashboard />} />
                <Route path='/all-appointments' element={<AllAppointments />} />
                <Route path='/add-appointment' element={<AddAppointment />} />
                <Route path='/add-doctor' element={<AddDoctor />} />
                <Route path='/add-patient' element={<AddPatient />} />
                <Route path='/doctor-list' element={<DoctorsList />} />
                <Route path='/patients' element={<PatientsList />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/doctor-login' element={<DoctorLogin />} />
        </Routes>
      )}
    </DoctorContextProvider>
  )
}

export default App