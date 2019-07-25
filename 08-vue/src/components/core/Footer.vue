<template>
	<v-footer color="primary" app>
		<v-layout row style="height:100%">
			<v-flex xs3 dark>
				<div class="ma-2" style="color:white">
				v0.1.0
				</div>
			</v-flex>
			<v-flex xs2/>
			<v-flex xs2>
				<v-progress-linear  indeterminate :active="activeNetworkRequests>0" color="secondary" />
			</v-flex>
			<v-flex xs2/>
			<v-flex xs3 justify-end>
				<img
				  src="@/assets/img/Transports_Canada.svg"
				  style="float:right; margin-right:10px" 
				  height="36" 
				  width="200"/>
			</v-flex>
		</v-layout>
	</v-footer>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
export default Vue.extend({
	computed: {
		...mapState(["activeNetworkRequests"])
	}
});
</script>

<style scoped>
</style>