<template>
	<div class="createGroup">
		<p>This is the group creator!</p>
		<p>Hello {{ this.user.fullName }}</p>
		<p>This is the group creator!</p>
		<!--<button class="submitButton" name="Submit" value="Logout" >Logout</button>-->
		<form>
			<div class="form-group">
				<input id="groupName" type="text" class="form-control input-sm chat-input"  placeholder="Group Name" v-model="groupN" />
			</div>
			<div class="form-group">
				<input id="userName" type="text" class="form-control input-sm chat-input"  placeholder="User Name" v-model="userNG" />
				<button type="button" @click="addUserG()">Add User</button>
			</div>
			<ul>
				<li v-for="(Guser,index) in Gusers" :key="index">
					<p>{{Guser}}</p>
				</li>
			</ul>
			<button>Create Group</button>
		</form>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;

module.exports = {
	name: 'CreateGroup',
	
	data() {
		return {
			groupN:'',
			userNG:'',
			Gusers:[
				'andy',
				'roby',
			],
		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	methods: {
		/*async submit(){

		}*/
		addUserG:function(){
			this.Gusers.push(this.userNG);
		},
	},
};

</script>