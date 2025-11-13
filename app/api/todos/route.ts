import { NextRequest, NextResponse } from 'next/server'

// Mock data - в продакшене использовать базу данных
// eslint-disable-next-line prefer-const
let todos = [
  {
    id: '1',
    title: 'Review quarterly reports',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Prepare presentation slides',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Call insurance company',
    completed: true,
    createdAt: new Date().toISOString(),
  },
]

// GET /api/todos - Get all todos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    // TODO: Фильтровать по userId из базы данных
    return NextResponse.json({ todos })
  } catch (error) {
    console.error('Get todos error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/todos - Create new todo
export async function POST(request: NextRequest) {
  try {
    const { title, userId, dueDate } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const newTodo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null,
    }

    todos.push(newTodo)

    return NextResponse.json({ todo: newTodo }, { status: 201 })
  } catch (error) {
    console.error('Create todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/todos/[id] - Update todo
export async function PATCH(request: NextRequest) {
  try {
    const { id, completed, title } = await request.json()

    const todoIndex = todos.findIndex((t) => t.id === id)
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    if (completed !== undefined) {
      todos[todoIndex].completed = completed
    }
    if (title !== undefined) {
      todos[todoIndex].title = title
    }

    return NextResponse.json({ todo: todos[todoIndex] })
  } catch (error) {
    console.error('Update todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      )
    }

    const todoIndex = todos.findIndex((t) => t.id === id)
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    todos.splice(todoIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}







