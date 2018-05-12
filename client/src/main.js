import environment from './environment';
import 'jquery'
import 'bootstrap'
import 'lodash'
// import '../src/features/helper_lib'

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .globalResources(
      // make views global
    )
    .plugin(
      // '../src/features/helper_lib.js'
    );

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
