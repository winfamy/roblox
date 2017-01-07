import request from "request";

class ROBLOX {
    constructor(username, password, cookie) {
        this.username = username;
        this.password = password,
        this.cookie = cookie || '';
        this.jar = request.jar();
    }

    login() {
        request.post('https://www.roblox.com/newlogin', {
            form: {
                username: this.username,
                password: this.password,
                submitLogin: 'Log in',
                ReturnUrl: ''
            },
            jar: this.jar
        }, function(err, resp, body) {
            if(err) throw err;
        });
    }

    token() {
        return new Promise((resolve, reject) => {
           request.get('https://www.roblox.com/home', function(err, resp, body) {
               this.token = body.split('XsrfToken.setToken(\'')[1].split('\')')[0];
               resolve(this.token);
           });
        });
    }
}

module.exports = ROBLOX;