<template>
	<v-container grid xs4>
		<v-flex xs6>
			<span> todo app </span>
		</v-flex>
	</v-container>
</template>

<script lang="ts">
	import { wrap } from "../utils";
	import CreateProjectButton from '../components/controls/CreateProjectButton.vue';
	export default wrap({
		data() {
			return {
				loaded: false,
			};
		},
	});
</script>