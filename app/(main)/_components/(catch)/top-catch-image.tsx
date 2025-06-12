'use server'

import React from 'react';
import Image from 'next/image';
import { sql } from '@vercel/postgres';

export default async function TopCatchImage() {
  const { rows: catches } = await sql`
    SELECT id, image_url
    FROM catches
    ORDER BY created_at DESC
    LIMIT 4
  `;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {catches.map((catchItem) => (
        <div key={catchItem.id} className="relative aspect-square">
          <Image
            src={catchItem.image_url}
            alt="Catch image"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
