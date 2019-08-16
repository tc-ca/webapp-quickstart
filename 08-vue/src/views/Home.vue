<template>
	<div>
		<h1>{{ title }}</h1>
		<input v-model="title"/>
		<br/>
		<button @click="count++">{{ $t('common.clickCount',{count}) }}</button>
		<!-- 
			clickCount: 'You\'ve clicked {{ count }} time',
			clickCount_plural: 'You\'ve clicked {{ count }} times'
		 -->
		<br/>
		<button @click="count=0">Reset</button>
	</div>
</template>

<script lang="ts">
import { wrap } from "../utils";

export default wrap({
	name: 'Home',
	data() {
		return {
			title: 'Hello world!',
			count: 12,
		} ;
	},
});
</script>

<style scoped>
h1 {
	color: red;
}
input {
	background-color: white !important;
	border-style: inset !important;
}
button {
	background-color: white;
	border-style: outset !important;
}
</style>
