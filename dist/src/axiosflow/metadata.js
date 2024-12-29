import 'reflect-metadata';
const routeReflectedMetadatas = [];
// Function to expose routes for client and includes custom middleware for server side
export function exposeRoute(method, path, requestType, responseType, middlewares = []) {
    return (target, propertyKey, descriptor) => {
        // Store route metadata
        const metadata = {
            method,
            path,
            requestType,
            responseType,
            controllerName: target.constructor.name,
            methodName: propertyKey.toString(),
            middlewares
        };
        routeReflectedMetadatas.push(metadata);
        // Save routing metadata
        Reflect.defineMetadata('route:method', method, target, propertyKey);
        Reflect.defineMetadata('route:path', path, target, propertyKey);
        Reflect.defineMetadata('route:requestType', requestType, target, propertyKey);
        Reflect.defineMetadata('route:responseType', responseType, target, propertyKey);
        Reflect.defineMetadata('route:middlewares', middlewares, target, propertyKey);
    };
}
// Function to register route for controller
export function registerRoute(controller, method, path, requestType, responseType, middlewares, handlerName) {
    exposeRoute(method, path, requestType, responseType, middlewares)(controller, handlerName, Object.getOwnPropertyDescriptor(controller, handlerName));
}
// Function to get registered routes
export function getRegisteredRoutes() {
    return routeReflectedMetadatas;
}
// Function to export routes for schema
export function exportRoutesForSchema() {
    return routeReflectedMetadatas.map(route => ({
        method: route.method,
        path: route.path,
        request: route.requestType || null,
        response: route.responseType || null,
    }));
}
//# sourceMappingURL=metadata.js.map