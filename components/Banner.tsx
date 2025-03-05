import Image from 'next/image'
import React from 'react'

function Banner() {
  return (
    <div className="bg-white w-full h-32 sm:h-60 relative rounded-2xl">
        <Image
          src="/banner.png"
          alt="Home Banner"
          fill
          className="object-cover rounded-2xl"
        />
      </div>
  )
}

export default Banner