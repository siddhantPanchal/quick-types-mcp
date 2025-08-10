import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { quicktype, InputData, jsonInputForTargetLanguage, } from "quicktype-core";
async function convertJsonToClass(jsonSchemaString, modelName, options) {
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
server.registerTool("generateDartModels", {
    title: "JSON to Dart Model Converter",
    description: "A tool that leverages quick-types.io to generate Dart data models from JSON input. The server will expose a tool to the LLM that allows it to convert JSON objects or schemas into Dart classes.",
    inputSchema: {
        jsonString: z.string(),
        modelName: z.string().default("ExampleModel"),
        options: z.object({
            codersInClass: z.boolean().default(true),
            useFreezed: z.boolean(),
            nullSafety: z.boolean().default(true),
            useJsonAnnotation: z.boolean(),
            copyWith: z.boolean(),
            finalProps: z.boolean().default(true),
        }),
    },
}, async ({ jsonString, modelName, options }) => ({
    content: [
        {
            type: "text",
            text: await convertJsonToClass(jsonString, modelName, options),
        },
    ],
}));
// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
//# sourceMappingURL=index.js.map