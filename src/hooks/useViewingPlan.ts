import { useEffect, useState } from "react";
import type { ViewingRequest } from "../domain/types";

export function useViewingPlan() {
  const [requests, setRequests] = useState<ViewingRequest[]>(() => {
    try { return JSON.parse(window.localStorage.getItem("parcel-pine:viewings") || "[]"); } catch { return []; }
  });
  useEffect(() => { window.localStorage.setItem("parcel-pine:viewings", JSON.stringify(requests)); }, [requests]);
  const add = (request: ViewingRequest) => setRequests((current) => [request, ...current.filter((item) => item.propertyId !== request.propertyId)]);
  return { requests, add };
}
