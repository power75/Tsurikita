import React from 'react';

type CatchInfoProps = {
  userName?: string;
  date?: string;
  location?: string;
  fishName?: string;
};

const CatchInfo: React.FC<CatchInfoProps> = ({ userName, date, location, fishName }) => (
  <div className="flex flex-col gap-1 pl-3 text-sm">
    <div>{userName || '名無し'}</div>
    <div>{date || '----/--/--'}</div>
    <div>{location || '未設定'}</div>
    <div>{fishName || '不明'}</div>
  </div>
);

export default CatchInfo;
