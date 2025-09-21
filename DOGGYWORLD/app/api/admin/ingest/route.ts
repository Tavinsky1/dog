import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { normalizeRow, streamCsv } from '@/lib/csv'

export async function POST(req: Request){
  const session = await auth()
  if ((session?.user as any)?.role !== 'editor' && (session?.user as any)?.role !== 'admin')
    return new NextResponse('Forbidden', { status: 403 })

  const form = await req.formData()
  const file = form.get('file') as File
  const buf = Buffer.from(await file.arrayBuffer())

  const errors:any[] = []; const results:any[] = []
  let idx = 1
  for await (const rec of await streamCsv(buf)){
    try { results.push(normalizeRow(rec)) }
    catch (e:any) { errors.push({ row: idx, error: e.message }) }
    idx++
  }
  const summary = { total: idx-1, valid: results.length, errors }
  return NextResponse.json({ summary, rows: results.slice(0,100) })
}