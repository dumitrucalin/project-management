<template>
	<div>
		<div class="cli">
			<p>Here you will input your CLI ID</p>
			<input type="text" class="cliIdDesign" placeholder="CLI ID" @keyup.enter="cliConfirm" v-model="cliId" />
			<button class="submitButton" name="Submit" value="Login"  @click="cliConfirm">Submit</button>
		</div>
		<div v-if="cliShow">
			<div v-if="!cliType">
				<p>The cli is incorrect</p>
			</div>
			<div v-else>
				<p>The cli is correct</p>
			</div>
		</div>
	</div>
</template>

<script>

module.exports = {
	name: 'Vm',

	data() {
		return {
			cliId: '',
			cliType: true,
			cliShow: false,
			correctCli: true
		};
	},

	// data: {
	// 	cliId: '',
	// 	cliType: false
	// },

	methods: {
		cliConfirm () {
			// let correctCli = await this.$store.dispatch ('users/cli', {
			// 	cliId: this.cliId
			// });

			//delete next if and uncomment the let above
			if (this.cliId === '1234')
				this.correctCli = true;
			else
				this.correctCli = false;

			if (this.correctCli) {
				this.cliType = true;
				console.log('Correct cli');
			} else {
				this.cliType = false;
				console.log('False cli: ' + this.cliId);
			}
			this.cliShow = true;
		}
	}
};

</script>