require('bootstrap');
var Vue = require('vue');

var store = require('./store/login/store.js');

Vue.mixin({
	store
});

var Login = require('./components/login/Login.vue');

new Vue({
	el: '#login',
	data: {},
	render: function(render) {
		return render(Login);
	},
});