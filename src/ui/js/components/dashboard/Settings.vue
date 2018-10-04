<template>
	<div>
		<div v-if="user">
			Your email is {{ user.email }}<br>
			Your fullName is {{ user.fullName }}<br>
			<button v-if="!changeInfo" @click="changeInfo = true">Change personal info</button>
			<div v-if="changeInfo">
				<input type="text" class="inputDesign" placeholder="Full Name" v-model="fullName" />
				<input type="text" class="inputDesign" placeholder="E-Mail" v-model="email" />
				<button class="submitButton" name="Submit" @click="submitInfo" >Submit</button>
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
var validator = require('validator');

module.exports = {
	name: 'Settings',

	data() {
		return {
			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,

			fullName: '',
			email: '',

			changeInfo: false
		};
	},

	components: {
		Loading
	},

	methods: {
		async submitInfo() {
			if (validator.isEmail(this.email, ['en-US'])) {
				var userInfo = {
					username: this.user.username,
					fullName: this.fullName,
					email: this.email
				};
				let updated = await this.$store.dispatch ('user/updateUserInfo', userInfo);
				if (updated) {
					await this.$store.dispatch ('settings/redirect', 'DASHBOARD');
				}
			} else {
				this.fullName = '';
				// TOAST FOR INCORRECT EMAIL
			}
		}
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	}
};

</script>
