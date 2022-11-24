import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; //Import fireauth
import { Router } from '@angular/router'; //Import router
import { Console } from 'console';
import { BehaviorSubject, first } from 'rxjs';
import { User } from '../User';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData!: User;
  sessionStorageUserData!: User;
  newUserData: User[] = [];
  newnewUserData!: User;

  emptyUserData!: User;

  isLogin: boolean = false;
  roleAs: string = "Customer";

  dbStatus: string = ""

  user = new BehaviorSubject<any>(null);

  constructor(
    private aAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService) { }

  signInUsingFakeInformation(user: User) {
    this.userData = user;
    if (this.userData.Role == "1") {
      this.router.navigate(['/a-dashboard']);
      this.user.next(this.userData)
      sessionStorage.setItem('userData', JSON.stringify(this.userData))
    }
    else if (this.userData.Role == "0") {
      this.router.navigate(['/c-dashboard']);
    }
  }

  login(email: string, password: string) { //Login with email and password.
    this.aAuth.signInWithEmailAndPassword(email, password)
      .then(value => {
        this.userService.getUser2(value.user?.uid).subscribe(user => {
          this.newUserData = user;
          this.userData = user[0];
          if (this.userData.Role != "1" && this.userData.Role != "0") {
            console.error("Error logging in.");
            this.router.navigate(['/'])
          } else {
            if (this.userData.Role == "1") {
              this.router.navigate(['/a-dashboard']);
            }
            else if (this.userData.Role == "0") {
              this.router.navigate(['/c-dashboard']);
            }

            this.user.next(this.userData)
            sessionStorage.setItem('userData', JSON.stringify(this.userData))
          }
        });
      })
  }

  autoLogin() {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
      this.user.next(null);
      return;
    }
    this.user.next(userData)
    this.userData = JSON.parse(userData) as User;
  }

  emailSignUp(email: string, password: string, user: User) { //Sign up with email and password.
    this.userService.getMongoStatus().subscribe(data => {
      this.dbStatus = data;
      if (this.dbStatus === "Connected!") {
        console.log("say something please");
        this.aAuth.createUserWithEmailAndPassword(email, password)
          .then(value => {
            //Add mongoDB user here.
            this.addUserToMongoDB(value.user!.uid, user);
            this.router.navigate(['/signin']);
          })
          .catch(error => {
            console.log('Something went wrong: ', error);
          });
      }
    });
  }

  private addUserToMongoDB(uid: string, user: User) {
    //TODO: Replace User ID with uid
    user.UID = uid; //This works!
    this.userService.addUser(user).subscribe();
  }

  logout() { //Log the current user and rest fields.
    this.aAuth.signOut().then(() => {
      this.userData = this.emptyUserData;
      this.isLogin = false;
      this.roleAs = '';
      sessionStorage.clear();
      this.router.navigate(['/']);
    });
  }

  deleteUser() {
    if (this.isLoggedIn) {
      this.aAuth.currentUser
        .then(value => {
          value?.delete()
            .then(value2 => {
              this.userService.deleteUser(value.uid).subscribe(deletedUser => {
                console.log("User deleted from firebase and mongoDB! Returning to signin page.");
                this.logout();
              });
            })
        })
        .catch(error => {
          console.log('Cant delete account from firebase: ', error);
        });
    }
  }

  returnUserObject(): User {
    return this.userData;
  }

  get isLoggedIn(): boolean { //Gets a boolean on whether a user is logged in or not.
    if (sessionStorage.getItem("userData")) {
      console.log('user is still logged in');
      return true;
    }
    return false;
  }
}