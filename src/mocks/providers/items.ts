import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Item } from '../../models/item';

@Injectable()
export class Items {
  items: Item[] = [];

  defaultItem: any = {
    "name": "Moving sofa",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "64 nanyang crescent"
  };


  constructor(public http: Http) {
    let items = [
      {
        "name": "Moving sofa",
        "profilePic": "assets/img/speakers/bear.jpg",
        "about": "64 nanyang crescent"
      },
      {
        "name": "Cleaning bedroom",
        "profilePic": "assets/img/speakers/cheetah.jpg",
        "about": "64 nanyang crescent"
      },
      {
        "name": "Professional photographer needed",
        "profilePic": "assets/img/speakers/duck.jpg",
        "about": "64 nanyang crescent"
      },
      {
        "name": "Assemble bed",
        "profilePic": "assets/img/speakers/eagle.jpg",
        "about": "64 nanyang crescent"
      },
      {
        "name": "Marketing job",
        "profilePic": "assets/img/speakers/elephant.jpg",
        "about": "64 nanyang crescent"
      },
      {
        "name": "Pick up and deliver fridge",
        "profilePic": "assets/img/speakers/mouse.jpg",
        "about": "64 nanyang crescent"
      },
      {
        "name": "Lawn mowing",
        "profilePic": "assets/img/speakers/puppy.jpg",
        "about": "64 nanyang crescent"
      }
    ];

    for (let item of items) {
      this.items.push(new Item(item));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}
