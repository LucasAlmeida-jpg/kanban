<template>
  <div
    class="card"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="$emit('dragend')"
    @click="$emit('edit')"
  >
    <p class="card-title">{{ task.title }}</p>
    <p v-if="task.description" class="card-description">
      {{ task.description }}
    </p>
    <button
      class="card-delete"
      type="button"
      title="Delete task"
      @click.stop="$emit('delete')"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/board";

const props = defineProps<{
  task: Task;
  columnId: string;
}>();

const emit = defineEmits<{
  edit: []
  delete: []
  dragend: []
}>()

function onDragStart(event: DragEvent) {
  if(!event.dataTransfer) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      taskId: props.task.id,
      fromColumnId: props.columnId,
    }),
  );
}
</script>

<style scoped>
.card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem 2rem 0.75rem 0.75rem;
  margin-bottom: 0.5rem;
  cursor: grab;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition:
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.card:active {
  cursor: grabbing;
}

.card-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0 0 0.25rem;
  word-break: break-word;
}

.card-description {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.card-delete {
  position: absolute;
  top: 0.4rem;
  right: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

.card-delete:hover {
  background: var(--danger-bg);
  color: var(--danger);
}
</style>
