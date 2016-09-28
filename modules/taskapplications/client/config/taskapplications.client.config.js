(function () {
  'use strict';

  angular
    .module('taskapplications')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Taskapplications',
      state: 'taskapplications',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'taskapplications', {
      title: 'List Taskapplications',
      state: 'taskapplications.list',
      roles: ['admin']
    });

    Menus.addSubMenuItem('topbar', 'taskapplications', {
      title: 'Generate Companyhosts',
      state: 'taskapplications.gencompanyhosts',
      roles: ['admin']
    });
  }
})();
