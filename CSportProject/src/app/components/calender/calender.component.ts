import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/Classes';
import { Day } from 'src/app/Day';
import { AuthService } from 'src/app/services/auth.service';
import { ClassesService } from 'src/app/services/classes.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {

  daysCount!: number;

  currentYear!: number;
  currentMonth!: number;

  yearIndex!: number;
  monthIndex!: number;

  currentMonthString!: string;
  currentYearString!: string;

  previousDays: number[] = [];
  nextMonthDays: number[] = [];
  days: number[] = [];

  daysInterfacePreviousDays: Day[] = [];
  daysInterfaceNextMonthDays: Day[] = [];
  daysInterface: Day[] = [];

  currentDay!: number;

  monthNames: string[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  showingCurrentMonth: boolean = true;

  user!: User;
  classes: Class[] = [];

  constructor(
    private userService: UserService,
    private classService: ClassesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.userService.getUser2(this.authService.userData.UID).subscribe(x => {
      this.user = x[0];
      var date = new Date();
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth();

      this.yearIndex = this.currentYear;
      this.monthIndex = this.currentMonth;
      this.populateCalender(this.yearIndex, this.monthIndex);
    });
  }

  populateCalender(currentYear: number, currentMonth: number): void {
    this.currentMonthString = this.monthNames[currentMonth];
    this.currentYearString = currentYear.toString();
    //console.log(this.monthNames[this.monthIndex] + ", " + currentYear);

    var firstDay = this.getFirstDayOfMonth(currentYear, currentMonth);
    var lastDay = this.getLastDayOfWeekOfMonth(currentYear, currentMonth);
    var lastDayOfMonth = this.getLastDayOfMonth(currentYear, currentMonth);
    var previousLastDay = new Date(currentYear, currentMonth, 0).getDate();
    //console.log(firstDay.getDay()); //returns 0-6 (first day of the month in number form).
    this.showingCurrentMonth = false;

    for (var i = firstDay.getDay(); i > 0; i--) { //Counts from 2 down to 0. 2 being index of tuesday
      this.days.push(previousLastDay - i + 1);

      var newDate = new Date(currentYear, currentMonth - 1, previousLastDay - i + 1);

      var newDay = {
        id: previousLastDay - i + 1,
        date: newDate,
        utcDate: newDate.toUTCString()
      } as Day

      this.daysInterfacePreviousDays.push(newDay);
    }

    for (var i = 1; i < lastDayOfMonth + 1; i++) {
      this.days.push(i);

      var todayBoolean = false;
      var dateNow = new Date();
      var newDate = new Date(currentYear, currentMonth, i);
      if (dateNow.toDateString() === newDate.toDateString()) {
        todayBoolean = true;
        this.showingCurrentMonth = true;
      }

      var newDay = {
        id: i,
        date: newDate,
        utcDate: newDate.toUTCString(),
        currentDay: todayBoolean,
        classIDsList: [],
        classIDsPast: [],
        classIDsAvailable: [],
      } as Day

      this.daysInterface.push(newDay);
    }

    if (lastDay.getDay() > 0) {
      var amountDaysToPopulate = 7 - lastDay.getDay();
      for (var i = 1; i < amountDaysToPopulate + 1; i++) {
        this.days.push(i);

        var newDate = new Date(currentYear, currentMonth + 1, i);

        var newDay = {
          id: i,
          date: newDate,
          utcDate: newDate.toUTCString()
        } as Day

        this.daysInterfaceNextMonthDays.push(newDay);
      }
    }

    this.classService.getAllClasses2().subscribe(x => {
      this.classes = x;
      this.putEventsOnCalender();
    });
  }

  returnDay(day: Day) {
    console.log(day);
  }

  putEventsOnCalender(): void {
    for (var i = 0; i < this.user.ClassIDList.length; i++) {
      //1. class with matching ID
      var matchingClassID = this.classes.find(x => x._id === this.user.ClassIDList[i]);
      //2. get date and make event for html
      const dateHere = new Date(matchingClassID?.Date!);
      const utcDateHere = new Date(dateHere.getUTCFullYear(), dateHere.getUTCMonth(), dateHere.getUTCDate(), 0,0,0);
      if (this.daysInterface[dateHere.getUTCDate() - 1].utcDate === utcDateHere.toUTCString()) {
        this.daysInterface[dateHere.getUTCDate() - 1].classIDsList?.push(matchingClassID!);
      }
    }

    for (var i = 0; i < this.user.ClassHistory.length; i++) {
      //1. class with matching ID
      var matchingClassID = this.classes.find(x => x._id === this.user.ClassHistory[i]);
      //2. get date and make event for html
      const dateHere = new Date(matchingClassID?.Date!);
      const utcDateHere = new Date(dateHere.getUTCFullYear(), dateHere.getUTCMonth(), dateHere.getUTCDate(), 0,0,0);
      if (this.daysInterface[dateHere.getUTCDate() - 1].utcDate === utcDateHere.toUTCString()) {
        this.daysInterface[dateHere.getUTCDate() - 1].classIDsPast?.push(matchingClassID!);
      }
    }

    this.classes.forEach(x => {
      const dateHere = new Date(x.Date);
      console.log(dateHere, 'date');
      const utcDateHere = new Date(dateHere.getUTCFullYear(), dateHere.getUTCMonth(), dateHere.getUTCDate(), 0,0,0);
      console.log(utcDateHere, 'utc date');
      if (this.daysInterface[dateHere.getUTCDate() - 1].utcDate === utcDateHere.toUTCString()) {
        this.daysInterface[dateHere.getUTCDate() - 1].classIDsAvailable?.push(x);
      }
    })
  }

  nextMonth() {
    if (this.monthIndex >= 11) {
      this.yearIndex += 1;
      this.monthIndex = 0;
    } else {
      this.monthIndex += 1;
    }

    this.daysInterfacePreviousDays = [];
    this.daysInterfaceNextMonthDays = [];
    this.daysInterface = [];
    this.populateCalender(this.yearIndex, this.monthIndex);
  }

  previousMonth() {
    if (this.monthIndex <= 0) {
      this.yearIndex -= 1;
      this.monthIndex = 11;
    } else {
      this.monthIndex -= 1;
    }

    this.daysInterfacePreviousDays = [];
    this.daysInterfaceNextMonthDays = [];
    this.daysInterface = [];
    this.populateCalender(this.yearIndex, this.monthIndex);
  }

  showCurrentMonth() {
    var date = new Date();
    this.currentYear = date.getFullYear();
    this.currentMonth = date.getMonth();

    this.yearIndex = this.currentYear;
    this.monthIndex = this.currentMonth;

    this.daysInterfacePreviousDays = [];
    this.daysInterfaceNextMonthDays = [];
    this.daysInterface = [];
    this.populateCalender(this.yearIndex, this.monthIndex);
  }

  getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1);
  }

  getLastDayOfMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  getLastDayOfWeekOfMonth(year: number, month: number) {
    return new Date(year, month + 1, 1);
  }
}