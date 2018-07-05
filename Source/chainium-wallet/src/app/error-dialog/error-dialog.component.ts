import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {
  error : string;
  errorImage : string;

  private maxImages = 3;

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) 
    { 
      
      this.errorImage = `error-${Math.floor(Math.random() * this.maxImages) + 1}`;
      this.error = data;
    }

  ngOnInit() {
  }

  closeErrorDialog(): void {
    this.dialogRef.close();
  }
}
