import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function StoreProfile() {
  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-2">
          <div className="flex gap-2 items-center">
            <Image 
              src='/logo.png'
              width={50}
              height={50}
              alt="logo"
              className="rounded-full object-cover border-[2.5px] border-[#ededed]"
            />
            <div className="flex flex-col">
              <h1 className="font-bold">Borcelle Fast Food</h1>
              <p className="text-xs font-bold"> Rua do Borcelle, 123, FastFood </p>
              <p className="text-xs font-bold"> (11) 9 8888 7777 </p>
              <Link className="font-light text-xs" href="/">Ver mais</Link >
            </div>

          </div>

      </div>
  )
}

export default StoreProfile