angular.module('helloworld', ['fgpAuth', 'ui.router']).config(function($stateProvider) {

    var main = {
        name: 'app',
        url: '',
        templateUrl: 'views/app.html',
        controller: function($scope, fgpTokenAuth) {

            $scope.authorized = false;

            $scope.types = [
                { type: 'keycloak', label: 'Keycloak' }
            ];
            $scope.auth = $scope.types[0]; // default


            $scope.changeType = function(type) {
                $scope.auth = type;
            };

            $scope.logout = function() {
                fgpTokenAuth.exit({ returnTo: 'https://compass.dev.welnet.co.nz/#/login' });
                $scope.authorized = false;
            };

            // listener for id_token
            $scope.$watch(function() {
                return localStorage.getItem('id_token');
            }, function(newValue) {
                if (newValue && newValue != '') {
                    $scope.authorized = true;
                    $scope.token = localStorage.getItem('id_token');
                }
            });

        }
    };
    $stateProvider.state(main);

    var login = {
        name: 'app.login',
        url: '/login',
        template: '<div id="hiw-login-container" class="mt-5"></div>',
        controller: function($scope, fgpTokenAuth, $timeout) {
            $timeout(function() {
                console.debug("open login dialog!");
                fgpTokenAuth.show();
            });
        }
    };

    $stateProvider.state(login);

    var callback = {
        name: 'callback',
        url: '/callback',
        controller: function() {
            console.debug("auth back!");
        }
    };

    $stateProvider.state(callback);


    var main = {
        name: 'app.main',
        url: '/main'
    };

    $stateProvider.state(main);



}).config(function(fgpTokenAuthProvider) {
    /**
     *   init keycloak. 
     **/
    fgpTokenAuthProvider.initKeycloak({
        clientID: 'wel',
        options: {
                // "client_id": 'shinehub',
                // "realm": "shinehub",
                // "redirect_uri": "http://localhost:4050/#/main",
                // "auth-server-url": "https://auth.fgp.io/auth",
                // "ssl-required": "external",
                // "resource": "shinehub",
                // "verify-token-audience": true,
                // "credentials": {
                //     "secret": "9b5ffcd1-5763-43ce-acbb-b86a22fae3e0"
                // },
                // "use-resource-role-mappings": true,
                // "confidential-port": 0,
                // "policy-enforcer": {}

                    "realm": "fgp",
                    "auth-server-url": "https://compass-auth.dev.welnet.co.nz/auth",
                    "ssl-required": "external",
                    "redirect_uri": "https://compass.dev.welnet.co.nz/#/main",
                    "resource": "wel",
                    "verify-token-audience": true,
                    "credentials": {
                      "secret": "76a0dc3a-81ad-4e0b-af73-1f7cd88ac87e"
                    },
                    "confidential-port": 0,
                    "policy-enforcer": {},
                    "client_id": 'wel'

        }
    });
}).run(function(fgpTokenAuth, $timeout, $state) {

    fgpTokenAuth.onAuthSuccess = function(){
        console.info(fgpTokenAuth.idToken);
        //redirect to main page
        $timeout(function(){
            $state.go("app.main");
        });
        //
    };

    fgpTokenAuth.onAuthError = function(){
        //redirect to login page
    }

    fgpTokenAuth.onAuthLogout = function(){
        $timeout(function(){
            $state.go("app.login");
        });
    }

});