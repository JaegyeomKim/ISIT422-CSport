import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/User';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  editProfileForm = new FormGroup({
    fname : new FormControl(''),
    lname : new FormControl(''),
    bday : new FormControl('')
  })

  fname !: string;
  lname !: string;
  bday !: string;
  
  user !: User;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUser(this.authService.userData.UID).subscribe(x => {
      this.user = x[0];
      this.fillValues(this.user);
    });
  }

  fillValues(user: User) {
    this.fname = user.Fname;
    this.lname = user.Lname;
    this.bday = user.Birthday;
  }

  applyChanges() {
    const newUser = this.user;

    newUser.Fname = this.fname;
    newUser.Lname = this.lname;
    newUser.Birthday = this.bday;

    this.userService.editUser(this.user).subscribe(x => {
      if (sessionStorage.getItem('userData')) {
        sessionStorage.setItem('userData', JSON.stringify(this.user))
      }
    });
  }

  deleteUser() {
    this.authService.deleteUser();
  }
}
