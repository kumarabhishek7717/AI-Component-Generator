import React from 'react'
import { HiSun } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";

const Navbar = () => {
  return (
    <div className="nav flex flex-col sm:flex-row items-center justify-between px-5 sm:px-24 py-4 border-b border-gray-800">
      <div className='logo'>
        <h3 className='text-2xl sm:text-3xl font-bold sp-text'>GenUI</h3>
      </div>
      <div className='icons flex mt-2 sm:mt-0 gap-4'>
        <div className="icon cursor-pointer hover:text-yellow-400"><HiSun /></div>
        <div className="icon cursor-pointer hover:text-yellow-400"><FaUser /></div>
        <div className="icon cursor-pointer hover:text-yellow-400"><RiSettings3Fill /></div>
      </div>
    </div>
  )
}

export default Navbar
