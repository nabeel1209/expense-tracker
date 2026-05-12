'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const navigation : { title:string, href:string }[] = [
  {
    title: 'Transaction',
    href: "/"
  },
  {
    title: 'Accounts',
    href: "/accounts"
  },
  {
    title: 'Settings',
    href: "/settings"
  },
]

const Navbar = () => {
  const pathname = usePathname(); 
  return (
    <nav className='w-full px-4 py-3 border border-border-default flex justify-between items-center bg-bg-default absolute top-0'>
        <h1 className='font-geist-mono font-bold text-base text-text-default leading-none'>
          Expense Tracker
        </h1>
        <div className='flex gap-4 items-center'>
            {
              navigation.map((nav, index) => (
                <Link href={nav.href} key={index}>
                  <Button variant={pathname === nav.href ? 'active' : 'inactive'}>
                    {nav.title}
                  </Button>
                </Link>
              ))
            }
        </div>
        <div className='flex gap-2 items-center'>
            <div className='h-4 w-4 rounded-full bg-border-default'></div>
            <p className='font-semibold font-geist-sans text-xs text-text-default'>Nabeel Muhammad</p>
        </div>
    </nav>
  )
}
export default Navbar;