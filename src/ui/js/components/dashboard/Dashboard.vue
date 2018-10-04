<template>
	<div>
		<div v-if="user">
			<div class="dashboard">
				<h3 @click="taskList">This is the dashboard!</h3>
				<p @click="logIt()">Hello {{ this.user.fullName }}</p>
				<button class="submitButton" name="Submit" value="Logout"  @click="logout" >Logout</button>
				<button class="submitButton" name="Submit" value="Create Group" @click="createGroup">Create Group</button>
				<button class="submitButton" name="Submit" value="Create Task" @click="createTask">Create Task</button>
				<select v-model="groupName">
					<option v-for="(groupNameIndex, index) in user.groupNames" :key=index >{{groupNameIndex}}</option>
				</select>
			</div>
			<CreateGroup v-if="createGroupView"></CreateGroup>
			<CreateTask v-if="createTaskView"></CreateTask>
			<TaskList v-if="taskListView"></TaskList>

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
			
			createGroupView: false,
			createTaskView: false,
			taskListView: true,

			groupName: ''
		};
	},

	components: {
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
		createGroup: function() {
			this.createGroupView = true;
			this.createTaskView = false;
			this.taskListView = false;
		},
		createTask: function() {
			this.createGroupView = false;
			this.createTaskView = true;
			this.taskListView = false;
		},
		taskList: function() {
			this.createGroupView = false;
			this.createTaskView = false;
			this.taskListView = true;
		},
		logIt:function(){
			console.log(this.groupName);
		}
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	watch: {
		groupName: async function() {
			var user = await this.$store.dispatch('user/getUser');
			if (user !== null) {
				await this.$store.dispatch('user/stopCheckTasksStatus');

				var userInfo = {
					username: user.username,
					groupName: this.groupName
				};

				await this.$store.dispatch ('user/checkTasksStatus', userInfo);
			}
		}
	},

	async created() {
		var user = await this.$store.dispatch ('user/getUser');
		this.groupName = user.groupNames[0];
	}
};

</script>