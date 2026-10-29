// typed views over the API contract. `generated/openapi.ts` comes from the
// API's openapi.json (`yarn gen:api`): never edit it, regenerate it.
import type { components, paths } from './generated/openapi';

export type ApiSchema<Name extends keyof components['schemas']> = components['schemas'][Name];

type ApiPrefix = '/api/v1';
type HttpMethod = 'get' | 'post' | 'delete';

// endpoints as the axios helpers take them, i.e. without the `/api/v1` prefix
export type ApiEndpoint = keyof paths extends infer Path
  ? Path extends `${ApiPrefix}${infer Endpoint}`
    ? Endpoint
    : never
  : never;

type ApiOperation<E extends ApiEndpoint, M extends HttpMethod> = paths[`${ApiPrefix}${E}`][M];

// the 200 body, or the 201 body for endpoints that create something
export type ApiResponse<E extends ApiEndpoint, M extends HttpMethod = 'get'> =
  ApiOperation<E, M> extends {
    responses: { 200: { content: { 'application/json': infer Body } } };
  }
    ? Body
    : ApiOperation<E, M> extends {
          responses: { 201: { content: { 'application/json': infer Body } } };
        }
      ? Body
      : never;

export type ApiRequestBody<E extends ApiEndpoint, M extends HttpMethod = 'post'> =
  ApiOperation<E, M> extends {
    requestBody?: { content: { 'application/json': infer Body } };
  }
    ? Body
    : never;
