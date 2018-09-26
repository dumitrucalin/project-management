require('bootstrap');
var Vue = require('vue');

var store = require('./store/signup/store.js');

Vue.mixin({
	store
});

var Signup = require('./components/signup/Signup.vue');

new Vue({
	el: '#signup',
	data: {},
	render: function(render) {
		return render(Signup);
	},
});