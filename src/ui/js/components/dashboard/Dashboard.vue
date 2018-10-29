<template>
	<div class="myDashboard">
		<link href="https://fonts.googleapis.com/css?family=Aclonica|Cabin+Sketch|Salsa" rel="stylesheet">
		<div v-if="user">
			<div class="navDiv">
				
				<div >
					<ul class="listDashboard">
						<li class="listDashboard">
							<div id="titleDashboard">
								<h3 @click="taskList">Dashboard!</h3>
							</div>
						</li>
						<li class="listDashboard">
							<div id="navButton">
								<button class="btn btn-basic btn-md" name="Submit" value="Create Group" @click="createGroup">Create Group</button>		
								<button v-if="user.groupNames.length" class="btn btn-basic btn-md" name="Submit" value="Create Task" @click="createTask">Create Task</button>
								<button class="btn btn-info btn-md" name="Submit" value="Settings" @click="settings">Settings</button>
							</div>
						</li>
						<li class="listDashboard">
							<div id="helloUser">
								<p @click="logIt()">Hello {{ this.user.fullName }}<br>{{ this.user.username }}</p>
							</div>
						</li>
						<li class="listDashboard">	
							<div>
								<button id="logoutButton" class="btn btn-primary btn-md" name="Submit" value="Logout"  @click="logout" >Logout</button>
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div class="taskDiv">
				<Settings v-if="settingsView" />
				<CreateGroup v-if="createGroupView" />
				<CreateTask v-if="createTaskView" />
				<TaskList v-if="taskListView" />

				<button v-if="createGroupView || createTaskView" @click="taskList">TaskView</button>
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
var Settings = require('../dashboard/Settings.vue');
var CreateGroup = require('../dashboard/CreateGroup.vue');
var CreateTask = require('../dashboard/CreateTask.vue');
var TaskList = require('../dashboard/TaskList.vue');

module.exports = {
	name: 'Dashboard',

	components: {
		Settings,
		CreateGroup,
		CreateTask,
		TaskList,
		Loading
	},
	
	data() {
		return {
			settingsView: false,
			createGroupView: false,
			createTaskView: false,
			taskListView: false,

			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500
		};
	},

	computed: {
		...mapGetters({
			user: 'user/user'
		})
	},

	async created() {
		var user = await this.$store.dispatch('user/get');
		if (this.user.groupNames.length > 0) {
			await this.$store.dispatch('task/checkOnce', {
				username: this.user.username,
				groupName: this.user.groupNames[0]
			});
		}
		
		if (user.groupNames.length) {
			var tempGroupName = await this.$store.getters ['group/groupName'];
			if (tempGroupName !== '' || tempGroupName !== null)
				await this.$store.dispatch('group/set', user.groupNames[0]);

			await this.$store.dispatch('task/view', true);
			this.taskListView = true;
		} else {
			await this.$store.dispatch('task/view', false);
		}
	},

	methods: {
		async logout() {
			let token = await this.$store.getters ['user/token'];
			let state = await this.$store.dispatch('user/logout', {
				token: token
			});

			if (state) {
				await this.$store.dispatch('task/stopCheck');
				await this.$store.dispatch('settings/redirect', 'LOGIN');
			}
		},

		createGroup() {
			this.createGroupView = true;
			this.createTaskView = false;
			this.taskListView = false;
			this.settingsView = false;
		},
		createTask() {
			this.createGroupView = false;
			this.createTaskView = true;
			this.taskListView = false;
			this.settingsView = false;
		},
		taskList() {
			this.createGroupView = false;
			this.createTaskView = false;
			this.taskListView = true;
			this.settingsView = false;
		},
		settings() {
			this.createGroupView = false;
			this.createTaskView = false;
			this.taskListView = false;
			this.settingsView = true;
		},
		logIt() {
			console.log(this.groupName);//console log pt click pe numele utilizatorului la ce ma-ta vrei
		}	
	}
};

</script>