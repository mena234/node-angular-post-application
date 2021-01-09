import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    template: `
        <h1 mat-dialog-title>An Error Occured!</h1>
        <div mat-dialog-content>
            <p class="mat-body-1">{{data.message}}</p>
        </div>
        <button mat-button mat-dialog-close>Okay</button>
    `
})
export class ErrorComponent {
    constructor(@Inject( MAT_DIALOG_DATA ) public data: {message: string}) {}
}