import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import 'vuetify/dist/vuetify.min.css';

import VueI18Next from '@panter/vue-i18next';
import i18next from 'i18next';
import Vue from 'vue';
import VueDraggableResizable from 'vue-draggable-resizable';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';

import App from './App.vue'

import locales from './locales';
import router from './router';
import { store } from './store';

i18next.init({
    fallbackLng: [
        'en', 'fr'
    ],
    resources: locales as any
})
i18next.changeLanguage('en')

Vue.config.performance = true;
Vue.config.productionTip = true;

Vue.use(VueI18Next);
Vue.use(Vuetify, {
    theme: {
        primary: '#176ca7',
        secondary: '#114f7a',
        accent: colors.lightBlue,
        error: colors.red.accent3
    }
});

Vue.mixin({
    data: function () {
        return {
            get $_currencyFormatter() {
                return new Intl.NumberFormat('en-CA', {
                    style: 'currency',
                    currency: 'CAD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
			},
			get $_numberFormatter() {
                return new Intl.NumberFormat('en-CA', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });
			},
			get $_percentFormatter() {
                return new Intl.NumberFormat('en-CA', {
                    style: 'percent',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });
            }
        }
    }
})

Vue.component('vue-draggable-resizable', VueDraggableResizable);

new Vue({
    router,
    render: h => h(App),
    store,
    i18n: new VueI18Next(i18next)
}).$mount('#app');
