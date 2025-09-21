import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { normalizeRow, streamCsv } from '@/lib/csv'

export async function POST(request: Request) {
  try {
    const session = await auth()
    const userRole = (session?.user as any)?.role

    if (userRole !== 'editor' && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const errors: Array<{ row: number; field?: string; error: string }> = []
    const rows: any[] = []
    let rowIndex = 1

    for await (const record of streamCsv(buffer)) {
      try {
        const normalizedRow = normalizeRow(record)
        rows.push(normalizedRow)
      } catch (error: any) {
        errors.push({
          row: rowIndex,
          error: error.message
        })
      }
      rowIndex++
    }

    const summary = {
      total: rowIndex - 1,
      valid: rows.length,
      errors
    }

    return NextResponse.json({
      summary,
      rows: rows.slice(0, 100) // Return first 100 valid rows
    })
  } catch (error) {
    console.error('Ingest validation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}