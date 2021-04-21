import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { testConfig } from '../configurations/test.config';
import { prodConfig } from '../configurations/prod.config';

@Injectable()
export class ConfigurationService {
  get config() {
    const config = environment.networkCode === 'OWN_PUBLIC_BLOCKCHAIN_MAINNET' ? prodConfig : testConfig;
    console.log('is equal', environment.networkCode === 'OWN_PUBLIC_BLOCKCHAIN_MAINNET');
    console.log('chainId', config['bsc'].chainId);
    return config;
  }
}
