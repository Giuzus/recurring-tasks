export enum TaskTypeEnum {
    Daily,
    Weekly
}

export class Task {

    public id: String;
    public description: String;
    public type: TaskTypeEnum;
    public completedAt: Date;
    
    constructor(init?: Partial<Task>) {
        Object.assign(this, init);
    }

}