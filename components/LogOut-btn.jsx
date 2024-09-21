"use client"
import { LogOut } from '@/actions/handlers'
import { useRouter } from 'next/navigation'
import React from 'react'

export const LogOutbtn = () => {
  const router = useRouter()
  const Logout =  async() =>{
    await LogOut()
    router.refresh()
  }
  return (
    <div>
      <button onClick={Logout} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
      Log out
        </button>
        </div>
  )
}
