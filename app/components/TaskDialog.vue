<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h3>{{ task ? "Edit task" : "New task" }}</h3>

      <label class="field">
        <span>Title</span>
        <input
          ref="titleInput"
          v-model="title"
          type="text"
          placeholder="Task title"
          @keyup.enter="save"
        />
      </label>

      <label class="field">
        <span>Description</span>
        <textarea
          v-model="description"
          rows="4"
          placeholder="Optional details"
        />
      </label>

   <label class="field">
      <span>Priority</span>
      <select v-model="priority">
        <option v-for="t in priorityOptions" :key="t" :value="t">{{ t }}</option>
      </select>
    </label>

      <div class="modal-actions">
        <button type="button" class="secondary" @click="$emit('close')">
          Cancel
        </button>
        <button
          type="button"
          class="primary"
          :disabled="!title.trim()"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskInput, Priority } from "~/types/board";

const priorityOptions: Priority[] = ["low", "medium", "high"];

const props = withDefaults(
  defineProps<{
    task?: Task | null;
  }>(),
  {
    task: null,
  },
);
const priority = ref<Priority>(props.task?.priority ?? "medium");
const emit = defineEmits<{
  save: [TaskInput];
  close: [];
}>();

const title = ref(props.task?.title ?? "");
const description = ref(props.task?.description ?? "");
const titleInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  titleInput.value?.focus();
});

function save() {
  if (!title.value.trim()) return;
  emit("save", {
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
  });
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.modal h3 {
  margin: 0 0 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.field input,
.field textarea,
.field select {
  font: inherit;
  color: inherit;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.6rem;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.modal-actions button {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid transparent;
}

.secondary {
  background: transparent;
  border-color: var(--border);
  color: inherit;
}

.primary {
  background: var(--accent);
  color: white;
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
