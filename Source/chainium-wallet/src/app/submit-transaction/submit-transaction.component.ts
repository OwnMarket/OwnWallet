import { Component, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material';

import { Tx, ChxTransfer, TxAction, TxEnvelope, DelegateStake, ConfigureValidator, CreateAssetEmission, SetAssetCode, SetAssetController, SetAccountController, SubmitVote, SubmitVoteWeight, RemoveValidator, CreateAsset, CreateAccount, AssetTransfer } from '../models/submit-transactions.model'
import { PrivatekeyService } from '../services/privatekey.service';
import { NodeService } from '../services/node.service';
import { CryptoService } from '../services/crypto.service';
import { ActionRemoval } from '../services/ActionRemovalService';
import { SubmitTransactionInfoComponent } from '../submit-transaction-info/submit-transaction-info.component';
import { MatDialog } from '@angular/material';

interface ActionOption {
    value: string;
    viewValue: string;
    onSelected(): TxAction;
}

@Component({
    selector: 'app-submit-transaction',
    templateUrl: './submit-transaction.component.html',
    styleUrls: ['./submit-transaction.component.css']
})
export class SubmitTransactionComponent implements OnInit {
    tx: Tx;
    displayActions = false;
    availableActions: ActionOption[] =
        [
            {
                value: 'TransferChx',
                viewValue: 'Transfer CHX',
                onSelected() {
                    let action = new TxAction();
                    action.actionType = 'TransferChx';
                    action.actionData = new ChxTransfer();
                    return action;
                }
            },
            {
                value: 'DelegateStake',
                viewValue: 'Delegate Stake',
                onSelected() {
                    let action = new TxAction();
                    action.actionType = 'DelegateStake';
                    action.actionData = new DelegateStake();
                    return action;
                }
            },
            {
                value: 'ConfigureValidator',
                viewValue: 'Configure Validator',
                onSelected() {
                    let action = new TxAction();
                    action.actionType = 'ConfigureValidator';
                    action.actionData = new ConfigureValidator();
                    return action;
                }
            },
            {
                value: 'RemoveValidator',
                viewValue: 'Remove Validator',
                onSelected() {
                    let action = new TxAction();
                    action.actionType = 'RemoveValidator';
                    action.actionData = new RemoveValidator();
                    return action;
                }
            },
            {
                value: 'TransferAsset',
                viewValue: 'Transfer Asset',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'TransferAsset';
                    action.actionData = new AssetTransfer();
                    return action;
                }
            },
            {
                value: 'CreateAssetEmission',
                viewValue: 'Create Asset Emission',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'CreateAssetEmission';
                    action.actionData = new CreateAssetEmission();
                    return action;
                }
            },
            {
                value: 'CreateAsset',
                viewValue: 'Create Asset',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'CreateAsset';
                    action.actionData = new CreateAsset();
                    return action;
                }
            },
            {
                value: 'SetAssetCode',
                viewValue: 'Set Asset Code',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'SetAssetCode';
                    action.actionData = new SetAssetCode();
                    return action;
                }
            },
            {
                value: 'SetAssetController',
                viewValue: 'Set Asset Controller',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'SetAssetController';
                    action.actionData = new SetAssetController();
                    return action;
                }
            },
            {
                value: 'SetAccountController',
                viewValue: 'Set Account Controller',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'SetAccountController';
                    action.actionData = new SetAccountController();
                    return action;
                }
            },
            {
                value: 'CreateAccount',
                viewValue: 'Create Account',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'CreateAccount';
                    action.actionData = new CreateAccount();
                    return action;
                }
            },
            {
                value: 'SubmitVote',
                viewValue: 'Submit Vote',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'SubmitVote';
                    action.actionData = new SubmitVote();
                    return action;
                }
            },
            {
                value: 'SubmitVoteWeight',
                viewValue: 'Submit Vote Weight',
                onSelected() {
                    const action = new TxAction();
                    action.actionType = 'SubmitVoteWeight';
                    action.actionData = new SubmitVoteWeight();
                    return action;
                }
            }
        ]

    removalService: ActionRemoval;
    isKeyImported: boolean;

    constructor(private nodeService: NodeService,
        private privateKeyService: PrivatekeyService,
        private cryptoService: CryptoService,
        public dialog: MatDialog) {
            this.isKeyImported = privateKeyService.existsKey();
            if (!this.isKeyImported) 
                return;        

            this.nodeService.getAddressInfo(this.privateKeyService.getWalletInfo().address)
                .subscribe(balInfo => {
                    this.tx = new Tx();
                    this.tx.nonce = balInfo.nonce + 1;
                    this.tx.actionFee = this.nodeService.getMinFee();
                    this.tx.actions = new Array<TxAction>();
                    this.removalService = {
                        tx: this.tx,
                        removeAction: this.removeTxAction
                    };
                });
    }

    setAvailableActions(): ActionOption[] {
        let availableActions: ActionOption[] = [];
        let availableActions2 = [new ChxTransfer(), new DelegateStake()];
        for (var action in availableActions2) {

        }
        return availableActions;
    }

    validateTransaction(txAction: TxAction): boolean {
        if (!txAction || !txAction.actionData) {
            if (txAction.actionType != 'RemoveValidator'
                && txAction.actionType != 'CreateAsset'
                && txAction.actionType != 'CreateAccount') {
                    return false;
            }
        }
        return this.validateActionData(txAction.actionData);
    }

    validateActionData(actionData: object): boolean {
        for (let [key, value] of Object.entries(actionData)) {
            if (value == null || typeof (value) == 'undefined')
                return false;
        
            if (typeof (value) == 'number') {
                if (value <= 0) return false;
                
            }
            else if (typeof (value) == 'string') {
                if (value.length == 0) return false;        
            }
        }
        return true;
    }

    onActionSelected(event: MatOptionSelectionChange, action: any) {
        if (event.source.selected) {
            let selected = this.availableActions.find(a => a.value == action.value);
            if (!selected) 
                return;
            
            if (!this.tx.actions)
                this.tx.actions = new Array<TxAction>();
        
            let newAction = selected.onSelected();
            this.tx.actions.push(newAction);
            this.displayActions = this.tx.actions ? true : false;
        }
    }

    removeTxAction(txAction: object) {
        if (!this.tx.actions)
            return;
    
        let idxToRemove = this.tx.actions.findIndex(a => a.actionData === txAction);
        if (idxToRemove < 0)
            return;
        
        this.tx.actions.splice(idxToRemove, 1);
    }

    ngOnInit() {}

    public numOfValidActions(): number {
        if (!this.tx.actions)
            return 0;
        
        let valids = this.tx.actions.filter(ac => this.validateTransaction(ac));
        return valids.length;
    }

    private txEnvelope: TxEnvelope;
    openSubmissionDialog(): void {
        let txToSign = new Tx();
        txToSign.senderAddress = this.privateKeyService.getWalletInfo().address;
        txToSign.nonce = this.tx.nonce;
        txToSign.actionFee = this.tx.actionFee;
        txToSign.actions = this.tx.actions.filter(a => this.validateTransaction(a));
        this.cryptoService.signTransaction(this.privateKeyService.getWalletInfo().privateKey, txToSign)
            .subscribe(env => this.loadSignedData(env));
    }

    private loadSignedData(env: TxEnvelope) {
        this.txEnvelope = env
        let dialogRef = this.dialog.open(SubmitTransactionInfoComponent, {
            width: '50%',
            data: this.txEnvelope
        });
    }

    totalFee(): number {
        return this.numOfValidActions() * this.tx.actionFee;
    }
}
