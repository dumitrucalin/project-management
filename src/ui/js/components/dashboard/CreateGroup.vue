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

module.exports = {
	name: 'CreateGroup',
	
	data() {
		return {
			groupName:'',
			userNameGroup:'',
			groupUsers:[],
		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	methods: {
		async submitGroup(){
			await this.$store.dispatch ('user/sendGroup', {
				groupName:this.groupName,
				usernames:this.groupUsers,
			});
		},
		addUserG:function(){
			this.groupUsers.push(this.userNameGroup);
		},
	},
};

</script>