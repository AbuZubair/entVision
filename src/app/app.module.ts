import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { DataTablesModule } from 'angular-datatables';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxGalleryModule } from 'ngx-gallery';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { adminLteConf } from './layout/config';   
import { LayoutModule } from 'angular-admin-lte';   

import { ApiService } from './service/api.service';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { ClearPageComponent } from './pages/clear-page/clear-page.component';


const appRoutes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'product', component: ProductPageComponent },
  { path: 'order', component: OrderPageComponent },
  { path: 'clear', component: ClearPageComponent },
  { path: '**', 
    redirectTo: 'home',
    pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ProductPageComponent,
    OrderPageComponent,
    ClearPageComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    NgxPaginationModule,
    NgSelect2Module,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    DataTablesModule,
    LayoutModule.forRoot(adminLteConf),
    StorageServiceModule,
    ReactiveFormsModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    GoogleChartsModule.forRoot(),
    NgxGalleryModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
