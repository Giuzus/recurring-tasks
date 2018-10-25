export enum TaskTypeEnum {
    Daily,
    Weekly
}

export class Task {

    public id: String;
    public description: String;
    public type: TaskTypeEnum;
    public completedAt: Date;
    public category: String;
    
    constructor(init?: Partial<Task>) {
        Object.assign(this, init);
    }
}