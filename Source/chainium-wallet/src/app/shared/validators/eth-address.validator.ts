import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateEthAddress(control: AbstractControl): ValidationErrors | null {
  let NIC_REGEX_OLD = /^(0x)?[0-9a-f]{40}$/i;
  let NIC_REGEX_NEW = /^(0x)?[0-9a-f]{40}$/;
  if (control.value) {
    return NIC_REGEX_OLD.test(control.value) || NIC_REGEX_NEW.test(control.value) ? null : { notEthAddress: true };
  } else {
    return null;
  }
}
