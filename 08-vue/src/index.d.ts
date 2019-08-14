import { Component } from 'vue';

export interface Dictionary < T > {
    [index: string]: T;
}

export interface Route {
    name?: string;
    path: string;
    component?: Component;
    label?: string;
    icon?: string;
	redirect?: any;
	beforeEnter?:()=>void;
}

export interface TodoItem {
	id: number;
	name: string;
	priority: number;
}