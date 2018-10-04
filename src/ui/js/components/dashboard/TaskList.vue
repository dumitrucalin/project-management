<template>
	<div>
		<select v-if="user.groupNames.length" v-model="groupName" selected="selected">{{ user.groupNames[0] }}
			<option v-for="(groupNameIndex, index) in user.groupNames" :key=index >{{ groupNameIndex }}</option>
		</select>
		<div v-if="showTasks">
			<div v-if="tasks" class="taskList">
				<p>This is the Task View</p>
				<p>Hello Tasker mister fucker mother you</p>
				<div>
					Tasks Received
					<table style="width:100%">
						<tr>
							<th>Task Name</th>
							<th>Task Details</th>
							<th>Creator</th>
							<th>Priority</th>
						</tr>
						<tr v-for="(task,index) in this.tasks.tasksReceived" :key=index>
							<td>{{task.taskName}}</td>
							<td>{{task.taskString}}</td>
							<td>{{task.usernameCreator}}</td>
							<td>{{task.taskPriority}}</td>
						</tr>
					</table>
					<br>Tasks Given
					<table style="width:100%">
						<tr>
							<th>Task Name</th>
							<th>Task Details</th>
							<th>Receiver</th>
							<th>Priority</th>
						</tr>
						<tr v-for="(task,index) in this.tasks.tasksGiven" :key=index>
							<td>{{task.taskName}}</td>
							<td>{{task.taskString}}</td>
							<td>{{task.usernameReceiver}}</td>
							<td>{{task.taskPriority}}</td>
							<td><button @click="deleteTask(task.taskId)">X</button></td>
						</tr>
					</table>
				</div>
			</div>
			<div v-else>
				<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" />
			</div>
		</div>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;
var Loading = require ('../Loading.vue');

module.exports = {
	name: 'TaskList',
	
	data() {
		return {
			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,

			groupName: ''
		};
	},

	components: {
		Loading
	},

	watch: {
		groupName: async function() {
			var taskView = true;
			await this.$store.dispatch ('user/setGroupName', this.groupName);
			await this.$store.dispatch ('user/changeTasksView', taskView);
			var user = await this.$store.dispatch('user/getUser');
			if (user !== null) {
				await this.$store.dispatch('user/stopCheckTasksStatus');

				this.userInfo = {
					username: user.username,
					groupName: this.groupName
				};

				await this.$store.dispatch ('user/checkTasksStatus', this.userInfo);
			}
		}
	},

	methods: {
		async deleteTask(taskId) {
			await this.$store.dispatch('user/deleteTask', taskId);
			var groupName = await this.$store.getters['user/groupName'];
			var userInfo = {
				username: this.user.username,
				groupName: groupName
			};
			await this.$store.dispatch('user/stopCheckTasksStatus');
			await this.$store.dispatch('user/checkTasksStatus', userInfo);
		}
	},

	computed: {
		...mapGetters ({
			user: 'user/user',
			tasks: 'user/tasks',
			showTasks: 'user/showTasks'
		})
	}
};

</script>