import {Message} from "./message.model";
import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class MessageService {
    messsages: Message[] = [];

    constructor(private http: Http) {}

    addMessage(message: Message) {
        this.messsages.push(message);
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/message', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((err: Response) => Observable.throw(err.json()));
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message').map((response: Response) => {
            const messages = response.json().obj;
            let transformedMessages: Message[] = [];
            for (let message of messages) {
                transformedMessages.push(new Message(message.content, 'Dummy', message.id, null));
            }
            this.messsages = transformedMessages;
            return transformedMessages;
        }).catch((err: Response) => Observable.throw(err.json()));
    }

    editMessage(message: Message) {

    }

    deleteMessage(message: Message) {
        this.messsages.splice(this.messsages.indexOf(message), 1);
    }
}