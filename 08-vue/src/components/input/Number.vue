<template>
    <v-menu
        lazy
        offset-x
        v-model="showMenu"
        :close-on-content-click="false">
        <template v-slot:activator="{on}">
            <slot v-bind:on="on">
                <v-btn
                    v-on="on">
                    <v-label>
                        {{ display }}
                    </v-label>
                </v-btn>
            </slot>
        </template>
        <v-card>
            <v-layout
                row
                wrap>
                <v-flex xs6>
                    <v-form v-model="valid" @submit="onSubmit(inputNumber)">
                        <v-text-field
                            v-model="input"
                            :value="number"
                            :rules="rules"
                            class="ml-2"
                            :label="$t('common.enterNewValue')" />
                    </v-form>
                </v-flex>
                <v-flex xs2>
                    <v-btn
                        icon
                        large
                        type="submit"
                        @click="onSubmit(inputNumber)">
                        <v-icon>save</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn
                        icon
                        large
                        @click="onCancel">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn
                        icon
                        large
                        @click="onDelete">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
import {
    wrap
} from "@/utils";

export default wrap({
    name: 'Number',
    props: ['number'],
    data() {
        return {
            input: this.number,
            showMenu: false,
            valid: true,
        }
    },
    methods:{
        close() {
            this.showMenu=false;
        },
        onCancel() {
            this.close();
        },
        onSubmit(val:any) {
            if (this.valid) {
                this.$emit('submit', val);
                this.close();
            }
        },
        onDelete() {
            this.$emit('delete', this.number);
            this.close();
        },
    },
    computed: {
        inputNumber(): number {
            return parseFloat(this.input);
        },
        rules():((x:string)=>boolean|string)[] {
            return [
				(x:string) => this.inputNumber >= 0 || this.$t('errors.negative')
			];
        },
        display(): string {
            return this.$data.$_numberFormatter.format(this.number);
        }
    },
});
</script>
