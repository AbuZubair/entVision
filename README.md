## Notes

1. Bisa menggunakan node untuk web server
2. Menggunakan express.js untuk BE
3. path BE pada `api/`

## Instalasi (Berurut)

1. Running `'npm i'` pada root folder
2. Masuk ke folder `'api/'` dan running `'npm i'`
3. Masuk ke file `'./node_modules/ngx-gallery/bundles/ngx-gallery.umd.js'`, ganti line 
    
    
    `'var CustomHammerConfig = /** @class */ (function (_super) {
        __extends(CustomHammerConfig, _super);
        function CustomHammerConfig() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.overrides = ({
                'pinch': { enable: false },
                'rotate': { enable: false }
            });
            return _this;
        }
        return CustomHammerConfig;
    }(platformBrowser.HammerGestureConfig));'`
  
    dengan 

    `'class CustomHammerConfig extends platformBrowser.HammerGestureConfig {
        constructor() {
            super(...arguments);
            this.overrides = ({
                'pinch': { enable: false },
                'rotate': { enable: false }
            });
        }
    }'`
  
  4. Build `'ng build'`
  5. Running FE di node server `'node web.js'` pada root folder
  6. Running BE di node server `'node app.js'` pada `'api/'`
  7. Browse `'http://localhost:8080/'`
    

## ------------------------------------------------------------------

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
