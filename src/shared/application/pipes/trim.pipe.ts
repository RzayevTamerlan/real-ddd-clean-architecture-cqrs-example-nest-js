import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata) {
    return this.trimValues(value);
  }

  private trimValues(value: any): any {
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((key) => {
        value[key] = this.trimValues(value[key]);
      });
      return value;
    }
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }
}
