<template>
	<div class="createGroup">
		<p>This is the group creator!</p>
		<p>Hello {{ this.user.fullName }}</p>
		<p>This is the group creator!</p>
		<form>
			<div class="form-group">
				<input id="groupName" type="text" class="form-control input-sm chat-input"  placeholder="Group Name" v-model="groupName" />
			</div>
			<div class="form-group">
				<input id="userName" type="text" class="form-control input-sm chat-input"  placeholder="User Name" v-model="userNameGroup" />
				<button type="button" @click="addUserG">Add User</button>
			</div>
			<ul>
				<li v-for="(groupUser,index) in groupUsers" :key="index">
					<p>{{groupUser}}</p>
				</li>
			</ul>
			<button type="submit" @click=submitGroup>Create Group</button>
		</form>
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
			await this.$store.dispatch ('user/sendGroup', {
				groupName:this.groupName,//ruta daca e unic on create
				usernames:this.groupUsers,
			});
		},
		addUserG:function(){
			if(this.groupUsers.contains(this.userNameGroup)) {
				if (validator.isAlphanumeric(this.userNameGroup, ['en-US'])) { 
					this.groupUsers.push(this.userNameGroup);//ruta daca exista
					this.userNameGroup='';
				} else {
					Vue.toast.customToast(this.wrongUsername);
					this.userNameGroup='';
				}
			} else {
				Vue.toast.customToast(this.allreadyAdded);
				this.userNameGroup='';
			}
		},
	},
};

</script>