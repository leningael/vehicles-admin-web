import {
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationCode } from './interfaces/invitation-codes.interfaces';
import { InvitationCodesService } from './services/invitation-codes.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { FormValidatorsService } from 'app/shared/services/form-validators.service';

@Component({
    selector: 'app-invitation-codes',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './invitation-codes.component.html',
    styleUrl: './invitation-codes.component.scss',
})
export default class InvitationCodesComponent implements OnInit {
    private _invitationCodesService = inject(InvitationCodesService);
    private _toastr = inject(ToastrService);
    private _formBuilder = inject(UntypedFormBuilder);
    private _formValidators = inject(FormValidatorsService);

    invitationCodes: InvitationCode[] = [];
    invitationsForm: UntypedFormGroup = this._formBuilder.group({
        invitations: this._formBuilder.array([]),
    });

    get invitationsArrayCtrl() {
        return this.invitationsForm.get('invitations') as UntypedFormArray;
    }

    ngOnInit(): void {
        this._invitationCodesService.getInvitationCodes().subscribe({
            next: (invitationCodes: InvitationCode[]) => {
                this.invitationCodes = invitationCodes;
                this.createInvitationsCtrls();
            },
            error: () => {
                this._toastr.error('Error fetching invitation codes');
            },
        });
    }

    createInvitationsCtrls() {
        this.invitationCodes.forEach((invitationCode) => {
            this.invitationsArrayCtrl.push(
                this._formBuilder.control(invitationCode.email, [
                    Validators.required,
                    Validators.pattern(this._formValidators.emailPattern),
                ])
            );
        });
        console.log(this.invitationsArrayCtrl);
    }

    addNewInvitation() {
        this.invitationsArrayCtrl.insert(
            0,
            this._formBuilder.control('', [
                Validators.required,
                Validators.pattern(this._formValidators.emailPattern),
            ])
        );
        this.invitationCodes.unshift({ code: null, email: '' });
    }

    deleteInvitation(index: number) {
        const code = this.invitationCodes[index].code;
        if (!code) {
            this.removeLocalInvitation(index);
            return;
        }
        this._invitationCodesService.deleteInvitationCode(code).subscribe({
            next: () => {
                this.removeLocalInvitation(index);
            },
            error: (response) => {
                const detail = response.error && response.error.detail;
                this._toastr.error(detail || 'Error deleting invitation code');
            },
        });
    }

    removeLocalInvitation(index: number) {
        this.invitationsArrayCtrl.removeAt(index);
        this.invitationCodes.splice(index, 1);
    }

    shoulSaveBeDisabled(index: number) {
      const emailCtrl = this.invitationsArrayCtrl.at(index);
        return emailCtrl.invalid || (this.invitationCodes[index].email === emailCtrl.value)
    }

    saveInvitation(index: number) {
        const emailCtrl = this.invitationsArrayCtrl.at(index);
        const invitation = this.invitationCodes[index];
        if (emailCtrl.invalid) {
            return;
        }
        if (invitation.code) {
            this.requestInvitationUpdate(index, emailCtrl.value);
        } else {
            this.requestInvitationCreation(index, emailCtrl.value);
        }
    }

    requestInvitationCreation(index: number, email: string) {
        this._invitationCodesService.createInvitationCode(email).subscribe({
            next: (invitationCode: InvitationCode) => {
                this.invitationCodes[index] = invitationCode;
            },
            error: (response) => {
                const detail = response.error && response.error.detail;
                this._toastr.error(detail || 'Error creating invitation code');
            },
        });
    }

    requestInvitationUpdate(index: number, email: string) {
        this._invitationCodesService
            .changeInvitationEmail(this.invitationCodes[index].code, email)
            .subscribe({
                next: (invitationCode: InvitationCode) => {
                    this.invitationCodes[index] = invitationCode;
                },
                error: (response) => {
                    const detail = response.error && response.error.detail;
                    this._toastr.error(
                        detail || 'Error updating invitation code'
                    );
                },
            });
    }
}
