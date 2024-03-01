import { deliverToGA } from './ga4';
import db from './prisma'

export const getEvents = async () => 
  db.event.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

export const createEvent = async (action: string, category: string, parameter: string, userId: string, gaClientId: string | undefined) => {
  if(gaClientId) {
    await deliverToGA(action, category, parameter, userId, gaClientId);
  }
  
  return await db.event.create({
    data: {
      action,
      category,
      parameter,
      userId
    },
  })
}