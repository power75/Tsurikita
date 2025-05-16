import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import CatchImage from './catchImage';
import CatchInfo from './catchInfo';

const dummyData = [
  { image: '/image/logo2.png', userName: 'ユーザー1', date: '2025-05-16', location: '札幌', fishName: 'サケ' },
  { image: '/image/logo2.png', userName: 'ユーザー2', date: '2025-05-15', location: '小樽', fishName: 'カレイ' },
  { image: '/image/logo2.png', userName: 'ユーザー3', date: '2025-05-14', location: '函館', fishName: 'ホッケ' },
  { image: '/image/logo2.png', userName: 'ユーザー4', date: '2025-05-13', location: '稚内', fishName: 'ニシン' },
];

export default function CatchList() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {dummyData.map((item, idx) => (
        <Card key={idx} className="flex flex-col h-full">
          <div className="flex flex-col w-full max-w-md mx-auto">
            <CatchImage src={item.image} alt={item.fishName} />
            <CatchInfo userName={item.userName} date={item.date} location={item.location} fishName={item.fishName} />
          </div>
        </Card>
      ))}
    </div>
  );
}