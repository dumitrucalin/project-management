<template>
	<div class="createGroup">
		<p>This is the group creator!</p>
		<p>Hello {{ this.user.fullName }}</p>

		<div class="form-group">
			<input id="groupName" type="text" class="form-control input-sm chat-input"  placeholder="Group Name" v-model="groupName" />
		</div>
		<div class="form-group">
			<input id="userName" type="text" class="form-control input-sm chat-input"  placeholder="User Name" v-model="userNameGroup" />
			<button @click="addUserGroup">Add User</button>
		</div>
		<ul>
			<li v-for="(groupUserShow, index) in groupUsersShow" :key="index">
				<p>{{ groupUserShow }}</p>
			</li>
		</ul>
		<button @click="submitGroup">Create Group</button>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;
var validator = require('validator');
var Vue = require('vue');

module.exports = {
	name: 'CreateGroup',
	
	data() {
		return {
			groupName:'',
			userNameGroup:'',
			groupUsers:[],
			groupUsersShow:[],
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
			}
		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	methods: {
		async submitGroup(){
			this.groupUsers.push(this.user.username);
			var state = await this.$store.dispatch ('user/sendGroup', {
				groupName:this.groupName,//ruta daca e unic on create
				usernames:this.groupUsers,
			});
			if (state) {
				this.$store.dispatch('settings/redirect', 'DASHBOARD');
			} else {
				console.log('could\'t create the group');
				// TODO: TOAST
			}
		},
		async addUserGroup() {
			if(this.userNameGroup !== this.user.username) {
				if(!this.groupUsers.includes(this.userNameGroup)) {
					if (validator.isAlphanumeric(this.userNameGroup, ['en-US'])) {
						let state = await this.$store.dispatch('user/checkUsername', this.userNameGroup);
						if (state) {
							this.groupUsersShow.push(this.userNameGroup);
							this.groupUsers.push(this.userNameGroup);//ruta daca exista
							this.userNameGroup='';
						} else {
							console.log('user not existing');
							// TODO: TOAST FOR NOT EXISTING USER
						}
					} else {
						Vue.toast.customToast(this.wrongUsername);
						this.userNameGroup='';
					}
				} else {
					Vue.toast.customToast(this.allreadyAdded);
					this.userNameGroup='';
				}
			} else {
				Vue.toast.customToast(this.userCreatorIs);
				this.userNameGroup='';
			}
		},
	},

	async created() {
		await this.$store.dispatch('user/stopCheckTasksStatus');
	}
};

</script>