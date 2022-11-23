import { Component, OnInit } from '@angular/core';
import { Observable } from '@firebase/util';
import { Class } from 'src/app/Classes';
import { ClassesService } from 'src/app/services/classes.service';
import { UserService } from 'src/app/services/user.service';
import {makeStateKey} from '@angular/platform-browser';

@Component({
  selector: 'app-new-class-view',
  templateUrl: './new-class-view.component.html',
  styleUrls: ['./new-class-view.component.css']
})
export class NewClassViewComponent implements OnInit {

  myData$!: any;
  user$!: any;

  tempClasses: Class[] = [];

  constructor(
    private classesService: ClassesService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user$ = this.userService.getUser2().subscribe(x => this.user$ = x);

    this.myData$ = this.classesService.classes;

    this.classesService.getAllClasses2().subscribe(x => this.tempClasses = x);
  }
}