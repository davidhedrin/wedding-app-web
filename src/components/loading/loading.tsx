"use client";
import { useLoading } from "./loading-context";
import LoadingUI from "./loading-ui";

export default function Loading() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;
  return <LoadingUI className="backdrop-blur-sm" />
}