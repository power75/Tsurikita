import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <Image src="/image/logo.png" alt="ロゴ" width={1000} height={1000} />
    </div>
  )
}