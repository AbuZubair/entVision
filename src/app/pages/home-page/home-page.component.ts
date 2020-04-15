import { Inject,Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { rest_api } from "../../model/restapi";
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { NgxSpinnerService } from "ngx-spinner";
import { async } from 'rxjs/internal/scheduler/async';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {

  dataProduct:any;
  dataOrder:any;

  ready = false;
  
  columnsProduct = ['Produk', 'Stok', { role: 'annotation' }];
  columnsOrder = ['Tanggal', 'Stok', { role: 'annotation' }];
  type='LineChart';
  myOptions = {
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
    is3D: true
  };

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, 
  private apiService: ApiService, private spinner: NgxSpinnerService) { 

    
  }

  ngOnInit() {
    this.spinner.show();

    this.getData().then((res:any) => {
      let dataProduk;
      let dataOrder = [];
      var wait = new Promise(async (resolve, reject) => {
        dataProduk = await Object.keys(res.product).map(function(index){
          let produk = res.product[index];
          delete produk.id
          produk = [produk.name,parseInt(produk.stok),produk.stok];
          return produk;
        });
        var result = [];
        if(res.order.length > 0){
          res.order.reduce(function(res, value) {
            if (!res[value.date]) {
              res[value.date] = { id: value.date, total: 0 };
              result.push(res[value.date])
            }
            res[value.date].total += parseInt(value.total);
            return res;
          }, {});

          dataOrder = await Object.keys(result).map(function(index){
            let order = result[index];
            order = [order.id,parseInt(order.total),order.total];
            return order;
          });
        }
        resolve([dataProduk,dataOrder])
      })

      wait.then((val) => {
        console.log(val)
        this.dataProduct = val[0];
        this.dataOrder = val[1];
        this.ready = true;
        this.spinner.hide();
      });

    });

  }

  getData(){
    return new Promise(async (resolve, reject) => {
      let order = this.storage.get('order')
      let product = this.storage.get('products')
      if(!product){
        product = await this.getProduct()
      }
      if(order){
        order.forEach(element => {
          element.date = new Date(element.date).toDateString()
        });
      }else{
        order = []
      }
      let data = {
        'product': product,
        'order': order
      }
      resolve(data)
    });
  }

  getProduct = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      this.apiService.get(rest_api.product).subscribe((val: any)=>{
        resolve(val.product)
      }, (err) => {
        alert('error')
        reject(err)
      }); 
  });
}

  ngOnDestroy(){
   
  }

  

}
