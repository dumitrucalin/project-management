<template>
	<div class="createTask">
		<p>This is the task creator!</p>
		<p>Hello {{ this.user.fullName }}</p>
		<p>This is the task creator!</p>
		<form>
			<div class="form-group">
				<input id="task-Title" type="text" class="form-control input-sm chat-input"  placeholder="Task Title" v-model="taskName" />
			</div>
			<div class="form-group">
				<textarea name="message" rows="10" cols="30" v-model="taskString">Input your task.</textarea>
			</div>
				<form id="options">
					<select v-model="groupName" @click="getUsers()">
					<div>Group</div><option v-for="(item, index) in this.user.groupNames" :key="index" :value="item" >{{item}}</option>
					</select><br>

					<select v-if="groupName" v-model="usernameReceiver" >
						<option v-for="(user,index) in this.users" :key=index :value="user">{{user}}</option>
					</select>

					<div>DeadLine</div><input type="checkbox" @click="changeDeadline()">
					<input v-if="checkboxDeadline" type="date" name="DeadLine"><br>

					<div>Status</div><input type="checkbox" @click="changeStatus()">
					<select v-if="checkboxStatus" v-model="taskPriority">
						<option name="Urgent" value="urgent">Urgent</option>
						<option name="Moderate" value="moderate">Moderate</option>
						<option name="At leisure" value="atLeisure">At leisure</option>
					</select>
					<button type="reset" @click="submitTask">Create Task</button>
				</form>
		</form>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;
var Vue = require('vue');

module.exports = {
	name: 'CreateTask',
	
	data() {
		return {
			checkboxStatus: false,
			checkboxDeadline: false,
			usernameCreator:'',
			usernameReceiver:'',
			groupName:'',
			taskName:'',
			taskString:'',
			taskPriority:'',
			users:[],
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
		}),
		
	},

	methods: {
		changeDeadline: function() {
			this.checkboxDeadline = !this.checkboxDeadline;
		},
		changeStatus: function() {
			this.checkboxStatus = !this.checkboxStatus;
		},
		async submitTask(){
			if(this.taskName)
			{	
				if(this.taskString)
				{
					if(this.groupName)
					{
						if(this.usernameReceiver)
						{
							await this.$store.dispatch ('user/sendTask', {
								usernameCreator:this.user.username,
								usernameReceiver:this.usernameReceiver,//must exist
								groupName:this.groupName,//musts exist
								taskName:this.taskName,//must exist
								taskString:this.taskString,//must exist
								taskPriority:this.taskPriority,
							});
							await this.$store.dispatch('settings/redirect', 'DASHBOARD');
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
		async getUsers(){
			let users = await this.$store.dispatch('user/getUsers',{
				groupName:this.groupName,
			});
			this.users=users;
		}
	},
};

</script>