import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(private tasksService: TasksService, public snackBar: MatSnackBar) { }

  public configForm = new FormGroup({
    dayResetHour: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(23)]),
    weekResetDay: new FormControl(0, Validators.required)
  });

  ngOnInit() {
    this.configForm.setValue({
      dayResetHour: this.tasksService.dayResetHour,
      weekResetDay: this.tasksService.weekResetDay
    })
  }

  openSnackBar() {
    this.snackBar.open("Saved", "", { duration: 500 });
  }

  onSubmit(): void {
    this.tasksService.updateConfiguration(+this.configForm.get('dayResetHour').value, +this.configForm.get('weekResetDay').value);
    this.openSnackBar();
  }
}
