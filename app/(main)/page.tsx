import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Header from './_components/header'
import Hokkaido from './_components/hokkaido'
export default function Home() {
  return (
    <main className='container mx-auto'>
      <div className='bg-secondary m-3 p-4'>
        <div className="text-left">
          <h1 className="text-2xl mb-3 font-bold bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent inline-block w-fit">
            釣り場を探す
          </h1>
        </div>
        <div>
          <Hokkaido />
        </div>
      </div>
    </main>
  )
}

