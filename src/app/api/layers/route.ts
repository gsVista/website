import { createResourceRoute } from "@/lib/api";
import { resourceConfigs } from "@/lib/resources";

const handlers = createResourceRoute(resourceConfigs.layers);

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
