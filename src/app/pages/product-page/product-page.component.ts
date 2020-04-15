import { Inject, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { rest_api } from "../../model/restapi";
import { NgxSpinnerService } from "ngx-spinner";
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DataTableDirective } from 'angular-datatables';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

var PRODUCT = 'products';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  data:any;
  isEdit = false;
  cancelClicked = false;

  private product : FormGroup;

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private apiService: ApiService, 
  private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { 
    this.product = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      stok: ['', Validators.required],
    });
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
      let products = this.storage.get(PRODUCT);
      if(!products){
        this.storage.set(PRODUCT, res)
        this.data = res;
      }else{
        this.data = products;
      }
      this.dtTrigger.next();
      this.spinner.hide();
    });
  }

  getData(){
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.apiService.get(rest_api.product).subscribe((val: any)=>{
        resolve(val.product)
      }, (err) => {
        alert('error')
        this.spinner.hide();
        reject(err)
      });
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

  edit(data){
    this.isEdit = true;
    this.product.setValue({id:data.id, name: data.name, stok: data.stok});
  }

  add(){
    this.isEdit = true;
    this.product.setValue({id:'', name: '', stok: ''});
  }

  back() {
    this.isEdit = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
     dtInstance.destroy();
     this.getData().then((res)=> {
        let products = this.storage.get(PRODUCT);
        if(!products){
          this.storage.set(PRODUCT, res)
          this.data = res;
        }else{
          this.data = products;
        }
        this.dtTrigger.next();
        this.spinner.hide();
      });
    });
  }

  save(){
    let dataexec = this.storage.get(PRODUCT);
    if(this.product.controls.id.value!=''){
      var th = new Promise((resolve, reject) => {
        dataexec.forEach((e,i,array) => {
          if(e.id==this.product.controls.id.value){
            dataexec[i].name = this.product.controls.name.value;
            dataexec[i].stok = this.product.controls.stok.value;
          }
          if (i === array.length -1) resolve();
        });
      });

      th.then(() => {
        this.storage.remove(PRODUCT)
        this.storage.set(PRODUCT, dataexec);
        this.back();
      });
    }else{
      let maxId = Math.max.apply(Math, dataexec.map(function(o) { return o.id; }))
      let addData = {
        'id': maxId+1,
        'name': this.product.controls.name.value,
        'stok': this.product.controls.stok.value,
        'img': 'https://picsum.photos/200/300?grayscale'
      }

      dataexec.push(addData);
      this.storage.remove(PRODUCT)
      this.storage.set(PRODUCT, dataexec);
      this.back();
    }
    
  }

  delete(data){
    let storage = this.storage.get(PRODUCT)
    let items = storage.find(e => parseInt(e.id) === parseInt(data.id));
    storage.splice(storage.indexOf(items), 1);

    this.storage.remove(PRODUCT)
    this.storage.set(PRODUCT, storage);
    this.back();
  }
   

}
