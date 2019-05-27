import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private settings = {
        element: {
            download: null as HTMLElement
        }
    };

    constructor() { }
    
    saveFile(arg: {fileName: string, text: string}) {
        if (!this.settings.element.download)
            this.settings.element.download = document.createElement('a');
        
        const element = this.settings.element.download;
        const fileType = 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
        element.setAttribute('download', arg.fileName);
        element.dispatchEvent(new MouseEvent('click'));
    }
}
