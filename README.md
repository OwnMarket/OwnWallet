# [![own-explorer-logo](https://github.com/OwnMarket/OwnBlockchainExplorerFrontend/blob/master/Source/src/assets/images/logo.png?raw=true)](https://wallet.weown.com) <span style="float:right">Wallet</span>

Wallet frontend application for WeOwn public blockchain node, powered by [Angular](https://angular.io) framework.

## Quick Start

#### Clone the repository:

```bash
git clone https://github.com/OwnMarket/OwnWallet.git
cd OwnWallet/Source/chainium-wallet
```

### Install packages

```bash
npm ci
```

### Serve App localy

```bash
ng serve
```

### Build for production

You have to use **build.sh** script to build wallet frontend for production.

```bash
./build.sh
```

Script will run ng --prod build and gulp inline script which will bundle all js files into one html file **index.html** and place it into ./dist/single-file-wallet/ directory.

### Possible build issues

#### Missing python2

You need to have python2 installed to complete build process successfuly. In linux it's easy to install it.

```bash
sudo apt-get install python2
```

#### gulp: command not found

If script fails to find and run gulp you need to install **gulp-cli** package globaly.

```bash
npm install -g gulp-cli
```

Now gulp command should be available.

### Notes

#### Web3

To avoid missing crypto package build issues with Angular and web3 package application is using custom builders **@angular-builders/custom-webpack** for production builds and **@angular-builders/dev-server** for development server.

Builder is using custom webpack.config.js file.
