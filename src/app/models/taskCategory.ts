import { Task } from "./task";

export class TaskCategory {

    public name: String;
    public tasks: Task[];
    
    constructor(init?: Partial<TaskCategory>) {
        Object.assign(this, init);
    }
}