<template>
	<tr>
		<td>
			{{ item.id }}
		</td>
		<td>
			<v-text-field :value="item.name"
			@change="n => $_updateTodo(item.id, n, item.priority)"/>
		</td>
		<td>
			<number :number="item.priority"
					@submit="n => $_updateTodo(item.id, item.name, n)"
					@delete="$_deleteTodo(item.id)"/>
		</td>
	</tr>
</template>

<script lang="ts">
import { wrap } from '../../utils';
import { Api } from '../../api';
import Number from '../input/Number.vue';

export default wrap({
	name: 'ToDo',
	props: ['item'],
	mixins: [Api.mixins.mutations],
	components: {
		Number,
	},
});
</script>
