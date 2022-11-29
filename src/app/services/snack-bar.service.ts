import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {

   }

   public showSnackBar(message: string, action: string = "X")
   {
      this.snackBar.open(message,action,{duration: 5000})
   }
}
