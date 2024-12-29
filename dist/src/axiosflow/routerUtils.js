import { getRegisteredRoutes } from './metadata';
/**
 * Infer type properties to expose types for client without needing to write types for API functions.
 * @param name
 * @returns name, properties
 */
export function typeRef(name, propertiesOverride) {
    const properties = propertiesOverride || {};
    if (!propertiesOverride) {
        const keys = Object.keys({});
        keys.forEach(key => {
            const type = typeof {}[key];
            properties[key] = type === 'number' ? 'number' : type === 'string' ? 'string' : type === 'boolean' ? 'boolean' : 'any';
            console.log(`Property: ${key}, Type: ${properties[key]}`);
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
export function createRoutes(router, controllerInstances) {
    const routes = getRegisteredRoutes();
    routes.forEach(route => {
        const method = route.method.toLowerCase();
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
//# sourceMappingURL=routerUtils.js.map