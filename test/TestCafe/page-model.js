import { Selector } from 'testcafe';

export default class loginPage {
    constructor () {
        this.userName =  Selector('#userName');
        this.pwdField =  Selector('#password');
        this.loginButton = Selector('button');
    }
}
