import Image from "next/image";

type Catch = {
  id: string;
  image_url: string | null;
  fish: string | null;
  comment: string | null;
};

type Props = {
  catches: Catch[];
};

export default function CatchList({ catches }: Props) {
  if (!catches || catches.length === 0) {
    return <p className="text-center">この釣り場の釣果はまだありません。</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {catches.map((catchItem) => (
        <div key={catchItem.id} className="border rounded-lg p-4 text-center">
          {catchItem.image_url && (
            <div className="relative w-full h-40 mb-2">
              <Image
                src={catchItem.image_url}
                alt={catchItem.fish || "Catch image"}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          )}
          <h3 className="font-semibold">{catchItem.fish}</h3>
          <p className="text-sm text-gray-600">{catchItem.comment}</p>
        </div>
      ))}
    </div>
  );
} 