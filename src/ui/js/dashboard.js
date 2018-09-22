require('bootstrap');
var Vue = require('vue');

var store = require('./store/dashboard/store.js');

Vue.mixin({
	store
});

var Dashboard = require('./components/dashboard/Dashboard.vue');

new Vue({
	el: '#dashboard',
	data: {},
	render: function(render) {
		return render(Dashboard);
	},
	async created() {
		if (!this.$store.getters['user/token'])
			await this.$store.dispatch ('settings/redirect', 'BAD_DASHBOARD');
	}
});