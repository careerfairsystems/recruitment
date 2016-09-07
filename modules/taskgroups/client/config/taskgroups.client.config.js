(function () {
  'use strict';

  angular
    .module('taskgroups')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Taskgroups',
      state: 'taskgroups',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'taskgroups', {
      title: 'List Taskgroups',
      state: 'taskgroups.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'taskgroups', {
      title: 'Create Taskgroup',
      state: 'taskgroups.create',
      roles: ['admin']
    });
  }
})();
