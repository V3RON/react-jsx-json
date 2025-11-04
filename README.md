# react-jsx-json

> **⚠️ Experimental** - This package is in early development and may have breaking changes.

`react-jsx-json` is a custom React renderer that enables you to serialize your React component trees into JSON format. This allows you to send your React component structure over the wire and recreate it in a completely different environment - whether that's a different JavaScript runtime, a native mobile app, a server-side process, or any other system capable of interpreting the JSON representation.

Unlike traditional React renderers that produce DOM nodes or native UI elements, `react-jsx-json` produces a lightweight, serializable JSON structure that captures the essential structure and properties of your React tree. This makes it possible to build applications where the UI definition is decoupled from the rendering environment, enabling powerful patterns like cross-platform UI sharing, server-side rendering to multiple targets, or dynamic UI composition across network boundaries.
