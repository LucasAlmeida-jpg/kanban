import type { Board, TaskInput, TaskUpdate, TaskArg } from "~/types/board"

const STORAGE_KEY = 'kanban-board'

function createId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function seedBoard(): Board {
  return {
    columns: [
      {
        id: createId(),
        title: 'To Do',
        tasks: [
          { id: createId(), title: 'Plan the sprint', description: 'Define goals and scope for the next sprint.' },
          { id: createId(), title: 'Design database schema', description: '' }
        ]
      },
      {
        id: createId(),
        title: 'In Progress',
        tasks: [
          { id: createId(), title: 'Build authentication flow', description: 'Login, signup and password reset.' }
        ]
      },
      {
        id: createId(),
        title: 'Done',
        tasks: [
          { id: createId(), title: 'Set up project', description: 'Scaffold the Nuxt app.' }
        ]
      }
    ]
  }
}

export function useBoard() {
  const board = useState<Board>('kanban-board', () => seedBoard())

  function persist() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board.value))
    }
  }

  function load() {
    if (!import.meta.client) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      board.value = JSON.parse(raw)
    } catch (error) {
      console.error('Failed to parse saved board, keeping defaults', error)
    }
  }

  function addColumn(title: string) {
    board.value.columns.push({ id: createId(), title, tasks: [] })
    persist()
  }

  function removeColumn(columnId: string) {
    board.value.columns = board.value.columns.filter(column => column.id !== columnId)
    persist()
  }

  function renameColumn(columnId: string, title: string) {
    const column = board.value.columns.find(column => column.id === columnId)
    if (column) column.title = title
    persist()
  }

  function addTask(columnId: string, task: TaskInput) {
    const column = board.value.columns.find(column => column.id === columnId)
    if (!column) return
    column.tasks.push({
      id: createId(),
      title: task.title,
      description: task.description || ''
    })
    persist()
  }

  function updateTask(taskId: string, updates: TaskUpdate) {
    for (const column of board.value.columns) {
      const task = column.tasks.find(task => task.id === taskId)
      if (task) {
        Object.assign(task, updates)
        break
      }
    }
    persist()
  }

  function removeTask(columnId: string, taskId: string) {
    const column = board.value.columns.find(column => column.id === columnId)
    if (!column) return
    column.tasks = column.tasks.filter(task => task.id !== taskId)
    persist()
  }

  function moveTask({ taskId, fromColumnId, toColumnId, toIndex }: TaskArg) {
    const fromColumn = board.value.columns.find(column => column.id === fromColumnId)
    const toColumn = board.value.columns.find(column => column.id === toColumnId)
    if (!fromColumn || !toColumn) return

    const fromIndex = fromColumn.tasks.findIndex(task => task.id === taskId)
    if (fromIndex === -1) return

    const [task] = fromColumn.tasks.splice(fromIndex, 1)
    if (!task) return
    let insertIndex = toIndex ?? toColumn.tasks.length
    if (fromColumnId === toColumnId && fromIndex < insertIndex) {
      insertIndex -= 1
    }
    insertIndex = Math.max(0, Math.min(insertIndex, toColumn.tasks.length))

    toColumn.tasks.splice(insertIndex, 0, task)
    persist()
  }

  return {
    board,
    load,
    addColumn,
    removeColumn,
    renameColumn,
    addTask,
    updateTask,
    removeTask,
    moveTask
  }
}
