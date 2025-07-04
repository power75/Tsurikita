import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Mycatch from '@/app/(main)/_components/(mypage)/mycatch';
import React from 'react';
export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  //data.user.idにはauth.uidが格納される
  let { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.user.id)
      .single();

  let username = profiles?.username;

  return (
   <div className="grid grid-cols-5">
      <div className="col-span-5 flex justify-center">
        <div className="max-w-[700px]">
          <Mycatch />
        </div>
      </div>
    </div>
  );
}