import { Injectable, signal } from '@angular/core';

export interface ErrorDialogData {
  title?: string;
  message: string;
  code?: string | number;
}

@Injectable({ providedIn: 'root' })
export class ErrorDialogService {
  private _dialog = signal<ErrorDialogData | null>(null);

  readonly dialog = this._dialog.asReadonly();

  show(data: ErrorDialogData | string) {
    if (typeof data === 'string') {
      this._dialog.set({ message: data });
    } else {
      this._dialog.set(data);
    }
  }

  close() {
    this._dialog.set(null);
  }
}
