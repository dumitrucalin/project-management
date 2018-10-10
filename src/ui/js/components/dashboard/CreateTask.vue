<template>
	<div class="createTask">
		This is the task creator!<br>
		Hello {{ this.user.fullName }}<br>
		This is the task creator!<br>

		<div>
			<div class="form-group">
				<input id="task-Title" type="text" class="form-control input-sm chat-input"  placeholder="Task Title" v-model="taskName" />
			</div>

			<div class="form-group">
				<textarea name="message" rows="10" cols="30" v-model="taskString">Input your task.</textarea>
			</div>

			<div id="options">
				<select v-model="groupName">
					<div>Group</div>
					<option v-for="(item, index) in this.groupNamesSorted" :key="index" :value="item" >{{ item }}</option>
				</select><br>

				<select v-if="groupName" v-model="usernameTask" >
					<option v-for="(username, index) in this.usernamesSorted" :key=index :value="username">{{ username }}</option>
				</select>
				<ul>
					<li v-for="(taskUserShow, index) in taskUsersShow" :key="index">
						<p>{{ taskUserShow }}</p>
					</li>
				</ul>
				<button @click="addUserTask">Add User</button><br>

				DeadLine
				<input type="checkbox" @click="checkboxDeadline = !checkboxDeadline;">
				<input type="date" v-model="taskDeadline" name="Deadline" v-if="checkboxDeadline"><br>

				Priority
				<input type="checkbox" @click="checkboxPriority = !checkboxPriority">
				<select v-if="checkboxPriority" v-model="taskPriority">
					<option name="Urgent" value="urgent">Urgent</option>
					<option name="Moderate" value="moderate">Moderate</option>
					<option name="At leisure" value="atLeisure">At leisure</option>
				</select><br>

				<button @click="submitTask">Create Task</button>
			</div>
		</div>
	</div>
</template>

<script>

var mapGetters = require('vuex').mapGetters;
var Vue = require('vue');

module.exports = {
	name: 'CreateTask',
	
	data() {
		return {
			checkboxPriority: false,
			checkboxDeadline: false,
			groupNamesSorted: [],
			usernamesSorted: [],

			groupName: '',
			taskName: '',
			taskString: '',
			taskPriority: '',
			taskDeadline: null,
			taskStatus: '',

			usernameTask: '',
			taskUsers: [],
			taskUsersShow: [],

			days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December'],
			hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],

			wrongGroupName: {
				title: 'Create Task: Fail',
				message: 'You must select a group.',
				type: 'warning'
			},
			wrongTaskName: {
				title: 'Create Task: Fail',
				message: 'You must write a task name.',
				type: 'warning'
			},
			wrongTaskString: {
				title: 'Create Task: Fail',
				message: 'You must have a task description.',
				type: 'warning'
			},
			wrongUsername: {
				title: 'Create Task: Fail',
				message: 'You must select a user to give the task to.',
				type: 'warning'
			},
			allreadyAdded: {
				title: 'Checking the Username: Fail',
				message: 'The user is already in the group.',
				type: 'warning'
			},
			userCreatorIs: {
				title: 'Checking the Username: Fail',
				message: 'You are already in the group.',
				type: 'warning'
			},
			onlyCreatorUser: {
				title: 'Checking the Username: Fail',
				message: 'For a task, you can either put yourself or other users.',
				type: 'warning'
			}
		};
	},

	computed: {
		...mapGetters({
			user: 'user/user',
			usernames: 'group/usernames'
		}),
		
	},

	async created() {
		this.usernamesReceiver = [];

		for (let groupName of this.user.groupNames)
			this.groupNamesSorted.push(groupName);
		this.groupNamesSorted = this.groupNamesSorted.sort();

		for (let username of this.usernames)
			this.usernamesSorted.push(username);
		this.usernamesSorted = this.usernamesSorted.sort();

		await this.$store.dispatch('task/stopCheck');
	},

	watch: {
		groupName: async function() {
			await this.$store.dispatch('group/users', this.groupName);
			this.taskUsersShow = [];
			this.taskUsers = [];
			this.usernamesSorted = [];
			for (let username of this.usernames) {
				this.usernamesSorted.push(username);
			}

			this.usernamesSorted = this.usernamesSorted.sort();
		}
	},

	methods: {
		async submitTask() {
			if(this.taskName) {	
				if(this.taskString) {
					if(this.groupName) {
						if(this.taskUsers.length !== 0) {
							if (this.taskUsers.length === 1)
								this.taskStatus = 'Not yet started';
							else
								this.taskStatus = 'Not yet assigned';

							await this.$store.dispatch('task/create', {
								usernameCreator: this.user.username,
								usernamesReceiver: this.taskUsers,
								groupName: this.groupName,
								taskName: this.taskName,
								taskString: this.taskString,
								taskDeadline: this.taskDeadline,
								taskPriority: this.taskPriority,
								taskStatus: this.taskStatus
							});
						} else {
							Vue.toast.customToast(this.wrongUsername);
						}
					} else {
						Vue.toast.customToast(this.wrongGroupName);
					}
				} else {
					Vue.toast.customToast(this.wrongTaskString);
				}
			} else {
				Vue.toast.customToast(this.wrongTaskName);
			}	
		},

		async addUserTask() {
			if(!this.taskUsers.includes(this.usernameTask)) {
				if (!this.taskUsers.includes(this.user.username)) {
					if (this.taskUsers.length === 0 || this.usernameTask !== this.user.username) {
						let state = await this.$store.dispatch('user/check', this.usernameTask);

						if (state) {
							this.taskUsersShow.push(this.usernameTask);
							this.taskUsers.push(this.usernameTask);
						}
					} else {
						Vue.toast.customToast(this.onlyCreatorUser);
					}
				} else {
					Vue.toast.customToast(this.onlyCreatorUser);
				}
			} else {
				Vue.toast.customToast(this.allreadyAdded);
			}
		}
	}
};

</script>