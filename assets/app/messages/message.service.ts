import {Message} from "./message.model";
import {EventEmitter, Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";

@Injectable()
export class MessageService {
    messsages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http) {}

    addMessage(message: Message) {

        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/message', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(result.obj.content, 'Dummy', result.obj._id, null);
                this.messsages.push(message);
                return message;
            })
            .catch((err: Response) => Observable.throw(err.json()));
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message').map((response: Response) => {
            const messages = response.json().obj;
            let transformedMessages: Message[] = [];
            for (let message of messages) {
                transformedMessages.push(new Message(message.content, 'Dummy', message._id, null));
            }
            this.messsages = transformedMessages;
            return transformedMessages;
        }).catch((err: Response) => Observable.throw(err.json()));
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        this.messsages.push(message);
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.patch('http://localhost:3000/message/' + message.messageId, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteMessage(message: Message) {
        this.messsages.splice(this.messsages.indexOf(message), 1);
        return this.http.delete('http://localhost:3000/message/' + message.messageId)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}