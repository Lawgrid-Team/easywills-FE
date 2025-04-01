import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


// Just keep it here for now
// {
//   "hosting": {
//     "public": "dist/easywills-fe/browser",
//     "ignore": [
//       "firebase.json",
//       "**/.*",
//       "**/node_modules/**"
//     ],
//     "rewrites": [
//       {
//         "source": "**",
//         "destination": "/index.html"
//       }
//     ]
//   }
// }

// "scripts": {
//     "ng": "ng",
//     "start": "ng serve",
//     "build": "ng build",
//     "watch": "ng build --watch --configuration development",
//     "test": "ng test",
//     "serve:ssr:easywills-FE": "node dist/easywills-fe/server/server.mjs"
//   },


// {
//     "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
//     "version": 1,
//     "newProjectRoot": "projects",
//     "projects": {
//         "easywills-FE": {
//             "projectType": "application",
//             "schematics": {
//                 "@schematics/angular:component": {
//                     "style": "scss"
//                 }
//             },
//             "root": "",
//             "sourceRoot": "src",
//             "prefix": "app",
//             "architect": {
//                 "build": {
//                     "builder": "@angular-devkit/build-angular:application",
//                     "options": {
//                         "allowedCommonJsDependencies": ["dotenv"],
//                         "outputPath": "dist/easywills-fe",
//                         "index": "src/index.html",
//                         "browser": "src/main.ts",
//                         "polyfills": ["zone.js"],
//                         "tsConfig": "tsconfig.app.json",
//                         "inlineStyleLanguage": "scss",
//                         "assets": [
//                             {
//                                 "glob": "**/*",
//                                 "input": "public"
//                             }
//                         ],
//                         "styles": ["src/tailwind.css", "src/styles.scss"],
//                         "scripts": [],
//                         "server": "src/main.server.ts",
//                         "outputMode": "server",
//                         "ssr": {
//                             "entry": "src/server.ts"
//                         }
//                     },
//                     "configurations": {
//                         "production": {
//                             "budgets": [
//                                 {
//                                     "type": "initial",
//                                     "maximumWarning": "500kB",
//                                     "maximumError": "1MB"
//                                 },
//                                 {
//                                     "type": "anyComponentStyle",
//                                     "maximumWarning": "40kB",
//                                     "maximumError": "100kB"
//                                 }
//                             ],
//                             "outputHashing": "all"
//                         },
//                         "development": {
//                             "optimization": false,
//                             "extractLicenses": false,
//                             "sourceMap": true,
//                             "fileReplacements": [
//                               {
//                                 "replace": "src/environments/environment.ts",
//                                 "with": "src/environments/environment.development.ts"
//                               }
//                             ]
//                         }
//                     },
//                     "defaultConfiguration": "production"
//                 },
//                 "serve": {
//                     "builder": "@angular-devkit/build-angular:dev-server",
//                     "configurations": {
//                         "production": {
//                             "buildTarget": "easywills-FE:build:production"
//                         },
//                         "development": {
//                             "buildTarget": "easywills-FE:build:development"
//                         }
//                     },
//                     "defaultConfiguration": "development"
//                 },
//                 "extract-i18n": {
//                     "builder": "@angular-devkit/build-angular:extract-i18n"
//                 },
//                 "test": {
//                     "builder": "@angular-devkit/build-angular:karma",
//                     "options": {
//                         "polyfills": ["zone.js", "zone.js/testing"],
//                         "tsConfig": "tsconfig.spec.json",
//                         "inlineStyleLanguage": "scss",
//                         "assets": [
//                             {
//                                 "glob": "**/*",
//                                 "input": "public"
//                             }
//                         ],
//                         "styles": ["src/tailwind.css", "src/styles.scss"],
//                         "scripts": []
//                     }
//                 }
//             }
//         }
//     },
//     "cli": {
//         "analytics": false
//     }
// }
