<template>
	<v-layout column wrap>
		<v-flex xs4>
			{{ value.id }}
		</v-flex>
		<v-flex xs4>
			{{ value.name }}
		</v-flex>
		<v-flex xs4>
			{{ value.priority }}
		</v-flex>
	</v-layout>
</template>

<script lang="ts">
import { wrap } from '../../utils';
import { Api } from '../../api';
import { Todo } from '../..';

export default wrap({
	name: 'ToDo',
	props: ['value'],
	mixins: [Api.mixins.eventBusSubscriber],
	data() {
		return {
			todoList: [] as Todo[],
		};
	},
	async created() {
		const resp = await Api.invokeRaw({
			query: `
				query { 
					todoList {
						id
						name
						priority
					}
				}`,
		});
		this.todoList = Object.freeze(resp.todoList);
	}
});
</script>
