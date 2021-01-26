import { formatCurrency } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-swap-chx",
  templateUrl: "./swap-chx.component.html",
  styleUrls: ["./swap-chx.component.css"],
})
export class SwapChxComponent implements OnInit {
  acceptSwapForm: FormGroup;
  swapForm: FormGroup;

  risksAccepted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.acceptSwapForm = this.fb.group({
      aware: [false, [Validators.requiredTrue]],
      confirm: [false, [Validators.requiredTrue]],
      agree: [false, [Validators.requiredTrue]],
    });

    this.swapForm = this.fb.group({
      fromCurrency: ["chx"],
      toCurrency: ["eth"],
      fromAmount: [0],
      toAmount: [0],
    });

    this.swapForm.valueChanges.subscribe((value) => {
      if (value.fromCurrency === value.toCurrency) {
        if (value.fromCurrency === "eth") {
          this.swapForm.get("toCurrency").setValue("chx");
        } else {
          this.swapForm.get("toCurrency").setValue("eth");
        }
      }
    });
  }

  swapBlockchains() {
    if (this.swapForm.get("fromCurrency").value === "eth") {
      this.swapForm.get("fromCurrency").setValue("chx");
    } else {
      this.swapForm.get("fromCurrency").setValue("eth");
    }
  }

  acceptRisks() {
    this.risksAccepted = true;
  }
}
