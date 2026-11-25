import { createResourceRoute } from "@/lib/api";
import { resourceConfigs } from "@/lib/resources";

const handlers = createResourceRoute(resourceConfigs.services);

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
