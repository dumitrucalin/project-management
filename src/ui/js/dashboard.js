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

	render: function(render) {
		return render(Dashboard);
	},

	async created() {
		if (!this.$store.getters['user/token'])
			await this.$store.dispatch('settings/redirect', 'BAD_DASHBOARD');
		else {
			var user = await this.$store.dispatch('user/get');
			
			if (user === null) {
				await this.$store.dispatch('user/token');
				await this.$store.dispatch('settings/redirect', 'BAD_DASHBOARD');
			}
		}
	}
});