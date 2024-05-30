import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(){
        // Get the user from the local storage
        const user = localStorage.getItem('user');

        if ( user )
        {
            // Set the user
            this._user.next(JSON.parse(user));
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        localStorage.setItem('user', JSON.stringify(value));
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }
}
