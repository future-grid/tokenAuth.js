angular.module('helloworld', ['fgpAuth', 'ui.router']).config(function($stateProvider) {

    var main = {
        name: 'app',
        url: '',
        templateUrl: 'views/app.html',
        controller: function($scope, fgpTokenAuth) {

            $scope.authorized = false;

            $scope.types = [
                { type: 'auth0', label: 'Auth0' }
            ];
            $scope.auth = $scope.types[0]; // default


            $scope.changeType = function(type) {
                $scope.auth = type;
            };

            $scope.logout = function() {
                fgpTokenAuth.exit({ returnTo: 'http://localhost:4050/#/login' });
                $scope.authorized = false;
            };

            // listener for id_token
            $scope.$watch(function(){
              return localStorage.getItem('id_token');
            }, function(newValue) {
                if(newValue && newValue != ''){
                  $scope.authorized = true;
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
        name: 'app.callback',
        url: '/callback',
        controller: function() {
        }
    };

    $stateProvider.state(callback);




}).config(function(fgpTokenAuthProvider) {

    /**
     *   init auth0  
     **/
    fgpTokenAuthProvider.initAuth0({
        clientID: "gP57W77s1b3vkvWarYi9LF5rilBfUFir",
        domain: "future-grid.au.auth0.com",
        options: {
            _idTokenVerification: false,
            allowedConnections: [],
            container: 'hiw-login-container',
            auth: {
                redirectUrl: "http://localhost:4050/#/callback",
                responseType: "token id_token",
                params: {
                    scope: "openid email update:users update:users_app_metadata"
                }
            },
            theme: {
                primaryColor: "#51A5A7",
                foregroundColor: "#000000",
                logo: "https://future-grid-website.appspot.com/wp-content/uploads/2017/07/nav-leaf.svg"
            },
            languageDictionary: {
                emailInputPlaceholder: "something@youremail.com",
                title: "Auth0 - FGP",
                loginLabel: "Sign in",
                loginSubmitLabel: "Sign in"
            }
        }
    });
    /**
     *   init keycloak. 
     **/
    // fgpTokenAuthProvider.initKeycloak({
    //     clientID: 'shinehub',
    //     options: {
    //         url: 'https://auth.fgp.io/auth',
    //         realm: 'shinehub'
    //     }
    // });
}).run(function(fgpTokenAuth) {

    // For use with UI Router
    fgpTokenAuth.interceptHash();

});