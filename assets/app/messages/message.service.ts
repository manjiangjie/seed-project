import {Message} from "./message.model";

export class MessageService {
    messsages: Message[] = [];

    addMessage(message: Message) {
        this.messsages.push(message);
        console.log(this.messsages);
    }

    getMessages() {
        return this.messsages;
    }

    deleteMessage(message: Message) {
        this.messsages.splice(this.messsages.indexOf(message), 1);
    }
}