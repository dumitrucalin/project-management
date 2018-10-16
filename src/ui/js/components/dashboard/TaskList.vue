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
				<div v-for="(fullName, index) in this.fullNamesShowed" :key=index>
					<div>{{ fullName }}</div>
					<div>{{ usersBasicInfo[fullName] }}</div><br>
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
											<td v-if="user.username" @click="changeTaskStatus(task)">{{ task.taskStatus }}</td>
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
											<td v-if="user.username" @click="changeTaskStatus(task)">{{ task.taskStatus }}</td>
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
									<table v-for="(task,index) in this.tasks.tasksReceived" :key=index v-if="(task.taskStatus === 'Finished' && task.usernamesReceiver[0] === user.username) || task.taskStatus === 'Deleted'">
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
											<td v-if="user.username" @click="changeTaskStatus(task)">{{ task.taskStatus }}</td>
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
									<table v-for="(task,index) in this.tasks.tasksReceived" :key=index v-if="task.usernamesReceiver[0] !== user.username && task.taskStatus !== 'Not yet assigned' && task.taskStatus !== 'Deleted'">
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
									<td v-if="user.username" @click="changeTaskStatus(task)">{{ task.taskStatus }}</td>
									<td v-if="task.taskDeadline">{{ task.taskDeadline }}</td>
									<td v-if="task.taskPriority">{{ task.taskPriority }}</td>
									<td><button @click="deleteTaskId(task.taskId, task.taskStatus, task.usernamesReceiver, task.usernameCreator)">X</button></td>
								</tr>
								<div v-if="reassignView">
									<button @click="reassign(task)">Reassign</button>
								</div>
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
var Vue = require('vue');

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
			reassignView: false,
			taskDeadline: null,
			taskPriority: '',
			taskUsers: [],

			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,

			wrongUsername: {
				title: 'Create Task: Fail',
				message: 'You must select a user to give the task to.',
				type: 'warning'
			}
		};
	},

	computed: {
		...mapGetters({
			user: 'user/user',
			usersBasicInfo: 'group/usersBasicInfo',
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
			if (tempGroupName !== this.groupName && tempGroupName)
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
				var fullNames = Object.keys(this.usersBasicInfo);
				for (let fullName of fullNames) {
					if (fullName !== this.user.fullName)
						this.fullNamesShowed.push (fullName);
				}
				this.fullNamesShowed = this.fullNamesShowed.sort();

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
		async changeTaskStatus(task) {
			if (task.usernamesReceiver.includes(this.user.username)) {
				if (task.taskStatus === 'Not yet started') {
					task.taskStatus = 'In progress';
				} else if (task.taskStatus === 'In progress') {
					task.taskStatus = 'Finished';
				} else if (task.taskStatus === 'Not yet assigned') {
					var usernamesToDelete = [];
					for (let username of task.usernamesReceiver) {
						if (username !== this.user.username)
							usernamesToDelete.push(username);
					}

					let state = await this.$store.dispatch('task/assign', {
						taskId: task.taskId,
						usernameCreator: task.usernameCreator,
						usernamesReceiver: [this.user.username],
						groupName: this.groupName,
						usernamesToDelete: usernamesToDelete
					});

					if (state)
						task.taskStatus = 'Not yet started';
				}

				let state = await this.$store.dispatch('task/change', {
					taskId: task.taskId, 
					taskStatus: task.taskStatus,
					usernameCreator: task.usernameCreator,
					groupName: this.groupName
				});

				if (state) {
					if (task.taskStatus === 'Finished' || (task.usernamesReceiver.length === 1 && task.usernamesReceiver[0] !== this.user.username))
						this.deleteTaskIdView = true;

					var groupName = await this.$store.getters ['group/groupName'];

					await this.$store.dispatch('task/stopCheck');
					await this.$store.dispatch('task/check', {
						username: this.user.username,
						groupName: groupName
					});
				}
			} else if (task.taskStatus === 'Reassign' && task.usernameCreator === this.user.username) {
				this.taskPriority = task.taskPriority;
				this.taskDeadline = task.taskDeadline;
				this.reassignView = true;
			}
		},

		async deleteTaskId(taskId, taskStatus, usernamesReceiver, usernameCreator) {
			if(usernameCreator === this.user.username && usernamesReceiver[0] !== this.user.username) {
				let state = await this.$store.dispatch('task/change', {
					taskId: taskId, 
					taskStatus: 'Deleted',
					usernameCreator:usernameCreator,
					groupName: this.groupName
				});

				if (state) {
					await this.$store.dispatch('task/deleteId', {
						taskId: taskId, 
						groupName: this.groupName, 
						username: this.user.username
					});
				}
			} else if (taskStatus === 'Finished') {
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
			} else if (taskStatus === 'Deleted') {
				await this.$store.dispatch('task/deleteId', {
					taskId: taskId, 
					groupName: this.groupName, 
					username: this.user.username
				});
			}

			var groupName = await this.$store.getters ['group/groupName'];

			await this.$store.dispatch('task/stopCheck');
			await this.$store.dispatch('task/check', {
				username: this.user.username,
				groupName: groupName
			});
		},

		async reassign(task) {
			var taskStatus = '';
			if (this.taskUsers.length === 1)
				taskStatus = 'Not yet started';
			else
				taskStatus = 'Not yet assigned';

			if (this.taskUsers.length !== 0) {
				await this.$store.dispatch('task/delete', {
					taskId: task.taskId,
					groupName: this.groupName
				});

				await this.$store.dispatch('task/create', {
					usernameCreator: this.user.username,
					usernamesReceiver: this.taskUsers,
					groupName: this.groupName,
					taskName: task.taskName,
					taskString: task.taskString,
					taskDeadline: this.taskDeadline,
					taskPriority: this.taskPriority,
					taskStatus: taskStatus
				});

				this.taskUsers = [];
				this.taskDeadline = null;
				this.taskPriority = '';
			} else {
				Vue.toast.customToast(this.wrongUsername);
			}

			this.reassignView = false;
		},
		
		consolelogit(){
			console.log(this.taks.tasksReceived);
		}
	}
};

</script>