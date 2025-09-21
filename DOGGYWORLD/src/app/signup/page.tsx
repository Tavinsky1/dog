'use client'

import { useState } from 'react'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(e: any) {
    e.preventDefault()
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    if (res.ok) {
      window.location.href = '/login'
    } else {
      alert('Signup failed')
    }
  }

  return (
    <main className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="border w-full rounded-lg px-3 py-2"
        />
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
          placeholder="Password (min 8)"
          className="border w-full rounded-lg px-3 py-2"
        />
        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Sign up
        </button>
      </form>
    </main>
  )
}