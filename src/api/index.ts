import axios, { AxiosInstance, Method, RawAxiosRequestHeaders } from "axios";
import { makeURL } from "@nauverse/make-url";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import type { Report } from "./entities";

interface Request {
  url: string;
  method: Method;
  data:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | FormData
    | string
    | undefined;
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
    .join("&");

  return queryString;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly httpCode: number,
  ) {
    super(message);
  }
}

export class Client {
  private readonly client: AxiosInstance;
  private readonly t: string;
  private route: "admin" | "user" | "auth" | "public" = "admin";

  constructor(
    private readonly baseUrl: string,
    t: string,
  ) {
    this.t = t;

    this.client = axios.create({
      headers: {
        Accept: "application/json",
      },
    });
  }

  setScope(scope: "admin" | "user" | "auth" | "public") {
    this.route = scope;
  }

  get scope() {
    return this.route;
  }

  get hasToken() {
    return this.t !== "";
  }

  get auth() {
    return new (class Auth extends BaseAction {
      login(data: { id: string; password: string }) {
        const { operation } = this.client.prepare<{ token: string }>(
          "login",
          "POST",
          data,
          undefined,
          {
            route: "auth",
          },
        );
        return operation;
      }

      renew(token: string) {
        const { operation } = this.client.prepare<{ token: string }>(
          "renew",
          "POST",
          { token },
        );
        return operation;
      }

      register(data: {
        name: string;
        phone: string;
        email: string;
        password: string;
      }) {
        const { operation } = this.client.prepare<{ token: string }>(
          "register",
          "POST",
          data,
          undefined,
          {
            route: "auth",
          },
        );
        return operation;
      }
    })(this, "");
  }

  get reports() {
    return new (class Reports extends BaseAction {
      all() {
        const { operation } = this.client.prepare<Report[]>(
          this.endpoint + "/",
          "GET",
        );
        return operation;
      }

      one(id: string, secret?: string) {
        const { operation } = this.client.prepare<Report>(
          this.endpoint + "/:id",
          "GET",
          { secret },
          { id },
        );
        return operation;
      }

      create(data: {
        patientId: string;
        doctorId: string;
        reason: string;
        tecnic: string;
        study: string;
        observations: string[];
      }) {
        const { operation } = this.client.prepare<Report>("/", "POST", data);
        return operation;
      }

      attachMedia(
        id: string,
        data: {
          content: {
            id: string;
            type: "image" | "dicom";
          }[];
        },
      ) {
        const { operation } = this.client.prepare<{
          message: string;
        }>("/:id/media", "POST", data, { id });
        return operation;
      }

      publish(id: string) {
        const { operation } = this.client.prepare<{
          message: string;
        }>(`/:id/publish`, "POST", undefined, { id });
        return operation;
      }

      getMedia(id: string, mediaId: "collage" | string) {
        const { operation } = this.client.prepare<Blob>(
          `/:id/media/:media.png`,
          "GET",
          undefined,
          {
            id,
            media: mediaId,
          },
        );
        return operation;
      }

      buildMediaURL(
        id: string,
        mediaId: "collage" | string,
        forcePublic = false,
      ) {
        return makeURL(
          this.client.baseUrl,
          forcePublic ? "public" : this.client.route,
          this.endpoint,
          `/:id/media/:media.png`,
          {
            params: {
              id,
              media: mediaId,
            },
          },
        );
      }

      createSecret(
        id: string,
        data: {
          expiresAt?: string;
        },
      ) {
        const { operation } = this.client.prepare<{
          secret: string;
        }>(this.endpoint + `/:id/secret`, "POST", data, { id });
        return operation;
      }
    })(this, "/reports");
  }

  get files() {
    return new (class Files extends BaseAction {
      upload(file: Blob) {
        const formData = new FormData();

        formData.append("", file);

        const { operation } = this.client.prepare<{
          message: string;
        }>("upload", "POST", formData);
        return operation;
      }

      one(id: string) {
        const { operation } = this.client.prepare<Blob>(
          "/:id",
          "GET",
          undefined,
          { id },
        );
        return operation;
      }

      raw(id: string) {
        const { operation } = this.client.prepare<Blob>(
          "/:id/raw",
          "GET",
          undefined,
          { id },
        );
        return operation;
      }
    })(this, "files");
  }

  prepare<T>(
    path: string,
    method: Method,
    body?:
      | Record<string, unknown>
      | Record<string, unknown>[]
      | FormData
      | string,
    params?: Record<string, unknown>,
    config?: {
      removeAuth?: boolean;
      route?: "admin" | "user" | "auth" | "public";
    },
  ) {
    const route = makeURL(
      this.baseUrl,
      "/",
      config?.route ?? this.route ?? "admin",
    );
    let url = makeURL(route, "/", path);

    if (params) {
      url = makeURL(url, {
        params,
      });
    }

    if (method === "GET" && body) {
      if (typeof body === "string") {
        url = `${url}?${body}`;
      } else {
        const params = buildQueryString(body as Record<string, unknown>);
        if (params.length > 0) url = `${url}?${params} `;
      }
    }

    let headers = {};

    if (!config?.removeAuth) {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.t} `,
      };
    }

    const request = {
      url,
      method,
      data: method !== "GET" ? body : undefined,
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
    public readonly routeType: "admin" | "user" | "auth" | "public" = "admin",
  ) {}

  useSwr<B>(
    func: (action: this) => Route<B>,
    condition = true,
  ): (conf?: SWRConfiguration<B, unknown>) => SWRResponse<B> {
    return (conf?: SWRConfiguration<B, unknown>) => {
      if (!condition)
        return useSWR(
          () => undefined,
          () => Promise.reject(),
        );

      const { submit, route } = func(this);

      return useSWR(route, submit, conf);
    };
  }
}
