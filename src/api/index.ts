import axios, { AxiosInstance, Method, RawAxiosRequestHeaders } from 'axios';
import { makeURL } from '@nauverse/make-url';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

interface Request {
  url: string;
  method: Method;
  data: Record<string, unknown> | Record<string, unknown>[] | FormData | string | undefined;
  params: Record<string, unknown> | FormData | undefined;
  headers: RawAxiosRequestHeaders;
}

function buildQueryString(params: Record<string, unknown>): string {
  const queryString = Object.keys(params)
    .flatMap((key) => {
      if (params[key] === undefined) return [];

      const value = params[key];
      return `${key}=${encodeURI(String(value))}`;
    })
    .join('&');

  return queryString;
}

export class ApiError extends Error {
  constructor(message: string, public readonly httpCode: number) {
    super(message);
  }
}

export class Client {
  private readonly client: AxiosInstance;
  private readonly t: string;
  private route: 'admin' | 'user' | 'auth' | 'public' = 'admin';

  constructor(private readonly baseUrl: string, t: string) {
    this.t = t;

    this.client = axios.create({
      headers: {
        Accept: 'application/json',
      },
    });
  }

  setScope(scope: 'admin' | 'user' | 'auth' | 'public') {
    this.route = scope;
  }

  get scope() {
    return this.route;
  }

  get hasToken() {
    return this.t !== '';
  }

  get auth() {
    return new (class Auth extends BaseAction {
      login(data: { id: string; password: string }) {
        const { operation } = this.client.prepare<{ token: string }>('login', 'POST', data, undefined, {
          route: 'auth',
        });
        return operation;
      }

      renew(token: string) {
        const { operation } = this.client.prepare<{ token: string }>('renew', 'POST', { token });
        return operation;
      }

      register(data: { name: string; email: string; phone: string; password: string }) {
        const { operation } = this.client.prepare<{ token: string }>('create', 'POST', data, undefined, {
          route: 'auth',
        });
        return operation;
      }
    })(this, '');
  }

  prepare<T>(
    path: string,
    method: Method,
    body?: Record<string, unknown> | Record<string, unknown>[] | FormData | string,
    params?: Record<string, unknown>,
    config?: {
      removeAuth?: boolean;
      route?: 'admin' | 'user' | 'auth' | 'public';
    }
  ) {
    const route = makeURL(this.baseUrl, '/', config?.route ?? this.route ?? 'admin');
    let url = makeURL(route, '/', path);

    if (params) {
      url = makeURL(url, {
        params,
      });
    }

    if (method === 'GET' && body) {
      if (typeof body === 'string') {
        url = `${url}?${body}`;
      } else {
        const params = buildQueryString(body as Record<string, unknown>);
        if (params.length > 0) url = `${url}?${params}`;
      }
    }

    let headers = {};

    if (!config?.removeAuth) {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.t}`,
      };
    }

    const request = {
      url,
      method,
      data: method !== 'GET' ? body : undefined,
      params: undefined,
      headers,
    };

    return {
      request,
      operation: {
        submit: async () => {
          return await this.submit<T>(request);
        },
        route: request.url,
      },
    };
  }

  async submit<T>(request: Request): Promise<T> {
    try {
      const result = await this.client({
        ...request,
      });

      return result.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const payload = err.response?.data as {
          message?: string;
        };

        if (payload?.message) {
          throw new ApiError(payload.message, err.response?.status ?? 500);
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
  }
}

export type Route<T> = {
  submit: () => Promise<T>;
  route: string;
};

export abstract class BaseAction {
  constructor(
    public readonly client: Client,
    public readonly endpoint: string,
    public readonly routeType: 'admin' | 'user' | 'auth' | 'public' = 'admin'
  ) {}

  useSwr<B>(
    func: (action: this) => Route<B>,
    condition = true
  ): (conf?: SWRConfiguration<B, unknown>) => SWRResponse<B> {
    return (conf?: SWRConfiguration<B, unknown>) => {
      if (!condition)
        return useSWR(
          () => undefined,
          () => Promise.reject()
        );

      const { submit, route } = func(this);

      return useSWR(route, submit, conf);
    };
  }
}
