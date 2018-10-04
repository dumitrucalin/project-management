<template>
	<div>
		<div v-if="user">
			<div class="dashboard">
				<h3 @click="taskList">This is the dashboard!</h3>
				<p @click="logIt()">Hello {{ this.user.fullName }}</p>
				<button class="submitButton" name="Submit" value="Logout"  @click="logout" >Logout</button>
				<button class="submitButton" name="Submit" value="Create Group" @click="createGroup">Create Group</button>
				<button class="submitButton" name="Submit" value="Create Task" @click="createTask">Create Task</button>
				<button class="submitButton" name="Submit" value="Settings" @click="settings">Settings</button>
				<button v-if="user.groupNames.length" type="button" @click="exitGroup">Leave Group</button>
			</div>

			<Settings v-if="settingsView" />
			<CreateGroup v-if="createGroupView" />
			<CreateTask v-if="createTaskView" />
			<TaskList v-if="taskListView" />

			<button v-if="createGroupView || createTaskView" @click="taskList">TaskView</button>
		</div>
		<div v-else>
			<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" />
		</div>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;
var Loading = require ('../Loading.vue');
var Settings = require('../dashboard/Settings.vue');
var CreateGroup = require('../dashboard/CreateGroup.vue');
var CreateTask = require('../dashboard/CreateTask.vue');
var TaskList = require('../dashboard/TaskList.vue');

module.exports = {
	name: 'Dashboard',
	
	data() {
		return {
			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,
			
			settingsView: false,
			createGroupView: false,
			createTaskView: false,
			taskListView: true,

			userInfo:{
				username:'',
				groupName:'',
			},
		};
	},

	components: {
		Settings,
		CreateGroup,
		CreateTask,
		TaskList,
		Loading
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
		async exitGroup(){
			await this.$store.dispatch ('user/deleteUserFromGroup', {
				groupInfo:this.userInfo
			});
		},
		createGroup: function() {
			this.createGroupView = true;
			this.createTaskView = false;
			this.taskListView = false;
			this.settingsView = false;
		},
		createTask: function() {
			this.createGroupView = false;
			this.createTaskView = true;
			this.taskListView = false;
			this.settingsView = false;
		},
		taskList: function() {
			this.createGroupView = false;
			this.createTaskView = false;
			this.taskListView = true;
			this.settingsView = false;
		},
		settings: function() {
			this.createGroupView = false;
			this.createTaskView = false;
			this.taskListView = false;
			this.settingsView = true;
		},
		logIt:function(){
			console.log(this.groupName);//console log pt click pe numele utilizatorului la ce ma-ta vrei
		},	
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	async created() {
		var user = await this.$store.dispatch ('user/getUser');
		var viewTasks = false;
		if (user.groupNames.length !== 0) {
			viewTasks = true;
			await this.$store.dispatch ('user/changeTasksView', viewTasks);
			this.groupName = user.groupNames[0];
		} else {
			viewTasks = false;
			await this.$store.dispatch ('user/changeTasksView', viewTasks);
		}
	}
};

</script>