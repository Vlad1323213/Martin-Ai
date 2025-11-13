'use client'

import { TodoItem } from '@/types'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { formatDate } from '@/utils/date'

interface TodoListProps {
  todos: TodoItem[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-telegram-secondary">
        <p>Нет задач</p>
      </div>
    )
  }

  return (
    <List className="bg-telegram-card rounded-2xl overflow-hidden">
      {todos.map((todo, index) => (
        <ListItem
          key={todo.id}
          disablePadding
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDelete(todo.id)}
              sx={{ color: '#ff3b30' }}
            >
              <Delete />
            </IconButton>
          }
          sx={{
            borderBottom: index < todos.length - 1 ? '1px solid #2c2c2e' : 'none',
          }}
        >
          <ListItemButton
            role={undefined}
            onClick={() => onToggle(todo.id)}
            dense
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Checkbox
                edge="start"
                checked={todo.completed}
                tabIndex={-1}
                disableRipple
                sx={{
                  color: '#8e8e93',
                  '&.Mui-checked': {
                    color: '#34c759',
                  },
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={todo.title}
              secondary={todo.dueDate ? formatDate(todo.dueDate) : null}
              sx={{
                '& .MuiListItemText-primary': {
                  color: todo.completed ? '#8e8e93' : '#ffffff',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                },
                '& .MuiListItemText-secondary': {
                  color: '#8e8e93',
                  fontSize: '13px',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}








