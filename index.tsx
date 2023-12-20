import * as JSXQL from "./jsxql";

console.log(
  <from table="users">
    <select columns={["name", "age"]} />
    <where>
      <eq column="id" value={1} />
      <eq column="name" value="John" />
    </where>
    <limit value={10} />
  </from>,
);
