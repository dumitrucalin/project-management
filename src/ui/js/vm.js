require('bootstrap');
var Vue = require ('vue');

var store = require ('./store/vm/store.js');

Vue.mixin({
	store
});

var Vm = require ('./components/vm/Vm.vue');

new Vue({
	el: '#vm',
	
	data: {
		pula: true
	},
	
	render: function (render) {
		return render (Vm);
	},

	async created() {
		await this.$store.dispatch ('user/updateUser');
		if (!this.$store.getters ['user/token']) {
			this.$store.dispatch ('settings/redirect', 'BAD_VM');
		}
	}
});