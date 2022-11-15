import { Component, OnInit } from '@angular/core';
import { Class } from '../../Classes';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/User';
import { UserService } from 'src/app/services/user.service';
import { ClassesService } from 'src/app/services/classes.service';
import { first } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';
import { Transaction } from 'src/app/Transaction';

@Component({
  selector: 'app-class-view',
  templateUrl: './class-view.component.html',
  styleUrls: ['./class-view.component.css']
})
export class ClassViewComponent implements OnInit {

  classes: Class[] = [];
  tempClasses: Class[] = [];
  user!: User;
  tempClass!: Class;
  selectedClass?: Class;

  loading: boolean = true;
  canEnrollForClass: boolean = true;
  showEnroll: boolean = false;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public classesService: ClassesService,
    public paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.userService.getUser(this.authService.userData.UID).pipe(first()).subscribe(data => this.getUserHere(data));
  }

  private getUserHere(user: User[]) {
    this.user = user[0];
    console.log(this.user);
    this.refreshClassList();
  }

  showPayment(classId: string){
    this.selectedClass = this.tempClasses.find(x => x._id === classId);
    this.showEnroll = true;
  }

  Cancel(){
    this.selectedClass = this.tempClass;
    this.showEnroll = false;
  }

  private getClassesThenShowThem(classes: Class[]) {
    this.classes = classes;
    const today = new Date();

    this.classes.forEach(c => {
      if (!this.user.ClassIDList.includes(c._id!)) {
        if (new Date(c.Date) >= today) {
          if (~~c.ClassSeats > 0) {
            //If it gets to here, it means the class is available for the user to enroll
            this.tempClasses.push(c);
          }
        }
      }
    });

    this.loading = false;
  }

  enrollForClassHere(classID: string, transaction: Transaction) {
    //If it gets to here, its been confirmed that the class was not in the ClassIDList,
    //thats why we can push it right away without checking if it was already in there.
    this.showEnroll = false;
    if (this.canEnrollForClass) {
      this.user.ClassIDList.push(classID);
      this.user.TransactionHistory.push(transaction._id!);
      console.log("before ", this.user);
      this.userService.editUser(this.user).pipe(first()).subscribe(data => this.editClassSeatsHere(data, classID));
      this.canEnrollForClass = false;      
    }
  }

  private editClassSeatsHere(user: User, classID: string) {
    console.log("after", user);
    this.canEnrollForClass = true;

    var tempClass = this.classes.find(x => x._id === classID);
    tempClass!.ClassSeats = (~~tempClass!.ClassSeats - 1).toString();

    this.classesService.editClass(tempClass!).pipe(first()).subscribe(data => this.refreshClassList());
  }

  private refreshClassList() {
    this.loading = true;
    this.tempClasses = [];
    this.classesService.getAllClasses().pipe(first()).subscribe(data => this.getClassesThenShowThem(data));
  }

  CompleteTransaction(pCID: string){
    const newPayment = {
      CID: pCID,
      UID: this.user.UID,
      Price: this.selectedClass!.Price
    } as Transaction

    return this.paymentService.addTransaction(newPayment).subscribe(data => this.enrollForClassHere(pCID, data));
  }
}