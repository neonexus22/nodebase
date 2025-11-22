import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish "loading" state for http request
  if (!data.endpoint) {
    // TODO: Publish "error" state for HTTP request
    throw new NonRetriableError("HTTP Request node: No endpoint configured.");
  }
  if (!data.variableName) {
    // TODO: Publish "error" state for HTTP request
    throw new NonRetriableError(
      "HTTP Request node: Variable name not configured.",
    );
  }

  if (!data.method) {
    throw new NonRetriableError("HTTP Request node: Method not configured.");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint!)(context);
    const method = data.method || "GET";

    const options: KyOptions = { method };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options); // CALL THE API BY USING "KY"
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }

    // Fallback to direct httpResponse for backward compatibility
    return {
      ...context,
      ...responsePayload,
    };
  });

  // TODO: Publish "success" state for http request

  return result;
};
