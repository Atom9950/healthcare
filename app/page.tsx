'use client'

import Image from "next/image"
import PatientForm from "@/components/forms/PatientForm"
import Link from "next/link"
import {PasskeyModal} from "@/components/PasskeyModal"
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Suspense } from 'react'

// Separate client component for search params logic
const HomeContent = () => {
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(searchParams.get('admin') === 'true');
  }, [searchParams]);

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image 
            src={"/assets/icons/logo-full.svg"} 
            height={1000} 
            width={1000} 
            className="mb-10 h-12 w-fit" 
            alt={"patient"}
          />

          <PatientForm/>
        </div>

        <div className="text-14-regular mt-20 flex justify-between">
          <p className="justify-items-end text-dark-600 xl:text-left">
           © 2024 CarePulse
          </p>
          <Link href="/?admin=true" className="text-green-500">Admin</Link>
        </div> 
      </section>

      <Image 
        src={"/assets/images/onboarding-img.png"} 
        height={1000} 
        width={1000} 
        className="side-img max-w-[50%]" 
        alt={"patient"}
      />
    </div>
  )
}

// Wrapper component with Suspense
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}