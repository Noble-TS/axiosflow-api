import 'reflect-metadata';
import { RequestHandler } from 'express';
export interface RouteReflectedMetadatas {
    method: string;
    path: string;
    requestType?: {
        name: string;
        properties: Record<string, string>;
    } | null;
    responseType?: {
        name: string;
        properties: Record<string, string>;
    } | null;
    controllerName: string;
    methodName: string;
    middlewares?: RequestHandler[];
}
export declare function exposeRoute(method: string, path: string, requestType: {
    name: string;
    properties: Record<string, string>;
} | null, responseType: {
    name: string;
    properties: Record<string, string>;
}, middlewares?: RequestHandler[]): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
export declare function registerRoute<T>(controller: T, method: string, path: string, requestType: {
    name: string;
    properties: Record<string, string>;
} | null, responseType: {
    name: string;
    properties: Record<string, string>;
}, middlewares: RequestHandler[], handlerName: keyof T): void;
export declare function getRegisteredRoutes(): RouteReflectedMetadatas[];
export declare function exportRoutesForSchema(): Array<{
    method: string;
    path: string;
    request: {
        name: string;
        properties: Record<string, string>;
    } | null;
    response: {
        name: string;
        properties: Record<string, string>;
    } | null;
}>;
