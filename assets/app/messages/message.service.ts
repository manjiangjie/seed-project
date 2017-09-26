import {Message} from "./message.model";
import {EventEmitter, Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {ErrorService} from "../errors/error.service";

@Injectable()
export class MessageService {
    messsages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService: ErrorService) {}

    addMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.post('http://localhost:3000/message' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(result.obj.content, result.username, result.obj._id, result.obj.user);
                this.messsages.push(message);
                return message;
            }).catch((err: Response) => {
                this.errorService.handleError(err.json());
                return Observable.throw(err.json());
            });
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message').map((response: Response) => {
            const messages = response.json().obj;
            let transformedMessages: Message[] = [];
            for (let message of messages) {
                transformedMessages.push(new Message(message.content, message.user.firstName, message._id, message.user._id));
            }
            this.messsages = transformedMessages;
            return transformedMessages;
        }).catch((err: Response) => {
            this.errorService.handleError(err.json());
            return Observable.throw(err.json());
        });
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        this.messsages.push(message);
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.patch('http://localhost:3000/message/' + message.messageId + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((err: Response) => {
                this.errorService.handleError(err.json());
                return Observable.throw(err.json());
            });;
    }

    deleteMessage(message: Message) {
        this.messsages.splice(this.messsages.indexOf(message), 1);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.delete('http://localhost:3000/message/' + message.messageId + token)
            .map((response: Response) => response.json())
            .catch((err: Response) => {
                this.errorService.handleError(err.json());
                return Observable.throw(err.json());
            });;
    }
}