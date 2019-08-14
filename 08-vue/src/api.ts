import axios, {AxiosPromise, AxiosResponse} from 'axios';
import Vue from 'vue';
import {store} from './store';
import i18next from 'i18next';

export const Axios = axios.create({ // baseURL: window.location.origin+'/app/graphql',
    baseURL: window.location.protocol + '//' + window.location.hostname + '/app/graphql',
    timeout: 180000,
    headers: {}
});

export const Api = {
    post(args : any): Promise<AxiosResponse<any>> {
        if (args.variables) {
            const nullify = (item : any) : any => {
                if (typeof item === 'string') {
                    return item.length === 0 ? null : item;
                } else if (typeof item === 'object' && item !== null && item !== undefined) {
                    for (let key of Object.keys(item)) 
                        item[key] = nullify(item[key]);
                    
                    return item;
                }
                return item;
            }
            args.variables = nullify(args.variables);
        }
        store.commit('trackNetworkRequest', 1);
        return new Promise((resolve : Function, reject : Function) => {
            Axios.post('/', args).then((resp) => {
                store.commit('trackNetworkRequest', -1);
                if ("errors" in resp.data) {
                    reject(resp);
                } else {
                    resolve(resp);
                }
            }).catch(e => {
                store.dispatch('snackbar', i18next.t('errors.networkError'));
                store.commit('trackNetworkRequest', -1);
                reject(e);
            });
        });
    },

    reconnect(): Promise<AxiosResponse<any>> {
        return this.post(
            {query: `
                query {
                    reconnect
                }
            `}
        )
    },

    invoke(data : {
        query: string,
        variables?: any,
        operationName?: any
    }): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.post({query: data.query, variables: data.variables, operationName: data.operationName}).then((resp : any) => resolve(resp.data.data));
            }
        )
    },

    eventBus: new Vue(),

    mixins: {
        eventBusSubscriber: {
            created() {
                Api.eventBus.$on('refresh', this.refresh);
                this.refresh();
            },
            destroyed() {
                Api.eventBus.$off('refresh', this.refresh);
            },
            methods: {
                async refresh() {}
            }
        },
        mutations: {
            methods: {
				async $_createTodo(name: string, priority: number) {
					await Api.invoke({
						query: `
							mutation($name: String!, $priority: Int!) {
								createTodo(name: $name, priority: $priority)
							}`,
						variables: {name, priority}
					});
					store.dispatch('snackbar', this.$t('common.creationSuccess')),
					Api.eventBus.$emit('refresh');
				},
				async $_deleteTodo(id: number) {
					await Api.invoke({
						query: `
							mutation($id: Int!) {
								deleteTodo(id: $id)
							}`,
						variables: {id}
					});
					store.dispatch('snackbar', this.$t('common.deletionSuccess')),
					Api.eventBus.$emit('refresh');
				},
				async $_updateTodo(id: number, name: string, priority: number) {
					await Api.invoke({
						query: `
							mutation($id: Int!, name: String!, priority: Int!) {
								updateTodo(id: $id, name: $name, priority: $priority)
							}`,
						variables: {id,name,priority},
					});
					store.dispatch('snackbar', this.$t('common.updateSuccess')),
					Api.eventBus.$emit('refresh');
				}
            }
        }
    }
}
