import { InputComponent } from './input.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [InputComponent],
  imports: [ CommonModule, IonicModule ],
  exports: [InputComponent],
})
export class InputModule {}
