require('bootstrap');
var Vue = require('vue');
var store = require('./store/dashboard/store.js');
var toast = require ('./vue-toast.js');

Vue.use(toast);

Vue.mixin({
	store
});

var Dashboard = require('./components/dashboard/Dashboard.vue');

new Vue({
	el: '#dashboard',

	data: {
		token: '',
		reloadTasks: true
	},
	render: function(render) {
		return render(Dashboard);
	},
	async created() {
		if (!this.$store.getters['user/token'])
			await this.$store.dispatch ('settings/redirect', 'BAD_DASHBOARD');
		else {
			console.log('Searching for the user');
			var userFound = await this.$store.dispatch ('user/getUser');
			console.log('Found the user: ' + userFound);
			if (userFound !== true) {
				await this.$store.dispatch ('user/deleteToken');
				await this.$store.dispatch ('settings/redirect', 'BAD_DASHBOARD');
			} else {
				await this.$store.dispatch ('user/getTasks');
			}
		}
	}
});