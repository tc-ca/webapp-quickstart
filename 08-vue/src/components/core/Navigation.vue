<template>
	<v-content fluid>
		<v-flex xs12 id="langbar">
			<v-layout row justify-end>
				<v-flex justify-start shrink>
					<v-btn icon dark @click="$store.commit('darkmode', !darkmode)">
						<v-icon>lightbulb</v-icon>
					</v-btn>
				</v-flex>
				<v-flex justify-start shrink>
					<v-btn icon dark :to="{name: 'GraphQL'}" target="_blank">
						<v-icon>scatter_plot</v-icon>
					</v-btn>
				</v-flex>
				<v-spacer/>
				<v-flex
					shrink
					v-for="l of locales"
					:key="l.code"
					:class="{selected:$i18n.i18next.language===l.code}"
				>
					<v-btn flat dark @click="$i18n.i18next.changeLanguage(l.code)">{{ l.name }}</v-btn>
				</v-flex>
			</v-layout>
		</v-flex>
		<v-flex xs12 id="titlebar" pa-1>
			<div>{{$t('common.appname')}} - {{ $t((routes.find(route => route.name === $route.name)||{label:''}).label) }}</div>
		</v-flex>
		<v-flex xs12 id="navbar">
			<v-layout row justify-start>
				<v-flex shrink dark v-for="route of navRoutes" :key="route.name">
					<v-btn flat dark :to="{name: route.name}" label="asd">
						<v-icon class="mr-1">{{ route.icon }}</v-icon>
						{{ $t(route.label) }}
					</v-btn>
				</v-flex>
			</v-layout>
		</v-flex>
	</v-content>
</template>

<script lang="ts">
import Vue from "vue";
import { routes } from "../../router";
import { Route } from "../..";
import { Api } from "../../api";
import Locales from "../../locales";
import { wrap } from "../../utils";
import { mapState } from "vuex";

export default wrap({
	data() {
		return {
			drawer: false,
			routes
		};
	},
	computed: {
		navRoutes(): Route[] {
			return routes.filter(r => "label" in r && "icon" in r);
		},
		locales(): { code: string; name: string }[] {
			return Object.keys(Locales)
				.filter((key: string) => key !== "common")
				.map((key: string) => ({
					code: key,
					name: this.$t(`langs.${key}`, {lng: "common"}),
				}));
		},
		...mapState(["darkmode"])
	}
});
</script>

<style scoped>
#langbar {
	background-color: #474747;
	border-bottom: 1px solid white;
}

#langbar .v-btn {
	height: 100%;
	margin: 0;
}

#langbar > .layout {
	min-height: 2.2em;
}

.selected {
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAYAAAB8ZH1oAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAB90RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgOLVo0ngAAAA6SURBVAiZY/z//z8DMvj14+s+BgYGBjYObicUif///8Pxz+9f9v2HAigbLodVETbFOBWhK8arCFkxABifl5syjffvAAAAAElFTkSuQmCC)
		no-repeat scroll center bottom;
	color: #ccc;
	display: block;
}

#langbar > * > *:last-child {
	border-left: 1px solid #777;
}

#titlebar {
	background-image: linear-gradient(rgb(23, 108, 167), rgb(17, 79, 122));
}

#titlebar > div {
	color: white;
	text-shadow: 1px 1px 1px #333;
	font-size: 1.9em;
}

#navbar {
	background-color: #0e4164;
}
</style>
