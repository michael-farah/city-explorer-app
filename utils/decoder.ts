import { decode } from "@googlemaps/polyline-codec";

export const decodeRoutesPolyline = (
  encodedPolyline: string,
): { latitude: number; longitude: number }[] => {
  const decodedPolyline = decode(encodedPolyline);

  return decodedPolyline.map(([latitude, longitude]) => ({
    latitude,
    longitude,
  }));
};