/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import { ToastController, AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  link = 'https://reqres.in/api/users?page=0&per_page=12';
  users: User[] = [];
  defaultImage = '../../assets/profile.png';

  constructor(private http: HttpClient, private toastController: ToastController, private alertController: AlertController) {
    http.get(this.link).subscribe(data => {
      this.users = data['data'];
    });
  }

  async Add() {
    const alert = await this.alertController.create({
      header: 'Add New User',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          placeholder: 'First Name'
        },
        {
          name: 'last_name',
          type: 'text',
          placeholder: 'Last Name'
        },
        {
          name: 'email',
          type: 'text',
          placeholder: 'Email'
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: (data) => {
            this.users.unshift(data);
            this.http.post(this.link, data).subscribe(res => {
              this.presentToast('New User added.', 'success');
            }, error => {
              this.users.splice(0, 1);
              this.presentToast('User not added.', 'warning');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async Delete(id) {
    const name = this.users[id].first_name + ' ' + this.users[id].last_name + ' is deleted.';
    this.users.splice(id, 1);
    this.presentToast(name, 'danger');
  }

  async Update(i) {
    const alert = await this.alertController.create({
      header: 'Update User',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          value: this.users[i].first_name,
          placeholder: 'First Name'
        },
        {
          name: 'last_name',
          type: 'text',
          value: this.users[i].last_name,
          placeholder: 'Last Name'
        },
        {
          name: 'email',
          type: 'text',
          value: this.users[i].email,
          placeholder: 'Email'
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Update',
          handler: (data) => {
            const name = this.users[i].first_name + ' ' + this.users[i].last_name + ' is updated.';
            this.users[i].first_name = data.first_name;
            this.users[i].last_name = data.last_name;
            this.users[i].email = data.email;
            console.log(this.users[i]);
            this.presentToast(name, 'success');
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      color
    });
    toast.present();
  }
}
