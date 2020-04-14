import { Inject,Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {

  dataProduct:any;
  dataOrder:any;
  
  columns = ['Produk', 'Stok', { role: 'annotation' }];
  type='LineChart';
  myOptions = {
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
    is3D: true
  };

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, 
  private apiService: ApiService, private spinner: NgxSpinnerService) { 

    this.getData().then((res:any) => {
      
      var wait = new Promise((resolve, reject) => {
        this.dataProduct = Object.keys(res.product).map(function(index){
          let produk = res.product[index];
          delete produk.id
          produk = [produk.name,parseInt(produk.stok),produk.stok];
          return produk;
        });
        this.dataOrder = Object.keys(res.order).map(function(index){
          let order = res.order[index];
          delete order.id;
          delete order.date;
          order = [order.name,parseInt(order.stok),order.stok];
          return order;
        });
        resolve()
      })

      wait.then(() => {
        this.spinner.hide();
      });

    });

  }

  ngOnInit() {
    
  }

  getData(){
    this.spinner.show();
    return new Promise((resolve, reject) => {
      let data = {
        'product': this.storage.get('products'),
        'order': this.storage.get('order')
      }
      resolve(data)
    });
  }

  ngOnDestroy(){
   
  }

  

}
