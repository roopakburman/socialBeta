import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AdMob } from '@ionic-native/admob-plus/ngx';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private admob: AdMob
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      //ANDROID
      // this.admob.banner.show({id: 'ca-app-pub-9658667839326477/8188945355'});
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();

    });
  }
}
