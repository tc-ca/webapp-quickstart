declare module 'fast-sort';

export default function <T>(items: T[]): {
    asc: (getter?: ((item: T) => any) | ((item: T) => any)[]) => void;
    desc: (getter?: ((item: T) => any) | ((item: T) => any)[]) => void;
    by: (getterList: {
        asc?: ((item: T) => any),
        desc?: ((item: T) => any),
    }[]) => void;
}