import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rgFormat'
})
export class RgFormatPipe implements PipeTransform {
  transform(rg: string): string {
    if (rg && rg.length >= 8) {
      return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }
    return rg; 
  }
}
