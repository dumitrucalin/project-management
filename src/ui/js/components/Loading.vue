<template>
	<div class="d-flex h-100 w-100 justify-content-center align-items-center">
		<looping-rhombuses-spinner
			:rhombus-size="size"
			:color="color"
			:animation-duration="duration"
		/>
	</div>
</template>

<script>

var LoopingRhombusesSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').LoopingRhombusesSpinner;

module.exports = {
	name: 'Loading',

	props: [
		'size',
		'color',
		'duration'
	],

	components: {
		LoopingRhombusesSpinner
	}
};

</script>