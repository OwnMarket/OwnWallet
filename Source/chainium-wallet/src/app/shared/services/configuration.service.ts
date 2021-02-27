import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { testConfig } from '../configurations/test.config';
import { prodConfig } from '../configurations/prod.config';

@Injectable()
export class ConfigurationService {
  get config() {
    return environment.networkCode === 'OWN_PUBLIC_BLOCKCHAIN_MAINNET' ? prodConfig : testConfig;
  }
}
