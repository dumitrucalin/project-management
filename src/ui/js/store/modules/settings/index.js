module.exports = {
	namespaced: true,
	state: {
		LOGIN: '/login.html',
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