function logSpanEnd({
  name,
  start,
  status,
  error,
}: {
  name: string;
  start: number;
  status: "success" | "error";
  error?: unknown;
}) {
  console.log(
    JSON.stringify({
      name,
      type: "span",
      event: "end",
      status,
      duration: performance.now() - start,
      error,
    }),
  );
}

function logSpan<FN extends () => unknown>(
  name: string,
  fn: FN,
): ReturnType<FN> {
  const start = performance.now();
  console.log(JSON.stringify({ name, type: "span", event: "start" }));
  try {
    const result = fn();

    if (result instanceof Promise) {
      // @ts-ignore
      return result
        .then((res) => {
          logSpanEnd({ name, start, status: "success" });
          return res as any;
        })
        .catch((error) => {
          logSpanEnd({ name, start, status: "error", error });
          throw error;
        });
    } else {
      logSpanEnd({ name, start, status: "success" });
      return result as any;
    }
  } catch (error) {
    logSpanEnd({ name, start, status: "error", error });
    throw error;
  }
}

function logEvent(
  name: string,
  payload?: Record<
    string,
    string | number | boolean | null | undefined | Date | unknown
  >,
) {
  console.log(JSON.stringify({ name, type: "event", payload }));
}

export const Log = {
  span: logSpan,
  event: logEvent,
} as const;
