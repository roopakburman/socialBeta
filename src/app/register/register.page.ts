import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  username: string="";
  password: string="";
  cpassword: string="";
  constructor(
    public router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  initiateSignup(){
    const {username, password, cpassword} = this;
    this.authService.registerWithFirebase(username, password, cpassword);
    this.username='';
    this.password='';
    this.cpassword='';
  }



}
