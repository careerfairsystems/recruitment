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
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'taskapplications', {
      title: 'List Taskapplications',
      state: 'taskapplications.list',
      roles: ['admin']
    });
  }
})();
