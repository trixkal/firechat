import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Message } from '../interface/message.interface';


import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Message[] = [];
  public user: any = {};
  private itemsCollection: AngularFirestoreCollection<Message>;
  constructor(private firestore: AngularFirestore, public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(userStateFunct => {
      console.log('estado del usuario:', userStateFunct);

      if (!userStateFunct) {
        return;
      }

      this.user.name = userStateFunct.displayName;
      this.user.uid = userStateFunct.uid;
    });
  }

  login(account: string) {
    if (account === 'Google') {
      this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
    } else {
      this.afAuth.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }
  logout() {
    this.user = {};
    this.afAuth.signOut();
  }

  loadMessages() {
    this.itemsCollection = this.firestore.collection<Message>('chats', ref =>
                                                                        ref.orderBy('date', 'desc').limit(5));

    return this.itemsCollection.valueChanges().pipe(
                                map( (messages: Message[]) => {
                                  console.log(messages);
                                  this.chats = [];
                                  for (const message of messages) {
                                    this.chats.unshift(message);
                                  }

                                  //this.chats = messages;
                                }));
  }

  addMessageToFirebase(text: string) {
    const message: Message = {
      name: this.user.name,
      message: text,
      date: new Date().getTime(),
      uid: this.user.uid
    };

    return this.itemsCollection.add(message);
  }
}
