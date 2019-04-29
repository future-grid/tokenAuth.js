import angular from 'angular';
import Keycloak from 'keycloak-js';
import Auth0Lock from 'auth0-lock';
import auth0 from 'auth0-js';

if (typeof angular !== 'object') {
    throw new Error('Angular1 must be loaded.');
}

if (!angular.isFunction(Auth0Lock)) {
    throw new Error('Auth0Lock must be loaded.');
}

Auth0Lock.prototype.getClient = function() {
    void 0;
};
Auth0Lock.prototype.parseHash = function() {
    void 0;
};

if (!angular.isFunction(Keycloak)) {
    throw new Error('Keycloak must be loaded.');
}

angular
    .module('fgpAuth', [])
    .provider('fgpTokenAuth', function() {
        // auth0
        this.initAuth0 = function(config) {
            if (!config) {
                // no config
                throw new Error(
                    'Parameters are required to initialize Auth0.js'
                );
            }
            this.clientID = config.clientID;
            this.domain = config.domain;
            this.options = config.options || {};
            this.authType = 'auth0';
        };

        // keycloak
        this.initKeycloak = function(config) {
            if (!config) {
                // no config
                throw new Error(
                    'Parameters are required to initialize Keycloak.js'
                );
            }

            this.options = config.options || {};

            this.options["clientId"] = config.clientID;

            this.authType = 'keycloak';
        };

        this.$get = [
            '$rootScope',
            '$location',
            function($rootScope, $location) {
                if ('auth0' === this.authType) {

                    var Lock = new Auth0Lock(
                        this.clientID,
                        this.domain,
                        this.options
                    );
                    var credentials = {
                        clientID: this.clientID,
                        domain: this.domain
                    };
                    var shouldVerifyIdToken = true;
                    if (this.options._idTokenVerification === false)
                        shouldVerifyIdToken = false;
                    var lock = {};
                    var functions = [];
                    for (var i in Lock) {
                        if (typeof Lock[i] === 'function') {
                            functions.push(i);
                        }
                    }

                    function safeApply(fn) {
                        var phase = $rootScope.$root.$$phase;
                        if (phase === '$apply' || phase === '$digest') {
                            if (fn && typeof fn === 'function') {
                                fn();
                            }
                        } else {
                            $rootScope.$apply(fn);
                        }
                    }

                    function wrapArguments(parameters) {
                        var lastIndex = parameters.length - 1,
                            func = parameters[lastIndex];
                        if (typeof func === 'function') {
                            parameters[lastIndex] = function() {
                                var args = arguments;
                                safeApply(function() {
                                    func.apply(Lock, args);
                                });
                            };
                        }
                        return parameters;
                    }

                    for (var i = 0; i < functions.length; i++) {
                        lock[functions[i]] = (function(name) {
                            var customFunction = function() {
                                return Lock[name].apply(
                                    Lock,
                                    wrapArguments(arguments)
                                );
                            };
                            return customFunction;
                        })(functions[i]);
                    }

                    lock.exit = function(param) {
                        lock.logout(param);
                        localStorage.setItem('id_token', '');
                    }

                    lock.interceptHash = function() {
                        if (typeof auth0.WebAuth !== 'function') {
                            throw new Error(
                                'Auth0.js version 8 or higher must be loaded'
                            );
                            return;
                        }

                        $rootScope.$on('$locationChangeStart', function(
                            event,
                            location
                        ) {
                            if (
                                /id_token=/.test(location) ||
                                /access_token=/.test(location) ||
                                /error=/.test(location)
                            ) {
                                var webAuth = new auth0.WebAuth(credentials);

                                var hash =
                                    $location.hash() || window.location.hash;

                                webAuth.parseHash({
                                        hash: hash,
                                        _idTokenVerification: shouldVerifyIdToken
                                    },
                                    function(err, authResult) {
                                        if (err) {
                                            Lock.emit(
                                                'authorization_error',
                                                err
                                            );
                                        }
                                        if (authResult && authResult.idToken) {
                                            Lock.emit(
                                                'authenticated',
                                                authResult
                                            );
                                        }
                                    }
                                );
                            }
                        });
                    };



                    lock.on('authenticated', function(authResult) {
                        localStorage.setItem('id_token', authResult.idToken);
                        lock.getUserInfo(authResult.accessToken, function(error, profile) {
                            if (error) {
                                console.log(error);
                            }
                            localStorage.setItem('profile', JSON.stringify(profile));
                        });

                    });


                    return lock;
                } else if ('keycloak' === this.authType) {


                    var keycloak = Keycloak(this.options);

                    // set redirectUri from options. just in case something wrong on server side.
                    keycloak.init({ "redirectUri": this.options.redirect_uri }).success(function(authenticated) {
                        console.debug(authenticated ? 'authenticated' : 'not authenticated');
                        if (authenticated) {
                            // put token into local storage
                            localStorage.setItem('id_token', keycloak.token);
                        }


                    }).error(function() {
                        console.warn("failed to initialized!");
                    });
                    keycloak["show"] = keycloak.login;
                    keycloak["exit"] = function(param){
                        this.logout({
                            redirectUri : param.returnTo
                        });
                        localStorage.setItem('id_token', '');
                    };
                    return keycloak;
                } else {
                    return null;
                }
            }
        ];
    });