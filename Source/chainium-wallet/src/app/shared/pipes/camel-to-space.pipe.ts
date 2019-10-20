import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToSpace'
})
export class CamelToSpacePipe implements PipeTransform {
  transform(value: any, args: any[] = null): string {
    if (typeof value !== 'string') {
      return value;
    }
    return value.split(/(?=[A-Z])/).join(' ');
  }
}
