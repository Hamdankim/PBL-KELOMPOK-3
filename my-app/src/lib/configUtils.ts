export const defaultConfig = {
  soilMoistureMin: 35,
  soilMoistureMax: 70,

  temperatureMin: 18,
  temperatureMax: 32,

  humidityMin: 40,
  humidityMax: 80,

  waterLevelMin: 5,
};

export function validateConfig(
  config: typeof defaultConfig,
  setNotif: (n: { type: "success" | "error"; message: string }) => void
) {
  if (
    config.soilMoistureMin >= config.soilMoistureMax ||
    config.temperatureMin >= config.temperatureMax ||
    config.humidityMin >= config.humidityMax
  ) {
    setNotif({
      type: "error",
      message: "Nilai minimum harus lebih kecil dari maksimum.",
    });
    return false;
  }

  if (
    config.soilMoistureMin < 0 ||
    config.soilMoistureMax > 100 ||

    config.temperatureMin < -20 ||
    config.temperatureMax > 100 ||

    config.humidityMin < 0 ||
    config.humidityMax > 100 ||

    config.waterLevelMin < 0 ||
    config.waterLevelMin > 100
  ) {
    setNotif({
      type: "error",
      message: "Nilai di luar rentang yang diperbolehkan.",
    });
    return false;
  }

  return true;
}
