import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/Classes';
import { AuthService } from 'src/app/services/auth.service'; 
import { ClassesService } from 'src/app/services/classes.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/User';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
// breaks every thing 
// dropdown.component.ts
// export class MyDropDownComponent {
//   public items: Array<{ field: string }> = [
//       { field: 'Option 1' },
//       { field: 'Option 2' },
//       { field: 'Option 3' }
//   ];
// }

export class AdminDashboardComponent implements OnInit {

  views = [false, false,false];

  user ?: User;
  users: User[] = [];

  classes: Class[] = [];

  constructor(     
    public authService: AuthService,
    private userService: UserService,
    private classesService: ClassesService) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('viewIndex')) {
      let viewNum = +sessionStorage.getItem('viewIndex')!;
      this.setView(viewNum);
    } else {
      this.setView(0);
    }
  }

  setView(num: number): void {
    for (let i = 0; i < this.views.length; i++) {
      this.views[i] = false;
    }

    this.views[num] = true;
    sessionStorage.setItem('viewIndex', num.toString());
  }

  getUsers() {
      this.userService.getAllUsers2().subscribe(users => this.users = users);
  }

  getClasses() {
    this.classesService.getAllClasses2().subscribe(classes => this.classes = classes);
  }

  deleteUser(UID: string) {
    this.userService.deleteUser2(UID).subscribe();
  }
}