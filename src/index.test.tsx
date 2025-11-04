import { describe, it, expect, afterEach } from "bun:test";
import React, { type ReactNode } from "react";
import { createReactJsxJson, type ReactJsxJson } from "./renderer";
import { createPrimitiveComponent, TEXT_NODE_TYPE } from "./primitive";

describe("react-jsx-json", () => {
  let renderer: ReactJsxJson = null!;

  afterEach(() => {
    if (renderer) {
      renderer.unmount();
    }
  });

  describe("createPrimitiveComponent", () => {});

  describe("createReactJsonx", () => {
    it("should create a renderer with primitives", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );
      const HStack = createPrimitiveComponent<{ gap?: number }>("HStack");

      renderer = createReactJsxJson({ knownPrimitives: [VStack, HStack] });

      expect(renderer).toBeDefined();
      expect(typeof renderer.render).toBe("function");
    });

    it("should render a simple primitive", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const result = renderer.render(<VStack>Hello</VStack>);

      expect(result).toEqual({
        t: 0,
        c: [{ t: TEXT_NODE_TYPE, v: "Hello" }],
      });
    });

    it("should render nested primitives", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );
      const HStack = createPrimitiveComponent<{
        children: ReactNode;
        gap?: number;
      }>("HStack");

      renderer = createReactJsxJson({ knownPrimitives: [VStack, HStack] });

      const result = renderer.render(
        <VStack>
          <HStack gap={10}>Content</HStack>
        </VStack>
      );

      expect(result).toEqual({
        t: 0,
        c: [
          {
            t: 1,
            p: { gap: 10 },
            c: [
              {
                t: TEXT_NODE_TYPE,
                v: "Content",
              },
            ],
          },
        ],
      });
    });

    it("should extract children from props", () => {
      const VStack = createPrimitiveComponent<{
        children: ReactNode;
        className?: string;
      }>("VStack");

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const result = renderer.render(
        <VStack className="container">Hello</VStack>
      );

      expect(result).toEqual({
        t: 0,
        p: { className: "container" },
        c: [
          {
            t: TEXT_NODE_TYPE,
            v: "Hello",
          },
        ],
      });
    });

    it("should handle fragments", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const result = renderer.render(
        <VStack>
          <>
            <VStack>First</VStack>
            <VStack>Second</VStack>
          </>
        </VStack>
      );

      expect(result?.c).toHaveLength(2);
      expect(result?.c?.[0]).toEqual({
        t: 0,
        c: [
          {
            t: TEXT_NODE_TYPE,
            v: "First",
          },
        ],
      });
    });

    it("should handle arrays of children", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const result = renderer.render(
        <VStack>
          {[<VStack key="1">One</VStack>, <VStack key="2">Two</VStack>]}
        </VStack>
      );

      expect(result?.c).toHaveLength(2);
    });

    it("should handle conditional rendering", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const show = true;
      const result = renderer.render(
        <VStack>{show && <VStack>Visible</VStack>}</VStack>
      );

      expect(result?.c).toHaveLength(1);
      expect(result?.c?.[0]?.c?.[0]?.v).toBe("Visible");
    });

    it("should throw error for unknown primitive at leaf node", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );
      const UnknownComponent = () => {
        return <div />;
      };

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      expect(() => {
        renderer.render(
          <VStack>
            <UnknownComponent />
          </VStack>
        );
      }).toThrow("Unknown primitive");
    });

    it("should throw error for string types at leaf", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      expect(() => {
        renderer.render(
          <VStack>
            <div />
          </VStack>
        );
      }).toThrow("Unknown primitive");
    });

    it("should render to JsonNode", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });
      const result = renderer.render(<VStack>Hello</VStack>);

      expect(result).toBeDefined();
      expect(result.t).toBe(0);
      expect(result.c).toBeDefined();
      expect(result.c?.[0]?.v).toBe("Hello");
    });

    it("should handle empty children", () => {
      const VStack = createPrimitiveComponent<{ children?: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const result = renderer.render(<VStack />);

      expect(result).not.toBeNull();
      expect(result).toEqual({
        t: 0,
      });
      expect(result?.c).toBeUndefined();
    });

    it("should throw error if primitives object is empty", () => {
      expect(() => {
        createReactJsxJson({ knownPrimitives: [] });
      }).toThrow("At least one primitive component must be provided");
    });

    it("should return JsonNode on each render", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const result = renderer.render(<VStack>First</VStack>);

      expect(result).toBeDefined();
      expect(result).toEqual({
        t: 0,
        c: [
          {
            t: TEXT_NODE_TYPE,
            v: "First",
          },
        ],
      });
    });

    it("should return JsonNode on each update when element changes", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const result1 = renderer.render(<VStack>First</VStack>);
      expect(result1?.c?.[0]?.v).toBe("First");

      const result2 = renderer.render(<VStack>Second</VStack>);
      expect(result2?.c?.[0]?.v).toBe("Second");

      const result3 = renderer.render(<VStack>Third</VStack>);
      expect(result3?.c?.[0]?.v).toBe("Third");
    });

    it("should return JsonNode on state changes", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const DynamicComponent = ({ count }: { count: number }) => {
        return <VStack>Count: {count}</VStack>;
      };

      const result1 = renderer.render(<DynamicComponent count={0} />);
      expect(result1?.c).toHaveLength(2);
      expect(result1?.c?.[0]?.v).toBe("Count: ");
      expect(result1?.c?.[1]?.v).toBe("0");

      const result2 = renderer.render(<DynamicComponent count={1} />);
      expect(result2?.c).toHaveLength(2);
      expect(result2?.c?.[0]?.v).toBe("Count: ");
      expect(result2?.c?.[1]?.v).toBe("1");

      const result3 = renderer.render(<DynamicComponent count={2} />);
      expect(result3?.c).toHaveLength(2);
      expect(result3?.c?.[0]?.v).toBe("Count: ");
      expect(result3?.c?.[1]?.v).toBe("2");
    });

    it("should work without callback", () => {
      const VStack = createPrimitiveComponent<{ children: ReactNode }>(
        "VStack"
      );

      renderer = createReactJsxJson({ knownPrimitives: [VStack] });

      const result = renderer.render(<VStack>Hello</VStack>);
      expect(result).toBeDefined();
      expect(result.t).toBe(0);
    });
  });
});
