import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  views = [false, false];

  user !: User;
  email !: string;
  fname !: string;
  lname !: string;
  bday !: string;
  role !: string;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUser(this.authService.userData.UID).pipe(first()).subscribe(data => this.fillValues(data));
  }

  setView(num: number): void {
    for (let i = 0; i < this.views.length; i++) {
      this.views[i] = false;
    }

    this.views[num] = true;
  }

  fillValues(user: User[]) {
    this.user = user[0];
    this.email = this.user.Email;
    this.fname = this.user.Fname;
    this.lname = this.user.Lname;
    this.bday = this.user.Birthday;
    this.role = this.user.Role
  }
}