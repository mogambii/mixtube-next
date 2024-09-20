"use client"
import { LogOut } from '@/actions/handlers'
import React from 'react'

export const LogOutbtn = () => {
  const Logout =  async() =>{
    await LogOut()
    window.location.reload()
  }
  return (
    <div>
      <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
      LogOut-btn
        </button></div>
  )
}
