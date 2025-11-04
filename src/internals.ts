export function childrenAsString(children: any) {
  if (!children) {
    return "";
  } else if (typeof children === "string") {
    return children;
  } else if (children.length) {
    return children.join("");
  } else {
    return "";
  }
}
