import { Inject, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { NgxSpinnerService } from "ngx-spinner";
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DataTableDirective } from 'angular-datatables';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

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

  storageData:any;

  isEdit = false;
  isGallery = false;

  orderForm: FormGroup;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private spinner: NgxSpinnerService,
  private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      orderNumber:[],
      description:[],
      items: this.fb.array([this.fb.group({product:'',stok:''})])
    })
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

    this.galleryOptions = [
      { image: false, height: "100px" },
      { breakpoint: 500, width: "100%" }
    ];

    this.getData().then((res)=> {
      this.data = res;
      this.dtTrigger.next();
      this.spinner.hide();
    });
    
  }

  getData(){
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.storageData = this.storage.get(PRODUCT);
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
    this.isGallery = false;
    this.items.clear();
    this.addItem();
    this.orderForm.setValue({orderNumber:'', description: '', items:[{product:'',stok:''}]});
    let temp = this.storageData.filter(e=>parseInt(e.stok) > 0)
    var i;
    for(i = 0; i < temp.length; i++){
        let name = temp[i]['name']
        temp[i].text = name;
        delete temp[i].name;
        delete temp[i].stok;
    }
    this.productsData = temp;

  }

  view(data){
    this.isEdit = true;
    this.isGallery = true;
    for (let index = 1; index < data.item.length; index++) {
      this.items.push(this.fb.group({product:'',stok:''}));
    }
    this.orderForm.setValue({orderNumber:data.orderNumber, description: data.description, items:data.item});
    this.orderForm.disable();

    let arrData = [];

    data.item.forEach(element => {
      let find = this.storageData.find(e => element.product==e.id)
      arrData.push({
        small: find.img,
        medium: find.img,
        big: find.img
      })
    });

    this.galleryImages = arrData;
  }

  save(){
    
    let items = this.orderForm.value
       
    if( items.length==1 && items[0].product=='' ){
      alert('Silahkan pilih Produk')
      return false;
    }
    
    let order = [];
    let products;
    products = this.storage.get(PRODUCT)

    var checkStok = new Promise((resolve, reject) => {
      let valid = {status:true,product:''}
      
      items.items.forEach((element, index, array) => {
        let find = products.find(e => e.id == element.product);
        if(parseInt(find.stok) < parseInt(element.stok)){
          valid.status = false
          valid.product = element.product
        }
        if (index === array.length -1) resolve(valid);
      });     

    });

    checkStok.then((val:any) => {
      if(!val.status){
        alert('Stok '+val.product+' tidak cukup');
        return false;
      }else{

        /*Save order*/
        if(this.storage.get(ORDER)){
          order = this.storage.get(ORDER);
          let initialValue = 0;
          let sum = items.items.reduce(function (total, currentValue) {
              return total + parseInt(currentValue.stok);
          }, initialValue);
          let addData = {
            'orderNumber': items.orderNumber,
            'description': items.description,
            'item': items.items,
            'total': sum,
            'date':Date.now()
          }

          order.push(addData);
        }else{
          let initialValue = 0;
          let sum = items.items.reduce(function (total, currentValue) {
              return total + parseInt(currentValue.stok);
          }, initialValue);
          
          order.push({
            'orderNumber': items.orderNumber,
            'description': items.description,
            'item': items.items,
            'total': sum,
            'date':Date.now()
          })
        }
        this.storage.remove(ORDER)
        this.storage.set(ORDER, order);


        /*Update stok*/
        var wait = new Promise((resolve, reject) => {

          items.items.forEach((e,i,array) => {
            let find = products.find(el => el.id == e.product);
            let index = products.indexOf(find);
            products[index].stok = parseInt(products[i].stok) - parseInt(e.stok)
            if (i === array.length -1) resolve();
          });

        });

        wait.then(() => {
          this.storage.remove(PRODUCT)
          this.storage.set(PRODUCT, products);
          this.items.clear();
          this.addItem();
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

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.fb.group({product:'',stok:''}));
  }

  deleteItem(index) {
    this.items.removeAt(index);
  }
  

}
