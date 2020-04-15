import { Inject, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-clear-page',
  templateUrl: './clear-page.component.html',
  styleUrls: ['./clear-page.component.css']
})
export class ClearPageComponent implements OnInit {

  cancelClicked = false;

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) { }

  ngOnInit() {
  }

  clear(){
    this.storage.clear();
    alert('Clear Data Succesfully');
    this.router.navigate(['/product']);
  }

}
