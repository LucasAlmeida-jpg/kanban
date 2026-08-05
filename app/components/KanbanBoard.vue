<template>
  <div class="board">
    <KanbanColumn
      v-for="column in board.columns"
      :key="column.id"
      :column="column"
      @add-task="openNewTaskDialog"
      @edit-task="openEditTaskDialog"
      @delete-task="removeTask"
      @remove-column="confirmRemoveColumn"
      @move-task="moveTask"
      @rename-column="renameColumn"
    />

    <div class="add-column">
      <input
        v-model="newColumnTitle"
        type="text"
        placeholder="New column name"
        @keyup.enter="createColumn"
      >
      <button type="button" @click="createColumn">+ Add column</button>
    </div>

    <TaskDialog
      v-if="dialogOpen"
      :task="dialogTask"
      @save="saveTask"
      @close="dialogOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskInput } from "~/types/board";
const {
  board,
  load,
  addColumn,
  removeColumn,
  renameColumn,
  addTask,
  updateTask,
  removeTask,
  moveTask
} = useBoard()

onMounted(() => {
  load()
})

const newColumnTitle = ref('')
const dialogOpen = ref(false)
const dialogTask = ref<Task | null>(null);
const dialogColumnId = ref<string | null>(null);

function createColumn() {
  const title = newColumnTitle.value.trim()
  if (!title) return
  addColumn(title)
  newColumnTitle.value = ''
}

function confirmRemoveColumn(columnId: string) {
  const column = board.value.columns.find(column => column.id === columnId)
  if (!column) return
  if (column.tasks.length && !confirm(`Delete column "${column.title}" and its ${column.tasks.length} task(s)?`)) {
    return
  }
  removeColumn(columnId)
}

function openNewTaskDialog(columnId: string) {
  dialogColumnId.value = columnId
  dialogTask.value = null
  dialogOpen.value = true
}

function openEditTaskDialog(columnId:string, task: Task) {
  dialogColumnId.value = columnId
  dialogTask.value = task
  dialogOpen.value = true
}

function saveTask(taskData: TaskInput) {
  console.log(taskData)
  if (dialogTask.value) {
    updateTask(dialogTask.value.id, taskData)
  } else {
    if (!dialogColumnId.value) return
    addTask(dialogColumnId.value, taskData)
  }
  dialogOpen.value = false
}
</script>

<style scoped>
.board {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.25rem 0.25rem 1.5rem;
  height: 100%;
}

.add-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 220px;
  min-width: 220px;
  padding: 0.75rem;
}

.add-column input {
  font: inherit;
  color: inherit;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.6rem;
}

.add-column button {
  border: 1px dashed var(--border);
  background: transparent;
  color: var(--text-muted);
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.add-column button:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
