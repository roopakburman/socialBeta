import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  username: string="";
  password: string="";
  constructor(
    public afAuth: AngularFireAuth,
    public user: UserService,
    public router: Router,
    private authService: AuthService
    
    ) { }

  ngOnInit() {
    
  }
  
  initiateLogin(){
    const {username, password} = this;
    this.authService.login(username, password);
    this.username='';
    this.password='';
  }
  initiateGoogleLogin(){
    this.authService.doGoogleLogin();
  }
  goToRegister(){
    this.router.navigate(['/register']);
  }
  


}
