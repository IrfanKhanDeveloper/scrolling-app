import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Item {
  itemName: string;
  itemPrice: number;
  url: string;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  dataSource: Observable<Item[]> | null = null;
  itemRows: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems(): void {
    const apiUrl = 'https://db.ezobooks.in/kappa/image/task';
    this.http.get<{ status: string, items: Item[] }>(apiUrl)
      .subscribe(data => {
        this.items = data.items;
        this.itemRows = this.chunkArray(this.items, 2); 
        this.dataSource = this.createObservable();
      });
  }
  chunkArray(arr: any[], chunkSize: number): any[] {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }

  createObservable(): Observable<Item[]> {
    return new Observable<Item[]>(observer => {
      observer.next(this.items);
      observer.complete();
    });
  }

  
}
