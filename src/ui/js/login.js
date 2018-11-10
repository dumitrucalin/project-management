require('bootstrap');
var Vue = require('vue');

var store = require('./store/login/store.js');
var toast = require ('./vue-toast.js');

Vue.use(toast);

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
	async created() {
		if (this.$store.getters['user/token']) {
			await this.$store.dispatch ('settings/redirect', 'DASHBOARD');
		}
	}
});