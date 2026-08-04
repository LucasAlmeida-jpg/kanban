<template>
  <div class="app">
    <header class="app-header">
      <h1>Kanban Board</h1>
      <p class="app-subtitle">Drag cards between columns to update their status. Double-click a column title to rename it.</p>
    </header>
    <main class="app-main">
      <KanbanBoard />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
}

.app-header {
  margin-bottom: 1rem;
}

.app-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
}

.app-subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.app-main {
  flex: 1;
  min-height: 0;
}
</style>
