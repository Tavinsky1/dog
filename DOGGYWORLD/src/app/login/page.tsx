'use client'

import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(e: any) {
    e.preventDefault()
    await fetch('/api/auth/signin', {
      method: 'POST',
      body: new URLSearchParams({ email, password })
    })
    window.location.href = '/'
  }

  return (
    <main className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="border w-full rounded-lg px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="border w-full rounded-lg px-3 py-2"
        />
        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Continue
        </button>
      </form>
    </main>
  )
}