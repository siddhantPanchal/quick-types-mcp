# Product Requirements Document: Quick-Types MCP for Dart

## 1. Overview

This document outlines the requirements for a Model Context Protocol (MCP) server that leverages quick-types.io to generate Dart data models from JSON input. The server will expose a tool to the LLM that allows it to convert JSON objects or schemas into Dart classes.

## 2. Target Audience

This MCP is designed for developers who are building Dart applications and need to quickly generate data models from JSON APIs or other JSON sources.

## 3. Features

### 3.1. JSON to Dart Conversion Tool

The core feature of this MCP is a tool that takes a JSON string as input and returns the equivalent Dart code.

*   **Input:** 
    *   `jsonString`: A JSON string representing a single object or a JSON schema.
    *   `typeName`: The name of the class to be generated.
    *   `options`: An object with the following boolean properties to control the generated code:
        *   `codersInClass`: Whether to include `fromJson` and `toJson` methods in the class.
        *   `useFreezed`: Whether to use the `freezed` package for code generation.
        *   `nullSafety`: Whether to generate null-safe code.
        *   `useJsonAnnotation`: Whether to use the `json_serializable` package for code generation.
        *   `copyWith`: Whether to include a `copyWith` method.
        *   `finalProps`: Whether to make the properties `final`.
*   **Output:** A string containing the generated Dart code.
*   **Language:** The output language will be fixed to Dart.
*   **Dependencies:** The generated code should not have any external dependencies beyond the standard Dart libraries.

### 3.2. Error Handling

The MCP should handle invalid JSON input gracefully.

*   If the input string is not valid JSON, the tool should return an error message to the LLM.
*   The error message should be clear and concise, indicating that the input was not valid JSON.

## 4. Technical Requirements

### 4.1. Technology Stack

*   **Backend:** Node.js with TypeScript
*   **MCP SDK:** `@modelcontextprotocol/sdk`
*   **JSON to Dart Conversion:** `quicktype-core`

### 4.2. API

The MCP will expose a single tool named `generateDartModels`.

#### `generateDartModels`

*   **Description:** Converts a JSON string to Dart data models.
*   **Input:**
    *   `jsonString` (string, required): The JSON string to convert.
    *   `typeName` (string, required): The name of the class to be generated.
    *   `options` (object, optional): An object with the following boolean properties to control the generated code:
        *   `codersInClass` (boolean, optional): Whether to include `fromJson` and `toJson` methods in the class.
        *   `useFreezed` (boolean, optional): Whether to use the `freezed` package for code generation.
        *   `nullSafety` (boolean, optional): Whether to generate null-safe code.
        *   `useJsonAnnotation` (boolean, optional): Whether to use the `json_serializable` package for code generation.
        *   `copyWith` (boolean, optional): Whether to include a `copyWith` method.
        *   `finalProps` (boolean, optional): Whether to make the properties `final`.
*   **Output:**
    *   `dartCode` (string): The generated Dart code.
    *   `error` (string, optional): An error message if the conversion fails.

## 5. Example Usage

### 5.1. Successful Conversion

**LLM Input:**

```
"Can you generate a Dart model for this JSON: {\"name\": \"John Doe\", \"age\": 30}"
```

**Tool Call:**

```json
{
  "tool": "generateDartModels",
  "arguments": {
    "jsonString": "{\"name\": \"John Doe\", \"age\": 30}",
    "typeName": "User",
    "options": {
      "nullSafety": true,
      "codersInClass": true,
      "finalProps": true,
      "copyWith": true
    }
  }
}
```

**Tool Output:**

```json
{
  "dartCode": "class User {\n  String name;
  int age;

  User({required this.name, required this.age});

  factory User.fromJson(Map<String, dynamic> json) => User(
    name: json[\"name\"],
    age: json[\"age\"],
  );

  Map<String, dynamic> toJson() => {
    \"name\": name,
    \"age\": age,
  };
}"
}
```

### 5.2. Invalid JSON

**LLM Input:**

```
"Can you generate a Dart model for this JSON: {\"name\": \"John Doe\", \"age\": 30,"
```

**Tool Call:**

```json
{
  "tool": "generateDartModels",
  "arguments": {
    "jsonString": "{\"name\": \"John Doe\", \"age\": 30,"
  }
}
```

**Tool Output:**

```json
{
  "error": "Invalid JSON provided."
}
```
