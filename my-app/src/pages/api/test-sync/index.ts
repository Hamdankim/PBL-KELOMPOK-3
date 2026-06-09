import type { NextApiRequest, NextApiResponse } from 'next';
// Sesuaikan path import di bawah ini dengan lokasi file servicefirebase-server.ts Anda
import { syncLatestSensorDataFromRTDB } from '../../../utils/db/servicefirebase-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await syncLatestSensorDataFromRTDB("SmartPlant");
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}