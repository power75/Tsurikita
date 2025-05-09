import Image from 'next/image'

export default function Home() {
  return (
    <div>
    <h1 className="text-5xl font-mono text-center">
      ツリキタ！！！！！！！！！！！！！！！
    </h1>
      <Image src="/image/logo.png" alt="ロゴ" width={100} height={100} />
    </div>
  )
}