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
                    "auth-server-url": "https://compass-auth.welnet.co.nz/auth",
                    "redirect_uri": "http://localhost:4090/#/main",
                    "ssl-required": "external",
                    "resource": "wel",
                    "verify-token-audience": true,
                    "credentials": {
                    //   "secret-jwt": {
                        "secret": "59bbbe8b-f483-45ac-b067-5fec9465005e"
                    //   }
                    },
                    "confidential-port": 0,
                    "policy-enforcer": {}

        }
    });
}).run(function(fgpTokenAuth, $timeout, $state) {

    fgpTokenAuth.onAuthSuccess = function(){
        debugger;
        console.info(fgpTokenAuth.idToken);
        //
    };

    fgpTokenAuth.onAuthError = function(){
        //redirect to login page
        debugger;
    }

    fgpTokenAuth.onAuthLogout = function(){
        $timeout(function(){
            $state.go("app.login");
        });
    }

});