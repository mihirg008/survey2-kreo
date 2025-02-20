import React from "react"
export function logComponentTree(component: React.ReactNode, depth = 0): void {
  if (React.isValidElement(component)) {
    console.log(`${"  ".repeat(depth)}${component.type.name || component.type}`)
    React.Children.forEach(component.props.children, (child) => logComponentTree(child, depth + 1))
  } else if (Array.isArray(component)) {
    component.forEach((child) => logComponentTree(child, depth))
  }
}

