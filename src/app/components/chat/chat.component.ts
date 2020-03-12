import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  menssage = '';
  screenElement: any;
  constructor(public chatService: ChatService) {
    this.chatService.loadMessages().subscribe(() => {
      setTimeout(() => {
        this.screenElement.scrollTop = this.screenElement.scrollHeight;
      }, 20);
    });
  }

  ngOnInit(): void {
    this.screenElement = document.getElementById('app.mensajes');
  }

  sendMessage() {
    console.log(this.menssage);
    if (this.menssage.length === 0) {
      return;
    }
    this.chatService.addMessageToFirebase(this.menssage)
                    .then( () => this.menssage = '')
                    .catch((err) => console.error('Error al enviar', err));

  }

}
