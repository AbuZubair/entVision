import { Inject, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Select2OptionData } from 'ng-select2';
import { NgxSpinnerService } from "ngx-spinner";
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DataTableDirective } from 'angular-datatables';

var PRODUCT = 'products';
var ORDER = 'order';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  data:any;

  public productsData: Array<Select2OptionData>;

  selected:any;
  stok:any;
  storageData:any;

  isEdit = false;

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private spinner: NgxSpinnerService) {
    
  }

  ngOnInit() {

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      deferRender: true,
      lengthMenu: [
       [10, 25, 50, -1],
       [10, 25, 50, "All"]
      ],
      retrieve: true,
      responsive: true
    };

    this.getData().then((res)=> {
      this.data = res;
      this.dtTrigger.next();
      this.spinner.hide();
    });
    
  }

  getData(){
    this.spinner.show();
    return new Promise((resolve, reject) => {
      resolve(this.storage.get(ORDER))
    });
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  add(){
    this.isEdit = true;
    this.selected = '';

    this.storageData = this.storage.get(PRODUCT);
    var i;
    for(i = 0; i < this.storageData.length; i++){
        let name = this.storageData[i]['name']
        this.storageData[i].id = name;
        this.storageData[i].text = name;
        delete this.storageData[i].name;
        delete this.storageData[i].stok;
    }
    this.productsData = this.storageData;

  }

  save(){
    if(!this.selected){
      alert('Silahkan pilih Produk')
      return false;
    }

    if(!this.stok || this.stok==0){
      alert('Silahkan Isi stok')
      return false;
    }

    
    let order = [];
    let products;
    products = this.storage.get(PRODUCT)

    var checkStok = new Promise((resolve, reject) => {
      products.forEach((element,i) => {
        if(element.name==this.selected){
          if(parseInt(products[i].stok) < parseInt(this.stok)){
            resolve(false);
          }else{
            resolve(true);
          }
        }
      });
    });

    checkStok.then((val) => {
      if(!val){
        alert('Stok tidak cukup');
        return false;
      }else{

        /*Save order*/
        if(this.storage.get(ORDER)){
          order = this.storage.get(ORDER);
          let maxId = Math.max.apply(Math, order.map(function(o) { return o.id; }))
          let addData = {
            'id': maxId+1,
            'name': this.selected,
            'stok': this.stok,
            'date':Date.now()
          }

          order.push(addData);
        }else{
          order.push({
            'id': 1,
            'name': this.selected,
            'stok': this.stok,
            'date':Date.now()
          })
        }
        this.storage.remove(ORDER)
        this.storage.set(ORDER, order);


        /*Update stok*/
        var wait = new Promise((resolve, reject) => {
          products.forEach((e,i,array) => {
            if(e.name==this.selected){
              products[i].stok = products[i].stok - this.stok;
            }
            if (i === array.length -1) resolve();
          });
        });

        wait.then(() => {
          this.storage.remove(PRODUCT)
          this.storage.set(PRODUCT, products);
          this.back();
        });

      }
    });
    
  }

  back() {
    this.isEdit = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
     dtInstance.destroy();
     this.getData().then((res)=> {
        this.data = res;
        this.dtTrigger.next();
        this.spinner.hide();
      });
    })
  }
  

}
