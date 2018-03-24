
export class NotebooksRouter {

  configureRouter(config, router) {    
    config.options.pushState = true;
    config.options.root = '/notebooks';
    config.title = 'Notebooks';
    config.map([
      // { route: '', redirect: 'all', },
      { route: '/',           name: 'allNotebooks', title: 'All Notebooks', moduleId: '../views/all-notebooks' },
      { route: 'topics',      name: 'topics',       title: 'Topics',     moduleId: '../views/topics', nav: true},
      { route: 'topics/:tid', name: 'topicsDetail', title: 'Topics Detail', moduleId: '../views/topics' }
    ]);
    this.router = router;
  }

}
