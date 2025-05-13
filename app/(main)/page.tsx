import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Header from './_components/header'
import Hokkaido from './_components/hokkaido'
export default function Home() {
  return (
    <main className='container mx-auto mb-50'>
      <div className='bg-secondary m-3 p-4'>
        <div className="text-left">
          <h1 className="text-gray-600 font-bold text-2xl mb-3">地図から釣り場を探す</h1>
        </div>
        <div className='flex items-center justify-center'>
          <Hokkaido />
        </div>
      </div>
    </main>
  )
}

