import { ErrorComponent } from './error/error.component';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private matDialog: MatDialog) {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'An unknow error message occured!'
        if (err.error.message) {
          errorMessage = err.error.message;
        }
        this.matDialog.open(ErrorComponent, { data: {
          message: errorMessage
        }});
        return throwError(err);
      })
    )
  }
}
