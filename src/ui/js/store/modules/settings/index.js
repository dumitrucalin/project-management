module.exports = {
	namespaced: true,
	state: {
		LOGIN: '/login.html',
		SIGNUP: '/signup.html',
		DASHBOARD: '/dashboard.html',
		BAD_DASHBOARD: '/login.html?redirect=dashboard.html'
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