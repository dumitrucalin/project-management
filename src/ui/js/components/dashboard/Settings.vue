<template>
	<div>
		<div v-if="user"><br><br>
			Your username is {{ user.username }}<br>
			Your email is {{ user.email }}<br>
			Your fullName is {{ user.fullName }}<br>

			<button v-if="!changeInfo" @click="changeInfo = true">Change personal info</button>

			<div v-if="changeInfo">
				<input type="text" class="inputDesign" placeholder="Full Name" v-model="fullName" />
				<input type="text" class="inputDesign" placeholder="E-Mail" v-model="email" />
				<button class="submitButton" name="Submit" @click="submitInfo" >Submit</button>
			</div><br><br><br><br>

			<div v-if="user.groupNames.length">
				Exit from the group<br>
				<select v-model="exitGroupName">
					<option v-for="(item, index) in this.groupNamesSorted" :key="index" :value="item" >{{ item }}</option>
				</select><br>

				<button class="submitButton" name="Submit" @click="exitGroup" >Exit Group</button><br><br><br><br>

				Add new users to the group<br>
				<select v-model="groupName">
					<option v-for="(item, index) in this.groupNamesSorted" :key="index" :value="item" >{{ item }}</option>
				</select><br>

				<div v-if="groupName">
					<div class="form-group">
						<input id="username" type="text" class="form-control input-sm chat-input"  placeholder="User Name" v-model="username" />
						<button @click="addUserGroup">Add User</button>
					</div>

					<ul>
						<li v-for="(groupUserShow, index) in usernamesShow" :key="index">
							<p>{{ groupUserShow }}<button @click="outWithUser(groupUserShow)">X</button></p>
						</li>
					</ul>
				</div>

				<button @click="submitGroup">Update Group</button><br><br>
				<button @click="redirectDashboard">Task View</button>
			</div>
		</div>
		
		<div v-else>
			<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" />
		</div>
	</div>
</template>

<script>

var mapGetters = require('vuex').mapGetters;
var Loading = require('../Loading.vue');
var validator = require('validator');
var Vue = require('vue');

module.exports = {
	name: 'Settings',

	components: {
		Loading
	},
	
	data() {
		return {
			fullName: '',
			email: '',
			exitGroupName: '',
			groupName: '',
			username: '',
			usernames: [],
			usernamesShow: [],
			changeInfo: false,
			groupNamesSorted: [''],
			usernamesSorted: [''],

			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,

			wrongUsername: {
				title: 'Update Users in the Group: Fail',
				message: 'The username contains invalid characters.',
				type: 'warning'
			},
			allreadyAdded: {
				title: 'Update Users in the Group: Fail',
				message: 'The user is already in the group.',
				type: 'warning'
			},
			userCreatorIs: {
				title: 'Update Users in the Group: Fail',
				message: 'You are already in the group.',
				type: 'warning'
			},
			incorrectEmail: {
				title: 'Update Users Info: Fail',
				message: 'The e-mail is not valid.',
				type: 'warning'
			}
		};
	},


	computed: {
		...mapGetters({
			user: 'user/user',
			currentUsernames: 'group/usernames'
		})
	},

	async created() {
		await this.$store.dispatch('task/stopCheck');

		for (let groupName of this.user.groupNames)
			this.groupNamesSorted.push(groupName);
		this.groupNamesSorted = this.groupNamesSorted.sort();

		for (let username of this.usernames)
			this.usernamesSorted.push(username);
		this.usernamesSorted = this.usernamesSorted.sort();
	},

	watch: {
		groupName: async function() {
			await this.$store.dispatch('group/users', this.groupName);
		}
	},

	methods: {
		async submitInfo() {
			if (validator.isEmail(this.email, ['en-US'])) {
				let state = await this.$store.dispatch('user/update', {
					username: this.user.username,
					fullName: this.fullName,
					email: this.email
				});

				if (state)
					await this.$store.dispatch('settings/redirect', 'DASHBOARD');
			} else {
				this.email = '';
				
				Vue.toast.customToast(this.incorrectEmail);
			}
		},

		async addUserGroup() {
			if(this.username !== this.user.username) {
				if(!this.usernames.includes(this.username)) {
					if (validator.isAlphanumeric(this.username, ['en-US'])) {
						let state = await this.$store.dispatch('user/check', this.username);

						if (state) {
							this.usernames.push(this.username);
							this.usernamesShow.push(this.username);
						}
					} else {
						Vue.toast.customToast(this.wrongUsername);
					}
				} else {
					Vue.toast.customToast(this.allreadyAdded);
				}
			} else {
				Vue.toast.customToast(this.userCreatorIs);
			}

			this.username='';
		},

		async submitGroup() {
			let state = await this.$store.dispatch('group/update', {
				groupName: this.groupName,
				usernames: this.usernames
			});

			if (state)
				await this.$store.dispatch('settings/redirect', 'DASHBOARD');	
		},

		async exitGroup() {
			let state = await this.$store.dispatch('group/delete', {
				groupName: this.exitGroupName,
				username: this.user.username
			});

			if (state)
				await this.$store.dispatch('settings/redirect', 'DASHBOARD');
		},

		async redirectDashboard() {
			await this.$store.dispatch('settings/redirect', 'DASHBOARD');
		},

		outWithUser(username) {
			var index = this.usernamesShow.indexOf(username);
			if (index > -1) {
				this.usernamesShow.splice(index, 1);
				this.usernames.splice(index, 1);
			}
		}
	}
};

</script>
