<template>
    <div>
        <v-app id="app" :dark="darkmode">
            <navigation />
            <v-content>
                <v-container fluid>
                    <p v-if="updating" style="font-size:72px">Dataset is updating, expect missing entries</p>
                    <router-view/>
                </v-container>
            </v-content>
            <v-snackbar :value="snackbars.length > 0"
                        bottom
                        :timeout="0">
                {{ snackbars[snackbars.length-1] }} {{ snackbars.length>1?`(${snackbars.length-1})`:'' }}
                <!-- <v-btn color="pink"
                       flat
                       @click="onClose">
                    Close
                </v-btn> -->
            </v-snackbar>
            <app-footer />
        </v-app>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState, mapGetters } from 'vuex';
    import Navigation from './components/core/Navigation.vue';
    import Footer from './components/core/Footer.vue';
    
    export default Vue.extend({
        name: 'app',
        data() {
            return {
                updating: false,
            };
        },
        components: {
            Navigation,
            'app-footer':Footer,
        },
        computed: {
            ...mapState(['snackbars', 'darkmode']),
        },
    });
</script>

<style>
    :root {

    }
</style>

<style scoped>
</style>