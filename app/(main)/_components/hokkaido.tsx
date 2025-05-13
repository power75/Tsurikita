import Image from "next/image";

export default function Hokkaido() {
  return (
      <div className="relative w-full max-w-[700px] mx-auto">
        <Image
          src="/image/hokkaido_map.png"
          alt="北海道"
          width={700}
          height={620}
          className="w-full h-auto"
          useMap="#ImageMap"
        />
        <map name="ImageMap">
          <area shape="rect" coords="502,162,580,200" href="#" alt="道東" />
          <area shape="rect" coords="350,37,429,74" href="#" alt="道北" />
          <area shape="rect" coords="131,292,208,328" href="#" alt="道央" />
          <area shape="rect" coords="174,504,252,541" href="#" alt="道南" />
        </map>
      </div>
  );
}