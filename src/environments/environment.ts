// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: 'localhost',
  serverUrl: 'http://localhost:48080/api/lunchroom',
  serverWsUrl: 'ws://localhost:48080/api/lunchroom',
  googleOAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  googleOAuthClientId: '32940535387-q270au7repg5hvof8irb2r7ennip9fej.apps.googleusercontent.com',
  googleOAuthRedirectUri: 'http://localhost:4200/signIn',
  userNickCookieName: 'user',
  tokenCookieName: 'token',
  userIdCookieName: 'id',
  roomIdCookieName: 'room',
  contentTypeHeaderName: 'Content-Type',
  applicationJsonHeaderValue: 'application/json'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
