import { getNestedValue } from "./inputStoreUtils";

const expressionCache = new Map();

export function evalExpression(template: string, deps: string[], store: any) {
    let expr = template;

    for (let key of deps) {
        const value = getByPath(store, key);
        expr = expr.replace("${" + key + "}", JSON.stringify(value));
    }


    try {
        return Function(`"use strict"; return (${expr});`)();
    } catch (e) {
        return false;
    }
}

type CompiledExpression = {
    deps: string[]
    evaluate: (data: Record<string, any> | null) => boolean
}

const expressionCacheNew = new Map<string, CompiledExpression>()


export function compileExpression(expr: string): CompiledExpression {
    if (expressionCacheNew.has(expr)) {
        return expressionCacheNew.get(expr)!
    }

    const deps: string[] = []

    const jsExpr = expr.replace(/\$\{(.*?)\}/g, (_, key) => {
        deps.push(key)
        return `get(data, "${key}")`;
        // return `data["${key}"]`
    })


    const fn = new Function(
        'data',
        'get',
        `try { return Boolean(${jsExpr}) } catch { return false }`
    ) as (data: any, get: (obj: any, path: string) => any) => boolean

    const compiled = {
        deps,
        evaluate: (data: any) => fn(data, getNestedValue)
    }
    //   const compiled = { deps, evaluate: fn }
    expressionCacheNew.set(expr, compiled)
    return compiled
}


export function getByPath(obj: any, path: string) {
    return path.split(".").reduce((acc, key) => {
        if (!acc) return undefined;
        return acc[key];
    }, obj);
}

export function parseExpression(expr: string): { deps: string[], template: string } {
    if (expressionCache.has(expr)) return expressionCache.get(expr);

    const regex = /\$\{([^}]+)\}/g;
    const deps = [];
    let template = expr;

    let match;
    while ((match = regex.exec(expr))) {
        const dep = match[1].trim();
        deps.push(dep);
    }

    const result = { deps, template };
    expressionCache.set(expr, result);
    return result;
}