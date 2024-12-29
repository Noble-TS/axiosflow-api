import { Router } from 'express';
/**
 * Infer type properties to expose types for client without needing to write types for API functions.
 * @param name
 * @returns name, properties
 */
export declare function typeRef<T extends object>(name: string, propertiesOverride?: Record<string, string>): {
    name: string;
    properties: Record<string, string>;
};
/** Dynamically create routes for backend API endpoints
 * @param router
 * @param controllerInstances
 * @returns void
 */
export declare function createRoutes(router: Router, controllerInstances: Record<string, any>): void;
