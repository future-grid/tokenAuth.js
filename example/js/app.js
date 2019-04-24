angular
    .module('helloworld', ['fgpAuth'])
    .config(function(fgpTokenAuthProvider) {
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
                logo:
                  "https://future-grid-website.appspot.com/wp-content/uploads/2017/07/nav-leaf.svg"
              },
              languageDictionary: {
                emailInputPlaceholder: "something@youremail.com",
                title: "Auth0 - FGP",
                loginLabel: "Sign in",
                loginSubmitLabel: "Sign in"
              }
            }
          });

        // fgpTokenAuthProvider.initKeycloak({
        //     clientID: 'shinehub',
        //     options: {
        //         url: 'https://auth.fgp.io/auth',
        //         realm: 'shinehub'
        //     }
        // });
    })
    .controller('loginCtrl', [
        'fgpTokenAuth',
        '$timeout',
        function(fgpTokenAuth, $timeout) {
            $timeout(function() {

                debugger;

                fgpTokenAuth.show();
            });
        }
    ]);
