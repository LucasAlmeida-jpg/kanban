export interface Task {
    id: string;
    title: string;
    description: string;
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
export type TaskInput = Pick<Task, "title" | "description">
export type TaskUpdate = Partial<TaskInput>
