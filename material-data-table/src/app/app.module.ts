import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { ClientComponent } from './client/client.component';
import { DoctorComponent } from './doctor/doctor.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomerService } from './services/customer.service';  

const appRoutes: Routes = [
  { path: 'customer', component: CustomerComponent },
  { path: 'client', component: ClientComponent },
  { path: 'doctor', component: DoctorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MyNavComponent,
    CustomerComponent,
    ClientComponent,
    DoctorComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule
  ],
  providers: [CustomerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
