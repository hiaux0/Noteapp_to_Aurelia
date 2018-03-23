
export class Notebooks {

  configureRouter(config, router) {
    config.options.pushState = true;
    // config.options.root = '/';
    config.title = 'Notebooks';
    config.map([
    {
      route: [''], name: 'note'
    },
    {
      route: ['topics'], name: 'topics' , nav: true, title: 'Topics', moduleId: '../views/topics'
    }
    ]);
    this.router = router;

  }

}
