import { MainState } from './index';
import Vue from 'vue';
import Vuex, { Module, ModuleTree, ActionTree } from 'vuex';
import { MutationTree, Payload, GetterTree, ActionContext } from 'vuex';
import { Api } from '@/api';
import { AxiosResponse } from 'axios';
import { profile } from '../utils';
const sort = require('fast-sort');
Vue.use(Vuex);

export interface MainState {
    activeNetworkRequests: number;
    darkmode: boolean;
    snackbars: string[];
}

const state = {
    activeNetworkRequests: 0,
    darkmode: false,
    snackbars:[],
} as MainState

const getters = {
} as GetterTree<MainState, MainState>;

const mutations = {
    pushSnackbar: (state: MainState, change: string): void => {
        state.snackbars.push(change);
    },
    popSnackbar: (state: MainState): string | undefined => {
        return state.snackbars.pop();
    },
	trackNetworkRequest: (state: MainState, change: number): number => {
		return state.activeNetworkRequests += change;
	},
	darkmode: (state: MainState, change: boolean): boolean => {
		return state.darkmode = change;
	},
} as MutationTree<MainState>;

const actions = {
    snackbar: (context: ActionContext<MainState,MainState>,payload: string) => {
        context.commit('pushSnackbar', payload);
        setTimeout(function() {
            context.commit('popSnackbar');
        },3000*context.state.snackbars.length);
    },
} as ActionTree<MainState, MainState>;

const modules = {
    //db: import('./db'),
} as ModuleTree<MainState>;

for (let module of Object.keys(modules as any)) {
    for (let process of ['getters', 'mutations', 'actions']) {
        for (let func in (modules as any)[module][process]) {
            (modules as any)[module][process][func] = profile(null, `${module}.${process}.${func}`, (modules as any)[module][process][func]) as any;
        }
    }
}

for (let func in getters) {
    getters[func] = profile(null, `Main.getters.${func}`, getters[func]) as any;
}
for (let func in mutations) {
    mutations[func] = profile(null, `Main.mutations.${func}`, mutations[func]) as any;
}
for (let func in actions) {
    actions[func] = profile(null, `Main.actions.${func}`, actions[func] as any) as any;
}

export const store = new Vuex.Store<MainState>({
    state,
    getters,
    mutations,
    actions,
    modules,
    strict: process.env.NODE_ENV !== 'production'
} as Module<MainState, MainState>);
