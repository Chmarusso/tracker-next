import { type NextRequest } from 'next/server'
import { createEvent, getEvents } from "@/services/events"
import { z } from "zod";

const schema = z.object({
  action: z.string(),
  category: z.string(),
  parameter: z.string(), 
  userId: z.string(),
  gaClientId: z.string().optional()
})

export async function GET(req: NextRequest) {
  if(req.headers.get("authorization") !== "Bearer secret") {
    return Response.json({ error: { message: "Unauthorized" }}, { status: 401 });
  }
  
  const allEvents = await getEvents();

  return Response.json(allEvents)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const { errors } = parsed.error;
    return Response.json({ error: { message: "Invalid request", errors }}, { status: 400 });
  }

  await createEvent(
    parsed.data.action, 
    parsed.data.category, 
    parsed.data.parameter, 
    parsed.data.userId, 
    parsed.data.gaClientId
  );
 
  return Response.json({ data: "ok" })
}