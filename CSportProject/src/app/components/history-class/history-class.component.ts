import { Component, OnInit } from '@angular/core';
import { Class } from '../../Classes';
import { User } from 'src/app/User';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClassesService } from 'src/app/services/classes.service';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-history-class',
  templateUrl: './history-class.component.html',
  styleUrls: ['./history-class.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistoryClassComponent implements OnInit {

  classes: Class[] = [];

  tempClasses: Class[] = [];


  loading: boolean = true;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private classService: ClassesService
  ) { }

  columnsToDisplay = ['name', 'description', 'time', 'date', 'price'];
  // columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  // expandedElement!: Class;

  user!: User;

  ngOnInit(): void {
    this.userService.getUser2(this.authService.userData.UID).subscribe(x => this.showClasses(x));
  }

  showClasses(user: User[]) {
    this.user = user[0];
    this.classService.getAllClasses2().subscribe(x => {
      this.classes = x;
      this.tempClasses = this.classes.filter(element => this.user.ClassHistory.includes(element._id!));
      this.loading = false;
      console.log(this.tempClasses);
    });
  }
}