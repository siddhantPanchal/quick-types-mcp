import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from "quicktype-core";

interface ModelClassRenderOptions {
  codersInClass: boolean;
  useFreezed: boolean;
  nullSafety: boolean;
  useJsonAnnotation: boolean;
  copyWith: boolean;
  finalProps: boolean;
}

async function convertJsonToClass(
  jsonSchemaString: string,
  modelName: string,
  options: ModelClassRenderOptions
) {
  const jsonInput = jsonInputForTargetLanguage("dart");

  await jsonInput.addSource({
    name: modelName,
    samples: [jsonSchemaString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const result = await quicktype({
    inputData,
    lang: "dart",
    rendererOptions: {
      "coders-in-class": options.codersInClass,
      "use-freezed": options.useFreezed,
      "null-safety": options.nullSafety,
      "use-json-annotation": options.useJsonAnnotation,
      "copy-with": options.copyWith,
      "final-props": options.finalProps,
    },
  });
  return result.lines.join("\n");
}

// Create an MCP server
const server = new McpServer({
  name: "quick-types-mcp",
  version: "1.0.0",
});

server.registerTool(
  "generateDartModel",
  {
    title: "JSON to Dart Model Converter",
    description:
      "A tool that leverages quick-types.io to generate Dart data models from JSON input. The server will expose a tool to the LLM that allows it to convert JSON objects or schemas into Dart classes.",
    inputSchema: {
      jsonString: z.string().describe("The JSON string to convert"),
      modelName: z
        .string()
        .default("ExampleModel")
        .describe("The name of the model"),
      options: z
        .object({
          codersInClass: z
            .boolean()
            .default(true)
            .describe(
              "Whether to include `fromJson` and `toJson` methods in the class."
            ),
          useFreezed: z
            .boolean()
            .describe("Whether to use the `freezed` package"),
          nullSafety: z
            .boolean()
            .default(true)
            .describe("Whether to use null safety (default: true)"),
          useJsonAnnotation: z
            .boolean()

            .describe("Whether to use the `json_annotation` package"),
          copyWith: z
            .boolean()
            .describe("Whether to use the `copy_with` package"),
          finalProps: z
            .boolean()
            .default(true)
            .describe("Whether to use final properties (default: true)"),
        })
        .describe("Options to control the generated code"),
    },
  },

  async ({ jsonString, modelName, options }) => ({
    content: [
      {
        type: "text",
        text: await convertJsonToClass(
          jsonString,
          modelName,
          options as ModelClassRenderOptions
        ),
      },
    ],
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

// Add initial implementation of MCP server with JSON to Dart model conversion tool

// - Create .gitignore to exclude node_modules and package-lock.json
// - Add PLAN.md with project milestones and features
// - Add PRD.md outlining product requirements and target audience
// - Implement index.ts with server setup and conversion logic
// - Update package.json with necessary dependencies and scripts
// - Add TypeScript configuration in tsconfig.json
// - Include source maps for JavaScript and TypeScript files
