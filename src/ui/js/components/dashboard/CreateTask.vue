<template>
	<div class="createTask">
		<p>This is the task creator!</p>
		<p>Hello {{ this.user.fullName }}</p>
		<p>This is the task creator!</p>
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

				<select v-if="groupName" v-model="usernameReceiver" >
					<option v-for="(username, index) in this.usernamesSorted" :key=index :value="username">{{ username }}</option>
				</select>

				<div>DeadLine</div>
				<input type="checkbox" @click="checkboxDeadline = !checkboxDeadline;">
				<input v-if="checkboxDeadline" type="date" name="DeadLine" v-model="taskDeadline"><br>

				<div>Priority</div>
				<input type="checkbox" @click="checkboxPriority = !checkboxPriority">
				<select v-if="checkboxPriority" v-model="taskPriority">
					<option name="Urgent" value="urgent">Urgent</option>
					<option name="Moderate" value="moderate">Moderate</option>
					<option name="At leisure" value="atLeisure">At leisure</option>
				</select><br>

				<div>Status</div>
				<input type="checkbox" @click="changeStatus = !changeStatus;"><br>

				<button @click="submitTask">Create Task</button>
			</div>
		</div>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;
var Vue = require('vue');

module.exports = {
	name: 'CreateTask',
	
	data() {
		return {
			checkboxPriority: false,
			checkboxDeadline: false,

			groupNamesSorted: [],
			usernamesSorted: [],

			usernameReceiver: '',
			groupName: '',
			taskName: '',
			taskString: '',
			taskDeadline: null,
			taskPriority: '',
			taskStatus: false,

			groupNameNotify: {
				title: 'The group field is needed',
				message: 'You must select you group',
				type: 'warning'
			},
			taskNameNotify: {
				title: 'The task name field is needed',
				message: 'You must write your task name',
				type: 'warning'
			},
			taskStringNotify: {
				title: 'The task body field is needed',
				message: 'You must write something in your task',
				type: 'warning'
			},
			usernameReceiverNotify: {
				title: 'The user reciever field is needed',
				message: 'You must select the recieving user',
				type: 'warning'
			},

		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user',
			usernames: 'user/usernames'
		}),
		
	},

	methods: {
		async submitTask(){
			console.log('hai sa trimitem task-ul');
			if(this.taskName)
			{	
				if(this.taskString)
				{
					if(this.groupName)
					{
						if(this.usernameReceiver)
						{
							let state = await this.$store.dispatch ('user/sendTask', {
								usernameCreator: this.user.username,
								usernameReceiver: this.usernameReceiver,//must exist
								groupName: this.groupName,//musts exist
								taskName: this.taskName,//must exist
								taskString: this.taskString,//must exist
								taskDeadline: this.taskDeadline,
								taskPriority: this.taskPriority,
								taskStatus: this.taskStatus
							});
							if (state)
								console.log('heeeeei');
								//TODO TOAST
						} else {
							Vue.toast.customToast(this.usernameReceiverNotify);
						}
					} else {
						Vue.toast.customToast(this.groupNameNotify);
					}
				} else {
					Vue.toast.customToast(this.taskStringNotify);
				}
			} else {
				Vue.toast.customToast(this.taskNameNotify);
			}
			
		},

	},

	watch: {
		groupName: async function() {
			await this.$store.dispatch('user/getUsers', this.groupName);
		}
	},

	async created() {
		for (let groupName of this.user.groupNames)
			this.groupNamesSorted.push(groupName);
		this.groupNamesSorted = this.groupNamesSorted.sort();

		for (let username of this.usernames)
			this.usernamesSorted.push(username);
		this.usernamesSorted = this.usernamesSorted.sort();
		await this.$store.dispatch('user/stopCheckTasksStatus');
	}
};

</script>