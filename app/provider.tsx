"use client"

import * as react from "react"
import { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider({ children , ...props } : ThemeProviderProps) {
    return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}