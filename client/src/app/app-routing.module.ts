import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PictureFiltersComponent } from './main/picture-filters/picture-filters.component';


const routes: Routes = [
  {
    path: "", component: MainComponent, children: [
      { path: "", component: PictureFiltersComponent }
    ]
  },
  { path: "**", redirectTo: "/" }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
