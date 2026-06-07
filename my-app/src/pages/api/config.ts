import type { NextApiRequest, NextApiResponse } from "next";
import {
  getThresholdConfig,
  setThresholdConfig,
} from "../../utils/db/servicefirebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET konfigurasi
  if (req.method === "GET") {
    try {
      const config = await getThresholdConfig();

      return res.status(200).json(config);
    } catch (err) {
      return res.status(500).json({
        error: "Gagal mengambil konfigurasi dari database.",
      });
    }
  }

  // POST / PUT konfigurasi
  if (req.method === "POST" || req.method === "PUT") {
    try {
      await setThresholdConfig(req.body);

      return res.status(200).json({
        success: true,
        message: "Konfigurasi berhasil disimpan",
        config: req.body,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Gagal menyimpan konfigurasi ke database.",
      });
    }
  }

  // Method tidak didukung
  res.setHeader("Allow", ["GET", "POST", "PUT"]);

  return res.status(405).json({
    error: `Method ${req.method} tidak diizinkan`,
  });
}