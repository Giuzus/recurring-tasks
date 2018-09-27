import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Task } from '../../../models/task';
import { TasksService } from '../../../services/tasks.service';

import { Subscription } from "rxjs";
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { listener } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor(private taskService: TasksService) { }

  draggableListLeft = [
    {
      content: "Left",
      effectAllowed: "move",
      disable: false,
      handle: false,
    },
    {
      content: "Lefter",
      effectAllowed: "move",
      disable: false,
      handle: false,
    },
    {
      content: "Leftest",
      effectAllowed: "copyMove",
      disable: false,
      handle: false
    },
    {
      content: "Lefty",
      effectAllowed: "move",
      disable: false,
      handle: true,
    }
  ];

  @Input()
  public tasks: Task[];

  @Input()
  public name: string;

  public editMode: boolean = false;


  ngOnInit() {
    console.log(name);
  }

  onRemove(id: string) {
    this.taskService.removeTask(id);
  }

  onSelect(opt, task) {
    if (opt.selected) {
      this.taskService.completeTask(task.id);
    }
    else {
      this.taskService.incompleteTask(task.id);
    }
  }

  onEditMode() {
    this.editMode = !this.editMode;
  }

  onDrop(event: DndDropEvent) {
    let index = event.index;
    if (typeof index === "undefined") {
      index = this.tasks.length;
    }
    this.taskService.move(event.data.id, index);

  }


}
