export function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000; // meters
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const sinDlat = Math.sin(dLat / 2);
  const sinDlng = Math.sin(dLng / 2);

  const h = sinDlat * sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlng * sinDlng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return R * c;
}

export function namesLookSimilar(a: string, b: string) {
  const na = a.toLowerCase().replace(/[^a-z0-9]/g,"");
  const nb = b.toLowerCase().replace(/[^a-z0-9]/g,"");
  return na === nb;
}

export function isLikelyDuplicate(
  existing: Array<{ name: string; lat?: number | null; lng?: number | null }>,
  candidate: { name: string; lat?: number; lng?: number },
  radiusMeters = 50
) {
  if (candidate.lat == null || candidate.lng == null) return false;
  return existing.some((e) => {
    if (e.lat == null || e.lng == null) return false;
    const close = haversineMeters(
      { lat: e.lat as number, lng: e.lng as number },
      { lat: candidate.lat!, lng: candidate.lng! }
    ) <= radiusMeters;
    return close && namesLookSimilar(e.name, candidate.name);
  });
}
