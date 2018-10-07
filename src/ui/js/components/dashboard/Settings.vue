<template>
	<div>
		<div v-if="user">
			Your email is {{ user.email }}<br>
			Your fullName is {{ user.fullName }}<br>

			<button v-if="!changeInfo" @click="changeInfo = true">Change personal info</button>
			<div v-if="changeInfo">
				<input type="text" class="inputDesign" placeholder="Full Name" v-model="fullName" />
				<input type="text" class="inputDesign" placeholder="E-Mail" v-model="email" />
				<button class="submitButton" name="Submit" @click="submitInfo" >Submit</button>
			</div><br><br><br><br>

			<div v-if="user.groupNames.length">
				<div>Group</div>
				<select v-model="exitGroupName">
					<option v-for="(item, index) in this.groupNamesSorted" :key="index" :value="item" >{{ item }}</option>
				</select><br>
				<button class="submitButton" name="Submit" @click="exitGroup" >Exit Group</button><br><br><br><br>

				<div>Group</div>
				<select v-model="groupName">
					<option v-for="(item, index) in this.groupNamesSorted" :key="index" :value="item" >{{ item }}</option>
				</select><br>

				<div class="form-group">
					<input id="username" type="text" class="form-control input-sm chat-input"  placeholder="User Name" v-model="username" />
					<button @click="addUserGroup">Add User</button>
				</div>
				<ul>
					<li v-for="(groupUserShow, index) in usernamesShow" :key="index">
						<p>{{ groupUserShow }}</p>
					</li>
				</ul>
				<button @click="submitGroup">Update Group</button>
			</div>
		</div>
		<div v-else>
			<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" />
		</div>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;
var Loading = require ('../Loading.vue');
var validator = require('validator');
var Vue = require('vue');

module.exports = {
	name: 'Settings',

	components: {
		Loading
	},
	
	data() {
		return {
			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,
			groupNamesSorted: [''],
			usernamesSorted: [''],
			wrongUsername: {
				title: 'Username contains invalid characters',
				message: 'Please insert your username again',
				type: 'warning'
			},
			allreadyAdded: {
				title: 'The user is allready in the group',
				message: 'Please insert another user',
				type: 'warning'
			},
			userCreatorIs: {
				title: 'You are already in the group',
				message: 'Please insert another user',
				type: 'warning'
			},
			
			fullName: '',
			email: '',
			exitGroupName: '',
			groupName: '',
			username: '',
			usernames: [],
			usernamesShow: [],

			changeInfo: false
		};
	},


	computed: {
		...mapGetters ({
			user: 'user/user',
			currentUsernames: 'user/usernames'
		})
	},

	methods: {
		async submitInfo() {
			if (validator.isEmail(this.email, ['en-US'])) {
				var userInfo = {
					username: this.user.username,
					fullName: this.fullName,
					email: this.email
				};
				let state = await this.$store.dispatch ('user/updateUserInfo', userInfo);
				if (state) {
					await this.$store.dispatch ('settings/redirect', 'DASHBOARD');
				}
			} else {
				this.fullName = '';
				// TOAST FOR INCORRECT EMAIL
			}
		},
		async addUserGroup() {
			if(this.username !== this.user.username) {
				if(!this.usernames.includes(this.username)) {
					if (validator.isAlphanumeric(this.username, ['en-US'])) {
						let state = await this.$store.dispatch('user/checkUsername', this.username);
						if (state) {
							this.usernames.push(this.username);
							this.usernamesShow.push(this.username);
							// TODO: TOAST FOR SUCCEDING ADDING THE USERS IN THE GROUP
						} else {
							console.log('user not existing');
							// TODO: TOAST FOR USER NOT EXISTING
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
		async submitGroup(){
			let state = await this.$store.dispatch ('user/updateGroup', {
				groupName: this.groupName,
				usernames: this.usernames
			});
			if (state) {
				this.groupName = '';
				this.username = '';
				this.usernames = '';
				await this.$store.dispatch ('settings/redirect', 'DASHBOARD');
			}	
		},
		async exitGroup(){
			let state = await this.$store.dispatch ('user/deleteUserFromGroup', {
				groupName:this.exitGroupName,
				username:this.user.username
			});
			if (state) {
				await this.$store.dispatch ('settings/redirect', 'DASHBOARD');
			}
		}
	},

	watch: {
		groupName: async function() {
			await this.$store.dispatch('user/getUsers', this.groupName);
		}
	},

	async created() {
		for (let groupName of this.user.groupNames)
			this.groupNamesSorted.push(groupName);
		this.groupNamesSorted = this.groupNamesSorted.sort();

		for (let username of this.usernames)
			this.usernamesSorted.push(username);
		this.usernamesSorted = this.usernamesSorted.sort();
		await this.$store.dispatch('user/stopCheckTasksStatus');
	}
};

</script>
