Vue.directive('sortable', {
    inserted: function (el, binding) {
        var sortable = new Sortable(el, binding.value);
    }
  });