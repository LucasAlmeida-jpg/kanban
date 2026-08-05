<template>
  <div class="column">
    <div class="column-header">
      <input
        v-if="editingTitle"
        ref="titleInput"
        v-model="titleDraft"
        class="column-title-input"
        @blur="saveTitle"
        @keyup.enter="saveTitle"
        @keyup.esc="cancelTitle"
      />
      <h2 v-else class="column-title" @dblclick="startEditTitle">
        {{ column.title }}
      </h2>
      <span class="column-count">{{ column.tasks.length }}</span>
      <button
        class="column-remove"
        type="button"
        title="Remove column"
        @click="$emit('remove-column', column.id)"
      >
        ×
      </button>
    </div>

    <div
      class="column-body"
      @dragover.prevent="onDragOverColumn"
      @drop.prevent="onDropColumn"
      @dragleave="onDragLeaveColumn"
    >
      <template v-for="(task, index) in column.tasks" :key="task.id">
        <div
          class="drop-indicator"
          :class="{ visible: dragOverIndex === index }"
        />
        <div @dragover.prevent="onDragOverCard($event, index)">
          <KanbanCard
            :task="task"
            :column-id="column.id"
            @edit="$emit('edit-task', column.id, task)"
            @delete="$emit('delete-task', column.id, task.id)"
            @dragend="dragOverIndex = null"
          />
        </div>
      </template>
      <div
        class="drop-indicator"
        :class="{ visible: dragOverIndex === column.tasks.length }"
      />

      <p v-if="!column.tasks.length" class="column-empty">No tasks yet</p>
    </div>

    <button
      class="add-task-button"
      type="button"
      @click="$emit('add-task', column.id)"
    >
      + Add task
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Column, Task, TaskArg } from "~/types/board";

const props = defineProps<{
  column: Column;
}>();
const emit = defineEmits<{
  "add-task": [columnId: string];
  "edit-task": [columnId: string, task: Task];
  "delete-task": [columnId: string, taskId: string]
  "remove-column": [columnId: string];
  "move-task": [payload: TaskArg];
  "rename-column": [columnId: string, title: string]
}>();

const dragOverIndex = ref<number | null>(null);
const editingTitle = ref(false);
const titleDraft = ref("");
const titleInput = ref<HTMLInputElement | null>(null);

function onDragOverCard(event: DragEvent, index: number) {
  if (!(event.currentTarget instanceof HTMLElement)) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const isAfter = event.clientY - bounds.top > bounds.height / 2;
  dragOverIndex.value = isAfter ? index + 1 : index;
}

function onDragOverColumn() {
  if (dragOverIndex.value === null) {
    dragOverIndex.value = props.column.tasks.length;
  }
}

function onDragLeaveColumn(event: DragEvent) {
  if (!(event.currentTarget instanceof HTMLElement)) return;
  if (
    event.relatedTarget instanceof Node &&
    event.currentTarget.contains(event.relatedTarget)
  ) {
    return;
  }
  dragOverIndex.value = null;
}

function onDropColumn(event: DragEvent) {
  if (!event.dataTransfer) return;
  const raw = event.dataTransfer.getData("text/plain");
  if (!raw) return;
  const { taskId, fromColumnId } = JSON.parse(raw);
  const toIndex = dragOverIndex.value ?? props.column.tasks.length;
  emit("move-task", {
    taskId,
    fromColumnId,
    toColumnId: props.column.id,
    toIndex,
  });
  dragOverIndex.value = null;
}

function startEditTitle() {
  titleDraft.value = props.column.title;
  editingTitle.value = true;
  nextTick(() => titleInput.value?.focus());
}

function saveTitle() {
  if (titleDraft.value.trim()) {
    emit("rename-column", props.column.id, titleDraft.value.trim());
  }
  editingTitle.value = false;
}

function cancelTitle() {
  editingTitle.value = false;
}
</script>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  background: var(--column-bg);
  border-radius: 10px;
  padding: 0.75rem;
  width: 280px;
  min-width: 280px;
  max-height: 100%;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.25rem 0.75rem;
}

.column-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  cursor: text;
}

.column-title-input {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 700;
  border: 1px solid var(--accent);
  border-radius: 6px;
  padding: 0.15rem 0.4rem;
  background: var(--card-bg);
  color: inherit;
}

.column-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--chip-bg);
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
}

.column-remove {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

.column-remove:hover {
  background: var(--danger-bg);
  color: var(--danger);
}

.column-body {
  flex: 1;
  overflow-y: auto;
  min-height: 40px;
  padding: 0.1rem;
}

.column-empty {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  margin: 1rem 0;
}

.drop-indicator {
  height: 0;
  border-radius: 3px;
  background: var(--accent);
  margin: 0;
  opacity: 0;
  transition:
    height 0.12s ease,
    opacity 0.12s ease,
    margin 0.12s ease;
}

.drop-indicator.visible {
  height: 6px;
  opacity: 1;
  margin: 0.25rem 0;
}

.add-task-button {
  border: 1px dashed var(--border);
  background: transparent;
  color: var(--text-muted);
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.add-task-button:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
