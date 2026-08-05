export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface Board {
    columns: Column[];
}

export interface TaskArg {
    taskId: string;
    fromColumnId: string; 
    toColumnId: string; 
    toIndex?: number;
}
export type TaskInput = Pick<Task, "title" | "description" | "priority">
export type TaskUpdate = Partial<TaskInput>
export type Priority = 'low' | 'medium' | 'high'
