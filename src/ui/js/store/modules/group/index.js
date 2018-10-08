var Vue = require('vue');
var setup = require('../../setup.js');

module.exports = {
	namespaced: true,

	state: {
		user: null,
		usernames: null,
		fullNames: null,
		groupName: null
	},

	getters: {
		user(state) {
			return state.user;
		},
		usernames(state) {
			return state.usernames;
		},
		fullNames(state) {
			return state.fullNames;
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
					// store.commit('user', response.data.user); TO SEE IF IT STLL WORKS

					if(this.notifications)
						Vue.toast.customToast({
							title:'SendGroup:Success',
							message:'The group has been sent: ' + groupInfo,
							type:'info'
						});

					return true;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'SendGroup:Fail',
							message:'The group has not been sent',
							type:'warning'
						});

					return false;
				}
			} catch(e) {
				return false;//bootsrap notify server
			}
		},

		async update(store, groupInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/users/create', groupInfo);

				if (response.data.err === 0) {
					var newUsernames = groupInfo.usernames;
					var oldUsernames = store.getters ['usernames'];

					for (let username of oldUsernames) {
						newUsernames.push(username);
					}

					store.commit('usernames', newUsernames);

					let newResponse = await Vue.http.post(setup.API + '/users/usernames/get', {
						usernames: newUsernames
					});

					if (newResponse.data.err === 0) {
						var fullNames = newResponse.data.fullNames;
					} else {
						if(this.notifications)
							Vue.toast.customToast({
								title:'UpdateGroup:Fail',
								message:newResponse.data.message,
								type:'warning'
							});

						return false;
					}
					store.commit('fullNames', fullNames);

					if(this.notifications)
						Vue.toast.customToast({
							title:'UpdateGroup:Success',
							message:'The group has been updated',
							type:'info'
						});

					return true;
				} else {
					return false;//bootstrap notify custom
				}
			} catch(e) {
				return false;//bootstrap notify server
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
					if(this.notifications)
						Vue.toast.customToast({
							title:'GetUsers:Fail',
							message:'The users have not been retrieved',
							type:'warning'
						});

					return false;
				}

				store.commit('usernames', usernames);

				let newResponse = await Vue.http.post(setup.API + '/users/fullNames/get', {
					usernames: usernames
				});

				if (newResponse.data.err === 0) {
					var fullNames = newResponse.data.fullNames;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'GetUsers:Fail',
							message:newResponse.data.message,
							type:'warning'
						});

					return false;
				}

				store.commit('fullNames', fullNames);

				if(this.notifications)
					Vue.toast.customToast({
						title:'GetUsers:Success',
						message:'Returned fullNames: '+ fullNames,
						type:'info'
					});

				return true;
			} catch (e) {
				return false;//bootsrap notify server
			}
		},

		async delete(store, deleteInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/user/delete', deleteInfo);

				if(response.data.err === 0) {
					if(this.notifications)
						Vue.toast.customToast({
							title:'DeleteUserFromGroup:Success',
							message:'User ' + deleteInfo.username + ' deleted from ' + deleteInfo.groupName,
							type:'info'
						});

					return true;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'DeleteUserFromGroup:Fail',
							message:'User ' + deleteInfo.username + ' has not been deleted from ' + deleteInfo.groupName,
							type:'warning'
						});

					return false;
				}
			} catch (e) {
				return false;//bootstrap notify server
			}
		},

		set(store, groupName) {
			store.commit('groupName', groupName);
		},
	},
	
	mutations: {
		user(state, value) {
			state.user = value;
		},
		usernames(state, value) {
			state.usernames = value;
		},
		fullNames(state, value) {
			state.fullNames = value;
		},
		groupName(state, value) {
			state.groupName = value;
		}
	}
};