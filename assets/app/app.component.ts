import { Component } from '@angular/core';
import {MessageService} from "./messages/message.service";
import {AuthService} from "./auth/auth.service";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [MessageService]
})
export class AppComponent {

}