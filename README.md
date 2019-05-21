# tokenAuth.js
Future Grid Auth JavaScript Library.

Supports Auth0 & Keycloak


# Installation

    bower:  bower install fgp-auth-kit

  Then add the sources to your code (adjust paths as needed) after 
adding the dependencies for Angular and Dygraphs first:

```html
<head>
  // css fgp.kit.bundle.min.css

  <!-- auth -->
    <script src="bower_components/auth0-lock/build/lock.min.js"></script>
    <script src="bower_components/auth0.js/build/auth0.min.js"></script>
    <!-- url is the keycloak service url -->
    <script src="https://compass-auth.dev.welnet.co.nz/auth/js/keycloak.js"></script>
    <script src="bower_components/fgp-auth-kit/dist/fgp-auth.js"></script>
<head>
<body>
  ...
</body>
  
```

# Setup

angularjs1.5 

## improt modules 

    angular.module('???', ['angular-jwt', 'fgpAuth'] .....


## init 
   
    .config(function(fgpTokenAuthProvider) {
        /**
         *   init keycloak.
         **/
        fgpTokenAuthProvider.initKeycloak({
            clientID: 'wel',
            options: {
                realm: 'fgp',
                'auth-server-url': 'https://compass-auth.dev.welnet.co.nz/auth',
                'ssl-required': 'external',
                redirect_uri: 'https://compass.dev.welnet.co.nz/#/main',
                resource: 'wel',
                'verify-token-audience': true,
                credentials: {
                    secret: '<secret>'
                },
                'confidential-port': 0,
                'policy-enforcer': {},
                client_id: 'wel'
            }
        });
    })

    redirect to search page after success.

    .run(function(fgpTokenAuth, $timeout, $state) {
        fgpTokenAuth.onAuthSuccess = function() {
            console.info(fgpTokenAuth.idToken);
            //redirect to main page
            $timeout(function() {
                $state.go('app.search', null, {
                    reload: true
                });
            });
            //
        };

        fgpTokenAuth.onAuthError = function() {
            //redirect to login page
            fgpTokenAuth.show();
        };

        fgpTokenAuth.onAuthLogout = function() {
            $timeout(function() {
                fgpTokenAuth.show();
            });
        };
    })

    JWT bind token to all request

    .config(function Config($httpProvider, jwtOptionsProvider) {
        // Please note we're annotating the function so that the $injector works when the file is minified
        jwtOptionsProvider.config({
            tokenGetter: [
                '$http',
                function($http) {
                    return localStorage.getItem('id_token');
                }
            ]
        });
        $httpProvider.interceptors.push('jwtInterceptor');
    })
