import 'reflect-metadata';
import { RequestHandler } from 'express';

export interface RouteReflectedMetadatas {
    method: string;
    path: string;
    requestType?: { name: string, properties: Record<string, string> } | null;
    responseType?: { name: string, properties: Record<string, string> } | null;
    controllerName: string;
    methodName: string;
    middlewares?: RequestHandler[];
}

const routeReflectedMetadatas: RouteReflectedMetadatas[] = [];

// Function to expose routes for client and includes custom middleware for server side
export function exposeRoute(
    method: string,
    path: string,
    requestType: { name: string, properties: Record<string, string> } | null,
    responseType: { name: string, properties: Record<string, string> },
    middlewares: RequestHandler[] = []
) {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) => {
        // Store route metadata
        const metadata: RouteReflectedMetadatas = {
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
export function registerRoute<T>(
    controller: T,
    method: string,
    path: string,
    requestType: { name: string, properties: Record<string, string> } | null,
    responseType: { name: string, properties: Record<string, string> },
    middlewares: RequestHandler[],
    handlerName: keyof T
) {
    exposeRoute(method, path, requestType, responseType, middlewares)(
        controller, handlerName as string | symbol, Object.getOwnPropertyDescriptor(controller, handlerName as string | symbol)!
    );
}

// Function to get registered routes
export function getRegisteredRoutes(): RouteReflectedMetadatas[] {
    return routeReflectedMetadatas;
}

// Function to export routes for schema
export function exportRoutesForSchema(): Array<{
    method: string;
    path: string;
    request: { name: string, properties: Record<string, string> } | null;
    response: { name: string, properties: Record<string, string> } | null;
}> {
    return routeReflectedMetadatas.map(route => ({
        method: route.method,
        path: route.path,
        request: route.requestType || null,
        response: route.responseType || null,
    }));
}