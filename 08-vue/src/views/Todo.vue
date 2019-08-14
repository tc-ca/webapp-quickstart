<template>
	<v-layout row wrap>
		<v-flex xs12>
			<v-card>
				<v-card-title>
					<v-toolbar flat color="white">
						<v-toolbar-title>{{ $t('common.todo') }}</v-toolbar-title>
						<v-divider class="mx-4" inset vertical />
						<v-btn color="primary" dark class="mb-2">{{ $t('common.add') }}</v-btn>
					</v-toolbar>
				</v-card-title>
				<v-data-table
					:headers="headers"
					:items="todoList"
					class="elevation-1"
					item-key="id"
					:loading="!loaded"
					:search="search"
				>
					<template v-slot:items="props">
						<to-do :item="props.item" />
					</template>
				</v-data-table>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script lang="ts">
import { wrap } from "../utils";
import { TodoItem } from "..";
import { Api } from "../api";
import ToDoSingle from "../components/frames/ToDoSingle.vue";
import CreateProjectButton from "../components/controls/CreateProjectButton.vue";
export default wrap({
	name: "todo-list",
	mixins: [Api.mixins.eventBusSubscriber],
	components: {
		"to-do": ToDoSingle
	},
	data() {
		return {
			loaded: false,
			search: "",
			todoList: [] as TodoItem[],
			headers: [
				{ text: this.$t("common.id"), value: "id" },
				{ text: this.$t("common.name"), value: "name" },
				{ text: this.$t("common.priority"), value: "priority" }
			]
		};
	},
	async created() {
		const resp = await Api.invoke({
			query: `
					query { 
						todoList {
							id
							name
							priority
						}
					}`
		});
		this.todoList = Object.freeze(resp.todoList);
		this.loaded = true;
	}
});
</script>