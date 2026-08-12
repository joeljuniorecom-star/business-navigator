import { createFileRoute } from "@tanstack/react-router";
import { BOSRequestError, generateBOSForRequest } from "@/data/v2/bos-service";

export const Route = createFileRoute("/api/bos/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body: unknown = await request.json();
          const result = generateBOSForRequest(body);
          return Response.json(result);
        } catch (error) {
          if (error instanceof BOSRequestError) {
            return Response.json(
              { error: error.message },
              { status: error.statusCode },
            );
          }

          console.error("BOS generation failed", error);
          return Response.json(
            { error: "Unable to generate the execution plan." },
            { status: 500 },
          );
        }
      },
    },
  },
});
