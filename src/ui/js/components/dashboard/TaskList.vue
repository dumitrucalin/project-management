<template>
	<div>
		<select v-if="this.groupNamesSorted.length" v-model="groupName">
			<option v-for="(groupNameIndex, index) in this.groupNamesSorted" :key=index >{{ groupNameIndex }}</option>
		</select>

		<div v-else>
			You are in no group at the moment.<br> Please first create a group or wait for an invitation!
		</div>

		<div v-if="showTasks">
			<div v-if="tasks" class="taskList">
				The users in the same group with you are:
				<div v-for="(username, index) in this.usernamesShowed" :key=index>
					<div>{{ fullNamesShowed[index]}}</div>
					<div>{{ username }}</div><br>
				</div>

				<table>
					<tr>
						<th>Tasks Recieved</th>
						<th>Tasks Given</th>
					</tr>

					<tr>
						<td>
							<table  v-for="(task,index) in this.tasks.tasksReceived" :key=index>
								<tr>
									<th>Creator</th>
									<th>Task Name</th>
									<th>Task Details</th>
									<th>Task Status</th>
									<th v-if="task.taskDeadline">Deadline</th>
									<th v-if="task.taskPriority">Priority</th>
								</tr>
								<tr>
									<td>{{ task.usernameCreator }}</td>
									<td>{{ task.taskName }}</td>
									<td>{{ task.taskString }}</td>
									<td @click="changeTaskStatus(task.taskId, task.taskStatus, task.usernameReceiver, task.usernameCreator)">{{ task.taskStatus }}</td>
									<td v-if="task.taskDeadline">{{ task.taskDeadline }}</td>
									<td v-if="task.taskPriority">{{ task.taskPriority }}</td>
									<td v-if="deleteTaskIdView"><button @click="deleteTaskId(task.taskId, task.taskStatus, task.usernameReceiver, task.usernameCreator)">X</button></td>
								</tr>
							</table>
						</td>

						<td>
							<table v-for="(task,index) in this.tasks.tasksGiven" :key=index>
								<tr>
									<th>Receiver</th>
									<th>Task Name</th>
									<th>Task Details</th>
									<th>Task Status</th>
									<th v-if="task.taskDeadline">Deadline</th>
									<th v-if="task.taskPriority">Priority</th>
								</tr>

								<tr>
									<td>{{ task.usernameReceiver }}</td>
									<td>{{ task.taskName }}</td>
									<td>{{ task.taskString }}</td>
									<td>{{ task.taskStatus }}</td>
									<td v-if="task.taskDeadline">{{ task.taskDeadline }}</td>
									<td v-if="task.taskPriority">{{ task.taskPriority }}</td>
									<td><button @click="deleteTask(task.taskId)">X</button></td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>

			<div v-else>
				<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" />
			</div>
		</div>
	</div>
</template>

<script>

var mapGetters = require('vuex').mapGetters;
var Loading = require('../Loading.vue');

module.exports = {
	name: 'TaskList',

	components: {
		Loading
	},
	
	data() {
		return {
			groupName: '',
			groupNamesSorted: [],
			usernamesShowed: [],
			fullNamesShowed: [],
			editingTask: false,
			deleteTaskIdView: false,

			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500
		};
	},

	computed: {
		...mapGetters({
			user: 'user/user',
			usernames: 'user/usernames',
			fullNames: 'user/fullNames',
			tasks: 'user/tasks',
			showTasks: 'user/showTasks'
		})
	},

	created() {
		if (this.user.groupNames.length) {
			for (let groupNameTemp of this.user.groupNames)
				this.groupNamesSorted.push(groupNameTemp);

			this.groupNamesSorted = this.groupNamesSorted.sort();
			this.groupName = this.groupNamesSorted[0];
		}
	},

	watch: {
		groupName: async function() {
			await this.$store.dispatch('user/setGroupName', this.groupName);

			this.usernamesShowed = [];
			this.fullNamesShowed = [];

			await this.$store.dispatch('user/getUsers', this.groupName);

			for (let username of this.usernames) {
				if (username !== this.user.username)
					this.usernamesShowed.push (username);
			}

			for (let fullName of this.fullNames) {
				if (fullName !== this.user.fullName)
					this.fullNamesShowed.push (fullName);
			}

			await this.$store.dispatch('user/changeTasksView', true);
			await this.$store.dispatch('user/stopCheckTasksStatus');
			// var userInfo = {
			// 	username: this.user.username,
			// 	groupName: this.groupName
			// };
			await this.$store.dispatch('user/checkTasksStatus', {
				username: this.user.username,
				groupName: this.groupName
			});
		}
	},

	methods: {
		async deleteTask(taskId) {
			await this.$store.dispatch('user/deleteTask', taskId);
			var groupName = await this.$store.getters ['user/groupName'];

			// var userInfo = {
			// 	username: this.user.username,
			// 	groupName: groupName
			// };

			await this.$store.dispatch('user/stopCheckTasksStatus');
			await this.$store.dispatch('user/checkTasksStatus', {
				username: this.user.username,
				groupName: groupName
			});
		},

		async changeTaskStatus(taskId, taskStatus, usernameReceiver, usernameCreator) {
			if (taskStatus === 'Not yet started')
				taskStatus = 'In progress';
			else if (taskStatus === 'In progress') {
				taskStatus = 'Finished';
			}

			await this.$store.dispatch('user/changeTaskStatus', {
				taskId: taskId, 
				taskStatus: taskStatus, 
				groupName: this.groupName, 
				usernameReceiver: usernameReceiver, 
				usernameCreator: usernameCreator
			});

			if (taskStatus === 'Finished')
				this.deleteTaskIdView = true;

			var groupName = await this.$store.getters ['user/groupName'];
			// var userInfo = {
			// 	username: this.user.username,
			// 	groupName: groupName
			// };
			await this.$store.dispatch('user/stopCheckTasksStatus');
			await this.$store.dispatch('user/checkTasksStatus', {
				username: this.user.username,
				groupName: groupName
			});
		},

		async deleteTaskId(taskId, taskStatus, usernameReceiver, usernameCreator) {
			if (taskStatus === 'Finished') {
				if (usernameReceiver === usernameCreator) {
					await this.$store.dispatch('user/deleteTask', taskId);
				} else {
					await this.$store.dispatch('user/deleteTaskId', {
						taskId: taskId, 
						groupName: this.groupName, 
						username: usernameReceiver
					});
				}
			} 

			var groupName = await this.$store.getters ['user/groupName'];
			// var userInfo = {
			// 	username: this.user.username,
			// 	groupName: groupName
			// };
			await this.$store.dispatch('user/stopCheckTasksStatus');
			await this.$store.dispatch('user/checkTasksStatus', {
				username: this.user.username,
				groupName: groupName
			});
		}
	}
};

</script>