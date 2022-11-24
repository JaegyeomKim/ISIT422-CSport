import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/User';
import { Class } from 'src/app/Classes';
import { ClassViewComponent } from '../class-view/class-view.component';
import { ClassesService } from 'src/app/services/classes.service';
import { UserService } from 'src/app/services/user.service';
import { first } from 'rxjs';


@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {

  views = [false, false, false, false, false];

  user!: User;
  // fName1!: string;
  // lName1!: string;

  constructor(
    public authService: AuthService,
    private classService: ClassesService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.returnUserObject();
    if (sessionStorage.getItem('viewIndex')) {
      let viewNum = +sessionStorage.getItem('viewIndex')!;
      this.setView(viewNum);
    } else {
      this.setView(0);
    }

    //Get classes and cache data. User is being cached on login.
    this.classService.getAllClasses2().pipe(first()).subscribe();


    this.checkClassesForPastDate();
  }

  setView(num: number): void {
    for (let i = 0; i < this.views.length; i++) {
      this.views[i] = false;
    }
    
    this.views[num] = true;
    sessionStorage.setItem('viewIndex', num.toString());
  }

  checkClassesForPastDate() {
    if (this.user.ClassIDList.length <= 0) {
      return;
    }
    //this.classService.getAllClasses2().subscribe(x => this.checkClassList(x));
  }

  checkClassList(classes: Class[]) {
    var tempClasses = classes.filter(element => this.user.ClassIDList.includes(element._id!));

    var date = new Date();

    tempClasses.forEach(value => {
      const newDate = new Date(value.Date);
      if (newDate.toDateString() > date.toDateString()) {
        const classIndex = this.user.ClassIDList.indexOf(value._id!);
        if (classIndex !== -1) {
          this.user.ClassIDList.splice(classIndex, 1);
          this.user.ClassHistory.push(value._id!); 
        }
      }
    });

    this.userService.editUser(this.user).subscribe(x => {
      this.authService.userData = x;
    })
  }
}