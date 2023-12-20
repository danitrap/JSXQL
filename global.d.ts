declare namespace JSX {
  type Element = string;

  interface IntrinsicElements {
    select: {
      columns: string[];
    };
    from: {
      table: string;
    };
    where: {};
    eq: {
      column: string;
      value: number | string;
    };
    limit: {
      value: number;
    };
  }
}
