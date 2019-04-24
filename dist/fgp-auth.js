/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_keycloak_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_keycloak_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_keycloak_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_auth0_lock__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_auth0_lock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_auth0_lock__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_auth0_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_auth0_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_auth0_js__);





if (typeof __WEBPACK_IMPORTED_MODULE_0_angular___default.a !== 'object') {
    throw new Error('Angular1 must be loaded.');
}

if (!__WEBPACK_IMPORTED_MODULE_0_angular___default.a.isFunction(__WEBPACK_IMPORTED_MODULE_2_auth0_lock___default.a)) {
    throw new Error('Auth0Lock must be loaded.');
}

__WEBPACK_IMPORTED_MODULE_2_auth0_lock___default.a.prototype.getClient = function() {
    void 0;
};
__WEBPACK_IMPORTED_MODULE_2_auth0_lock___default.a.prototype.parseHash = function() {
    void 0;
};

if (!__WEBPACK_IMPORTED_MODULE_0_angular___default.a.isFunction(__WEBPACK_IMPORTED_MODULE_1_keycloak_js___default.a)) {
    throw new Error('Keycloak must be loaded.');
}

__WEBPACK_IMPORTED_MODULE_0_angular___default.a
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
                    var Lock = new __WEBPACK_IMPORTED_MODULE_2_auth0_lock___default.a(
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

                    lock.interceptHash = function() {
                        if (typeof __WEBPACK_IMPORTED_MODULE_3_auth0_js___default.a.WebAuth !== 'function') {
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
                                var webAuth = new __WEBPACK_IMPORTED_MODULE_3_auth0_js___default.a.WebAuth(credentials);

                                var hash =
                                    $location.hash() || window.location.hash;

                                webAuth.parseHash(
                                    {
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

                    return lock;
                } else if ('keycloak' === this.authType) {
                    var keycloak = __WEBPACK_IMPORTED_MODULE_1_keycloak_js___default()(this.options);
                    keycloak.init({ flow: 'implicit' });
                    keycloak["show"] = keycloak.login;
                    return keycloak;
                } else {
                    return null;
                }
            }
        ];
    });


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = Keycloak;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = Auth0Lock;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = auth0;

/***/ })
/******/ ]);