import Image from "next/image";

export default function Hokkaido() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 max-w-7xl mx-auto">
      <div className="relative w-full h-30">
        <button className="absolute top-2 right-2 z-10 text-white text-xl px-3 py-1 font-bold">道央</button>
        <a href="#">
          <Image
            src="/image/doou.jpg"
            fill
            alt="道央"
            className="object-cover rounded-lg"
          />
        </a>
      </div>
      <div className="relative w-full h-30">
        <button className="absolute top-2 right-2 z-10 text-white text-xl px-3 py-1 font-bold">道南</button>
        <a href="#">
          <Image
            src="/image/donan.jpg"
            fill
            alt="道南"
            className="object-cover rounded-lg"
          />
        </a>
      </div>
      <div className="relative w-full h-30">
        <button className="absolute top-2 right-2 z-10 text-white text-xl px-3 py-1 font-bold">道北</button>
        <a href="#">
          <Image
            src="/image/dohoku.jpg"
            fill
            alt="道北"
            className="object-cover rounded-lg"
          />
        </a>
      </div>
      <div className="relative w-full h-30">
        <button className="absolute top-2 right-2 z-10 text-white text-xl px-3 py-1 font-bold">道東</button>
        <a href="#">
          <Image
            src="/image/doto.jpg"
            fill
            alt="道東"
            className="object-cover rounded-lg"
          />
        </a>
      </div>
    </div>
  );
}