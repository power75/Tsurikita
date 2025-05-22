"use client"
import { signup } from './actions'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <form action={signup} className="flex flex-col gap-3 max-w-xs mx-auto h-screen">
      <label htmlFor="username">ユーザー名</label>
      <Input id="username" name="username" type="text" placeholder="ユーザー名" />
      <label htmlFor="email">メールアドレス</label>
      <Input id="email" name="email" type="email" placeholder="メールアドレス" required minLength={2} />
      <label htmlFor="password">パスワード</label>
      <Input id="password" name="password" type="password" placeholder="パスワード" required minLength={6} />
      <Button type="submit">アカウント作成</Button>
    </form>
  )
}
