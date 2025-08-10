# Quick-Types MCP

This project is a Model Context Protocol (MCP) server that provides a tool to generate Dart data models from JSON input using `quicktype-core`.

## Installation

1. Clone the repository.
2. Install the dependencies:

```bash
npm install
```

## Running the Server

To start the MCP server, run the following command:

```bash
npm start
```

The server will start on the default MCP port.

## `generateDartModels` Tool

This tool converts a JSON string to Dart data models.

### Input

*   `jsonString` (string, required): The JSON string to convert.
*   `typeName` (string, required): The name of the class to be generated.
*   `options` (object, optional): An object with the following boolean properties to control the generated code:
    *   `codersInClass` (boolean, optional): Whether to include `fromJson` and `toJson` methods in the class.
    *   `useFreezed` (boolean, optional): Whether to use the `freezed` package for code generation.
    *   `nullSafety` (boolean, optional): Whether to generate null-safe code.
    *   `useJsonAnnotation` (boolean, optional): Whether to use the `json_serializable` package for code generation.
    *   `copyWith` (boolean, optional): Whether to include a `copyWith` method.
    *   `finalProps` (boolean, optional): Whether to make the properties `final`.

### Output

*   `dartCode` (string): The generated Dart code.
*   `error` (string, optional): An error message if the conversion fails.

### Examples

#### Successful Conversion

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
  "dartCode": "class User {\n  String name;\n  int age;\n\n  User({required this.name, required this.age});\n\n  factory User.fromJson(Map<String, dynamic> json) => User(\n    name: json[\"name\"],\n    age: json[\"age\"],\n  );\n\n  Map<String, dynamic> toJson() => {\n    \"name\": name,\n    \"age\": age,\n  };
}"
}
```

#### Invalid JSON

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
#### Successful Conversion with Freezed

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
      "useFreezed": true,
      "useJsonAnnotation": true
    }
  }
}
```

**Tool Output:**

```json
{
  "dartCode": "import 'package:freezed_annotation/freezed_annotation.dart';\n\npart 'user.freezed.dart';\npart 'user.g.dart';\n\n@freezed\nclass User with _\$User {\n    const factory User({\n        required String name,\n        required int age,\n    }) = _User;\n\n    factory User.fromJson(Map<String, dynamic> json) => _\$UserFromJson(json);\n}"
}
```