

export function profile(thisArg: any, name: string, func: Function):Function {
    return (...args: any[]) => {
        let start = Date.now();
        let rtn = func.apply(thisArg, args);
        console.log(`${((Date.now() - start) / 1000).toFixed(3)} seconds spent performing ${name}.`);
        return rtn;
    }
}

import Vue from 'vue';
import { ThisTypedComponentOptionsWithArrayProps } from 'vue/types/options';
import { ExtendedVue } from 'vue/types/vue';

export function wrap<Data, Methods, Computed, PropNames extends string = never>
    (options: ThisTypedComponentOptionsWithArrayProps<Vue, Data, Methods, Computed, PropNames>):
    ExtendedVue<Vue, Data, Methods, Computed, Record<PropNames, any>> {
    if ('computed' in options) {
        Object.keys(options.computed as any)
            .filter((key:string) => !(key in blacklist.computed))
            .forEach((key: string) => {
                const f: Function = (options.computed as any)[key] as any as Function;
                (options.computed as any)[key] = function (...args: any[]) {
                    const start = Date.now();
                    const rtn = f.apply(this, args);
                    console.log(`${((Date.now() - start) / 1000).toFixed(3)} seconds spent performing ${options.name}.computed.${key}`);
                    return rtn;
                };
            });
    }
    if ('methods' in options) {
        Object.keys(options.methods as any)
            .filter((key:string) => !(key in blacklist.methods))
            .forEach((key: string) => {
                const f: Function = (options.methods as any)[key] as any as Function;
                (options.methods as any)[key] = function (...args: any[]) {
                    const start = Date.now();
                    const rtn = f.apply(this, args);
                    console.log(`${((Date.now() - start) / 1000).toFixed(3)} seconds spent performing ${options.name}.methods.${key}`);
                    return rtn;
                };
            });
    }
    if ('created' in options) {
        const f: Function = options.created as any as Function;
        options.created = function (...args: any[]) {
            const start = Date.now();
            const rtn = f.apply(this, args);
            console.log(`${((Date.now() - start) / 1000).toFixed(3)} seconds spent performing ${options.name}.created`);
            return rtn;
        };
    }
    return Vue.extend(options);
}
