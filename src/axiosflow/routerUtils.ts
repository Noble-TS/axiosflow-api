import { Router, RequestHandler } from 'express';
import { getRegisteredRoutes } from './metadata';

/**
 * Infer type properties to expose types for client without needing to write types for API functions.
 * @param name
 * @returns name, properties
 */
export function typeRef<T extends object>(name: string, propertiesOverride?: Record<string, string>): { name: string, properties: Record<string, string> } {
    const properties: Record<string, string> = propertiesOverride || {};
    if (!propertiesOverride) {
        const keys = Object.keys({} as T) as Array<keyof T>;
        keys.forEach(key => {
            const type = typeof ({} as T)[key];
            properties[key as string] = type === 'number' ? 'number' : type === 'string' ? 'string' : type === 'boolean' ? 'boolean' : 'any';
            console.log(`Property: ${key as string}, Type: ${properties[key as string]}`);
        });
    }
    return {
        name,
        properties
    };
}

/** Dynamically create routes for backend API endpoints 
 * @param router
 * @param controllerInstances
 * @returns void
 */
export function createRoutes(router: Router, controllerInstances: Record<string, any>) {
    const routes = getRegisteredRoutes();
    routes.forEach(route => {
        const method = route.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
        const path = route.path;
        const middlewares = route.middlewares || [];
        const controllerInstance = controllerInstances[route.controllerName];
        if (controllerInstance) {
            router[method](path, ...middlewares, (req, res) => {
                const handler = controllerInstance[route.methodName];
                handler.call(controllerInstance, req, res);
            });
        }
    });
}