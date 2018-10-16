var Vue = require('vue');
var setup = require('../../setup.js');

module.exports = {
	namespaced: true,

	state: {
		user: null,
		usersBasicInfo: null,
		groupName: null
	},

	getters: {
		user(state) {
			return state.user;
		},
		usersBasicInfo(state) {
			return state.usersBasicInfo;
		},
		groupName(state) {
			return state.groupName;
		}
	},

	actions: {
		async create(store, groupInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/create', groupInfo);

				if (response.data.err === 0) {
					if(this.notifications)
						Vue.toast.customToast({
							title: 'Create Group: Success',
							message: 'The group ' + groupInfo.groupName + ' has been created.',
							type: 'info'
						});

					return true;
				} else {
					Vue.toast.customToast({
						title: 'Create Group: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async update(store, groupInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/users/create', groupInfo);

				if (response.data.err === 0) {
					var newUsernames = groupInfo.usernames;
					var oldUsernames = store.getters ['usersBasicInfo'];

					for (let username of Object.keys(oldUsernames)) {
						newUsernames.push(oldUsernames[username]);
					}

					store.commit('usernames', newUsernames);

					let newResponse = await Vue.http.post(setup.API + '/users/usersBasicInfo/get', {
						usernames: newUsernames
					});

					if (newResponse.data.err === 0) {
						var fullNames = newResponse.data.fullNames;
					} else {
						Vue.toast.customToast({
							title: 'Update Users in the Group: Fail',
							message: newResponse.data.message,
							type: 'warning'
						});

						return false;
					}
					store.commit('usersBasicInfo', fullNames);

					if(this.notifications)
						Vue.toast.customToast({
							title: 'Update Users in the Group: Success',
							message: 'The group has been updated.',
							type: 'info'
						});

					return true;
				} else {
					Vue.toast.customToast({
						title: 'Update Users in the Group: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async users(store, groupName) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/users/get', {
					groupName: groupName
				});

				if (response.data.err === 0) {
					var usernames = response.data.usernames;
				} else {
					Vue.toast.customToast({
						title: 'Get Users form the Group: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}

				response = await Vue.http.post(setup.API + '/users/usersBasicInfo/get', {
					usernames: usernames
				});

				if (response.data.err === 0) {
					store.commit('usersBasicInfo', response.data.usersBasicInfo);
				} else {
					Vue.toast.customToast({
						title: 'Get Users form the Group: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}

				return true;
			} catch (error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async delete(store, deleteInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/user/delete', deleteInfo);

				if(response.data.err === 0) {
					if(this.notifications)
						Vue.toast.customToast({
							title: 'Delete User from the Group: Success',
							message: 'User ' + deleteInfo.username + ' deleted from ' + deleteInfo.groupName + '.',
							type: 'info'
						});

					return true;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title: 'Delete User from the Group: Fail',
							message: response.data.message,
							type: 'warning'
						});

					return false;
				}
			} catch (error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		set(store, groupName) {
			store.commit('groupName', groupName);
		}
	},
	
	mutations: {
		user(state, value) {
			state.user = value;
		},
		usersBasicInfo(state, value) {
			state.usersBasicInfo = value;
		},
		groupName(state, value) {
			state.groupName = value;
		}
	}
};