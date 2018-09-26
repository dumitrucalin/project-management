<template>
	<div>
		<div v-if="user">
			<div class="dashboard">
				<h3 @click="homeF()">This is the dashboard!</h3>
				<p>Hello {{ this.user.fullName }}</p>
				<button class="submitButton" name="Submit" value="Logout"  @click="logout" >Logout</button>
				<button class="submitButton" name="Submit" value="Create Group" @click="groupF()">Create Group</button>
				<button class="submitButton" name="Submit" value="Create Group" @click="taskF()">Create Task</button>
			</div>
			<div id="homepage" v-if="home">
				<h5>Welcome to TaskManager2018</h5>
			</div>
		</div>
		<div v-else>
			Loading
		</div>
		<Group v-if="group"></Group>
		<Task v-if="task"></Task>
		<button v-if="group || task" @click="taskVF()">TaskView</button>
		<TaskView v-if="taskV"></TaskView>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;
var Group = require('../dashboard/Group.vue');
var Task = require('../dashboard/Task.vue');
var TaskView = require('../dashboard/TaskView.vue');

module.exports = {
	name: 'Dashboard',
	
	components:{
		'Group':Group,
		'Task':Task,
		'TaskView':TaskView,
	},
	data() {
		return {
			group: false,
			task: false,
			home:true,
			taskV:false,
		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	methods: {
		async logout() {
			let token = await this.$store.getters['user/token'];
			let logout = await this.$store.dispatch('user/logout', {
				token: token
			});
			if (logout)
				await this.$store.dispatch('settings/redirect', 'LOGIN');
		},
		groupF:function(){
			this.group=true;
			this.task=false;
			this.home=false;
			this.taskV=false;
		},
		taskF:function(){
			this.group=false;
			this.task=true;
			this.home=false;
			this.taskV=false;
		},
		homeF:function(){
			this.group=false;
			this.task=false;
			this.home=true;
			this.taskV=false;
		},
		taskVF:function(){
			this.group=false;
			this.task=false;
			this.home=false;
			this.taskV=true;
		}
	},
};

</script>