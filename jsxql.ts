type RawSelectStatement = {
  kind: "structured";
  tag: "select";
  attrs: JSX.IntrinsicElements["select"];
  children: [];
};

type UnknownStatement = {
  kind: "structured";
  tag: string;
  attrs: { [key: string]: any };
  children: (RawSelectStatement | Serialized)[];
};

type Serialized = {
  kind: "serialized";
  content: string;
};

export const h = <T extends keyof JSX.IntrinsicElements>(
  tag: T,
  attrs: { [key: string]: any },
  ...children: (RawSelectStatement | Serialized | UnknownStatement)[]
) => {
  switch (tag) {
    case "from":
      const select = children.find(
        (child): child is RawSelectStatement =>
          child.kind == "structured" && child.tag === "select",
      );
      if (!select) {
        throw new Error("No select found");
      }
      const others = children.filter(
        (child): child is Serialized => child.kind == "serialized",
      );
      return `select ${select.attrs.columns.join(", ")} from ${
        attrs.table
      } ${others.map((child) => child.content).join(" ")}`;
    case "where":
      return {
        kind: "serialized" as const,
        content: `where ${children
          .map((child) => (child.kind === "serialized" ? child.content : ""))
          .join(" and ")}`,
      };
    case "eq":
      const value =
        typeof attrs.value === "string" ? `'${attrs.value}'` : attrs.value;
      return {
        kind: "serialized" as const,
        content: `${attrs.column} = ${value}`,
      };
    case "limit":
      return {
        kind: "serialized" as const,
        content: `limit ${attrs.value}`,
      };
    default:
      return { kind: "structured" as const, tag, attrs, children };
  }
};
