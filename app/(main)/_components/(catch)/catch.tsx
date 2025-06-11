import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import CatchImage from './catchImage';
import CatchInfo from './catchInfo';

const dummyData = [
  { id: '1', image: '/image/logo2.png', userName: 'ユーザー1', date: '2025-05-16', location: '札幌', fishName: 'サケ' },
  { id: '2', image: '/image/logo2.png', userName: 'ユーザー2', date: '2025-05-15', location: '小樽', fishName: 'カレイ' },
  { id: '3', image: '/image/logo2.png', userName: 'ユーザー3', date: '2025-05-14', location: '函館', fishName: 'ホッケ' },
  { id: '4', image: '/image/logo2.png', userName: 'ユーザー4', date: '2025-05-13', location: '稚内', fishName: 'ニシン' },
];

export default function CatchList({ columns = 4 }: { columns?: number }) {
  return (
    <div className={
        `grid gap-6 ` +
        (columns === 1
          ? 'grid-cols-1'
          : `grid-cols-2 md:grid-cols-${columns}`)
      }>
      {dummyData.map((item, idx) => (
        <Card key={idx} className="flex flex-col h-full">
          <div className="flex flex-col w-full max-w-md mx-auto">
              <CatchImage catchId={item.id} alt={item.fishName} />
            <CatchInfo userName={item.userName} date={item.date} location={item.location} fishName={item.fishName} />
          </div>
        </Card>
      ))}
    </div>
  );
}