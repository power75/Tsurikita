import Image from "next/image";
import Catch from '@/app/(main)/_components/(catch)/catch'
import CatchImage from '@/app/(main)/_components/(catch)/catchImage'
import CatchInfo from '@/app/(main)/_components/(catch)/catchInfo'
import CatchList from '@/app/(main)/_components/(catch)/catch'
export default function Mycatch() {
  return (
    <div className="flex flex-col mt-10">
      <CatchList columns={1} />
    </div>
  );
}