module.exports = {
	namespaced: true,
	state: {
		LOGIN: '/login.html',
		BAD_DASHBOARD: '/dashboard.html?redirect=DASHBOARD',
		DASHBOARD: '/dashboard.html',
		BAD_VM: '/login.html?redirect=VM',
		VM: '/vm.html',
		ROLES: [{
			name: 'user',
			title: 'User'
		}]
	},
	actions: {
		redirect(store, application) {
			let address = store.state[application];
			console.log(address);
			if (address !== '' && address !== undefined && address !== null) {
				console.log('Redirect to ' + address);
				window.location.href = address;
			}
		}
	},
	mutations: {}
};