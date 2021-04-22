import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { testConfig } from '../configurations/test.config';
import { prodConfig } from '../configurations/prod.config';

@Injectable()
export class ConfigurationService {
  get config() {
    const config = environment.networkCode.toString() == 'OWN_PUBLIC_BLOCKCHAIN_TESTNET' ? testConfig : prodConfig;
    return config;
  }
}
