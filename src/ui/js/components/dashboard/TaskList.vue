<template>
	<div>
		<select v-if="this.groupNamesSorted.length" v-model="groupName">
			<option v-for="(groupNameIndex, index) in this.groupNamesSorted" :key=index >{{ groupNameIndex }}</option>
		</select>

		<div v-else>
			You are in no group at the moment.<br> Please first create a group or wait for an invitation!
		</div>

		<div v-if="show">
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
									<td @click="changeTaskStatus(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">{{ task.taskStatus }}</td>
									<td v-if="task.taskDeadline">{{ task.taskDeadline }}</td>
									<td v-if="task.taskPriority">{{ task.taskPriority }}</td>
									<td v-if="deleteTaskIdView"><button @click="deleteTaskId(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">X</button></td>
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
									<td>{{ task.usernamesReceiver[0] }}</td>
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
			usernamesed: [],
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
			usernames: 'group/usernames',
			fullNames: 'group/fullNames',
			tasks: 'task/tasks',
			show: 'task/show'
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
			await this.$store.dispatch('group/set', this.groupName);

			this.usernamesShowed = [];
			this.fullNamesShowed = [];

			let state = await this.$store.dispatch('group/users', this.groupName);

			if (state) {
				for (let username of this.usernames) {
					if (username !== this.user.username)
						this.usernamesShowed.push (username);
				}

				for (let fullName of this.fullNames) {
					if (fullName !== this.user.fullName)
						this.fullNamesShowed.push (fullName);
				}

				await this.$store.dispatch('task/view', true);
				await this.$store.dispatch('task/stopCheck');

				await this.$store.dispatch('task/check', {
					username: this.user.username,
					groupName: this.groupName
				});
			}
		}
	},

	methods: {
		async deleteTask(taskId) {
			let state = await this.$store.dispatch('task/delete', {
				taskId: taskId, 
				groupName: this.groupName
			});

			if (state) {
				var groupName = await this.$store.getters ['group/groupName'];

				await this.$store.dispatch('task/stopCheck');
				await this.$store.dispatch('task/check', {
					username: this.user.username,
					groupName: groupName
				});
			}
		},

		async changeTaskStatus(taskId, taskStatus, usernamesReceiver, usernameCreator) {
			if (taskStatus === 'Not yet started') {
				taskStatus = 'In progress';
			} else if (taskStatus === 'In progress') {
				taskStatus = 'Finished';
			} else if (taskStatus === 'Not yet assigned') {
				var usernamesToDelete = [];
				for (let username of usernamesReceiver) {
					if (username !== this.user.username)
						usernamesToDelete.push(username);
				}

				await this.$store.dispatch('task/assign', {
					taskId: taskId,
					usernameReceiver: this.user.username,
					usernamesToDelete: usernamesToDelete
				});

				// UNCOMMENT WHEN ASSIGN METHOD WORKS
				// if (otherState)
				// 	taskStatus = 'Not yet started';
			}

			let state = await this.$store.dispatch('task/change', {
				taskId: taskId, 
				taskStatus: taskStatus, 
				groupName: this.groupName, 
				usernamesReceiver: usernamesReceiver, 
				usernameCreator: usernameCreator
			});

			if (state) {
				if (taskStatus === 'Finished') {
					this.deleteTaskIdView = true;
				}

				var groupName = await this.$store.getters ['group/groupName'];

				await this.$store.dispatch('task/stopCheck');
				await this.$store.dispatch('task/check', {
					username: this.user.username,
					groupName: groupName
				});
			}
		},

		async deleteTaskId(taskId, taskStatus, usernamesReceiver, usernameCreator) {
			if (taskStatus === 'Finished') {
				if (usernamesReceiver[0] === usernameCreator) {
					await this.$store.dispatch('task/delete', {
						taskId: taskId,
						groupName: this.groupName
					});
				} else {
					await this.$store.dispatch('task/deleteId', {
						taskId: taskId, 
						groupName: this.groupName, 
						username: this.user.username
					});
				}
			} 

			var groupName = await this.$store.getters ['group/groupName'];

			await this.$store.dispatch('task/stopCheck');
			await this.$store.dispatch('task/check', {
				username: this.user.username,
				groupName: groupName
			});
		}
	}
};

</script>