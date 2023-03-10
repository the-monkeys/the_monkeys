import { FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState } from 'react'
export function ProfileIcon() {
  const [profileDropdown, setProfileDropdown] = useState(false)

  return (
        <div
        onClick={(e) => { setProfileDropdown(!profileDropdown); console.log(e.target) }}
        className="relative hidden md:flex bg-purple-600 h-full w-16 h-16 items-center
         justify-center text-white rounded-full cursor-pointer text-3xl z-10">
            <FaUser />
            <ul className={profileDropdown ? 'absolute bottom-0 translate-y-[110%] bg-white text-center rounded-md shadow-md'
             : 'hidden'}>
                <li className='w-full hover:bg-gray-300 px-12 h-14 flex items-center justify-center'>
                    <Link className='text-[12px]'>Profile</Link>
                </li>
                <li className='w-full hover:bg-gray-300 px-12 h-14 flex items-center justify-center'>
                    <Link className='text-[12px]'>Settings</Link>
                </li>
                <li className='w-full hover:bg-gray-300 px-12 h-14 flex items-center justify-center'>
                    <Link className='text-[12px]'>Log Out</Link>
                </li>
            </ul>
        </div>
  )
}
