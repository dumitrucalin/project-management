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
				<p>{{ groupUserShow }} <button @click="outWithUser(groupUserShow)">x</button> </p>
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
				title: 'Checking the Username: Fail',
				message: 'The username contains invalid characters.',
				type: 'warning'
			},
			allreadyAdded: {
				title: 'Checking the Username: Fail',
				message: 'The user is already in the group.',
				type: 'warning'
			},
			userCreatorIs: {
				title: 'Checking the Username: Fail',
				message: 'You are already in the group.',
				type: 'warning'
			}
		};
	},

	computed: {
		...mapGetters({
			user: 'user/user'
		})
	},

	async created() {
		await this.$store.dispatch('task/stopCheck');
	},

	methods: {
		async submitGroup() {
			this.groupUsers.push(this.user.username);

			var state = await this.$store.dispatch('group/create', {
				groupName:this.groupName,//ruta daca e unic on create
				usernames:this.groupUsers,
			});

			if (state)
				this.$store.dispatch('settings/redirect', 'DASHBOARD');
		},

		async addUserGroup() {
			if(this.userNameGroup !== this.user.username) {
				if(!this.groupUsers.includes(this.userNameGroup)) {
					if (validator.isAlphanumeric(this.userNameGroup, ['en-US'])) {
						let state = await this.$store.dispatch('user/check', this.userNameGroup);

						if (state) {
							this.groupUsersShow.push(this.userNameGroup);
							this.groupUsers.push(this.userNameGroup);
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

			this.userNameGroup='';
		},
		outWithUser(username) {
			var index = this.groupUsersShow.indexOf(username);
			if (index > -1) {
				this.groupUsersShow.splice(index, 1);
				this.groupUsers.splice(index, 1);
			}
		}
	}
};

</script>