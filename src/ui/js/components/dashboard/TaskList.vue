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
						<th @click="consolelogit">Tasks Recieved</th>
						<th>Tasks Given</th>
					</tr>

					<tr>
						<table>
							<tr>
								<h4>Not Assigned to anyone</h4>
							</tr>
							<tr>
								<td>
									<table v-for="(task,index) in this.tasks.tasksReceived" :key=index v-if="task.taskStatus=='Not yet assigned'">
										<tr>
											<th>Giver</th>
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
											<td v-if="user.username" @click="changeTaskStatus(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">{{ task.taskStatus }}</td>
											<td v-if="task.taskDeadline">{{ task.taskDeadline }}</td>
											<td v-if="task.taskPriority">{{ task.taskPriority }}</td>
											<td><button @click="deleteTaskId(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">X</button></td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<h4>Your Tasks</h4>
							</tr>
							<tr>
								<td>
									<table v-for="(task,index) in this.tasks.tasksReceived" :key=index v-if="(task.taskStatus === 'Not yet started' || task.taskStatus === 'In progress') && task.usernamesReceiver[0] === user.username">
										<tr>
											<th>Giver</th>
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
											<td v-if="user.username" @click="changeTaskStatus(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">{{ task.taskStatus }}</td>
											<td v-if="task.taskDeadline">{{ task.taskDeadline }}</td>
											<td v-if="task.taskPriority">{{ task.taskPriority }}</td>
										</tr>
									</table>	
								</td>
							</tr>
							<tr>
								<h4>Finished</h4>
							</tr>
							<tr>
								<td>
									<table v-for="(task,index) in this.tasks.tasksReceived" :key=index v-if="task.taskStatus=='Finished' && task.usernamesReceiver[0] === user.username">
										<tr>
											<th>Giver</th>
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
											<td v-if="user.username" @click="changeTaskStatus(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">{{ task.taskStatus }}</td>
											<td v-if="task.taskDeadline">{{ task.taskDeadline }}</td>
											<td v-if="task.taskPriority">{{ task.taskPriority }}</td>
											<td><button @click="deleteTaskId(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">X</button></td>
										</tr>
									</table>	
								</td>
							</tr>
							<tr>
								<h4>Not yours</h4>
							</tr>
							<tr>
								<td>
									<table v-for="(task,index) in this.tasks.tasksReceived" :key=index v-if="task.usernamesReceiver[0] !== user.username && task.taskStatus !== 'Not yet assigned'">
										<tr>
											<th>Giver</th>
											<th>Task Name</th>
										</tr>
										<tr>
											<td>{{ task.usernameCreator }}</td>
											<td>{{ task.taskName }}</td>
											<td>The task has been assigned to someone else</td>
											<td><button @click="deleteTaskId(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">X</button></td>
										</tr>
									</table>	
								</td>
							</tr>
						</table>

						<td>
							<table v-for="(task,index) in this.tasks.tasksGiven" :key=index >
								<tr>
									<th>Receiver</th>
									<th>Task Name</th>
									<th>Task Details</th>
									<th>Task Status</th>
									<th v-if="task.taskDeadline">Deadline</th>
									<th v-if="task.taskPriority">Priority</th>
								</tr>
								<tr>
									<td><p v-for="(user,index) in task.usernamesReceiver" :key=index>{{ user }}</p></td>
									<td>{{ task.taskName }}</td>
									<td>{{ task.taskString }}</td>
									<td v-if="user.username">{{ task.taskStatus }}</td>
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

	async created() {
		if (this.user.groupNames.length) {
			for (let groupNameTemp of this.user.groupNames)
				this.groupNamesSorted.push(groupNameTemp);

			this.groupNamesSorted = this.groupNamesSorted.sort();
			var tempGroupName = await this.$store.getters ['group/groupName'];
			if (tempGroupName !== this.groupName)
				this.groupName = tempGroupName;
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
				await this.$store.dispatch('task/checkOnce', {
					username: this.user.username,
					groupName: this.groupName
				});
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

				var otherState = await this.$store.dispatch('task/assign', {
					taskId: taskId,
					usernameCreator: usernameCreator,
					usernamesReceiver: [this.user.username],
					groupName: this.groupName,
					usernamesToDelete: usernamesToDelete
				});

				if (otherState)
					taskStatus = 'Not yet started';
			}

			let state = await this.$store.dispatch('task/change', {
				taskId: taskId, 
				taskStatus: taskStatus,
				usernameCreator: usernameCreator,
				groupName: this.groupName
			});

			if (state) {
				if (taskStatus === 'Finished' || (usernamesReceiver.length === 1 && usernamesReceiver[0] !== this.user.username))
					this.deleteTaskIdView = true;

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
			} else if (taskStatus == 'Not yet started' || taskStatus == 'In progress') {
				await this.$store.dispatch('task/deleteId', {
					taskId: taskId, 
					groupName: this.groupName, 
					username: this.user.username
				});
			} else if (taskStatus === 'Not yet assigned') {
				var newUsernamesReceiver = [];
				for (let username of usernamesReceiver) {
					if (username !== this.user.username)
						newUsernamesReceiver.push(username);
				}

				let state = await this.$store.dispatch('task/receivers', {
					taskId: taskId,
					usernamesReceiver: newUsernamesReceiver,
					usernameCreator: usernameCreator,
					groupName: this.groupName
				});

				if (state) {
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
		},
		
		consolelogit(){
			console.log(this.taks.tasksReceived);
		}
	}
};

</script>