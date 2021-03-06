import { Component } from "@angular/core";
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { EmailValidator } from "../../validators/email";
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }
  
  public signupForm: FormGroup;
  public loading: Loading;
  
  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder
  ) {
    this.signupForm = formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ],
      firstName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
       ],
      lastName:[
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
      ]
    });
  }

  signupUser(): void {
    if (!this.signupForm.valid) {
      console.log(
       `Need to complete the form, current value: ${this.signupForm.value}`
      );
    } else {
      const email: string = this.signupForm.value.email;
      const password: string = this.signupForm.value.password;
      const firstName: string = this.signupForm.value.firstName;
      const lastName: string = this.signupForm.value.lastName;
      this.authProvider.signupUser(email, password, firstName, lastName).then(
        user => {
          this.loading.dismiss().then(() => {
          this.navCtrl.setRoot(MainPage);
        });
      },
      error => {
        this.loading.dismiss().then(() => {
          const alert: Alert = this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: "Ok", role: "cancel" }]
          });
          alert.present();
        });
      }
    );
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    }
  }
}

