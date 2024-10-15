import { aptos } from "../../configs/aptos";

//Util code to get owned geofences for
export const getGeoFences = async (accountAddress) => {
  const resources = await aptos.getAccountOwnedObjects({
    accountAddress,
  });

  let geoFences = [];

  for (const resource of resources) {
    try {
      const geo = await getGeoFenceObjectDetails(resource.object_address);
      if (geo) {
        console.log(geo);
        const formattedGeo = formatGeo(geo);
        geoFences.push(formattedGeo);
      }
    } catch (e) {
      console.log(e);
    }
  }
  console.log(geoFences);
  return geoFences;
};

export async function getGeoFenceObjectDetails(objectAddr) {
  const resourceType = `${process.env.REACT_APP_GEO_CONTRACT_ADDRESS}::on_chain_geo_v1::GeoFence`;
  try {
    const resource = await aptos.getAccountResource({
      accountAddress: objectAddr,
      resourceType: resourceType,
    });
    console.log(resource);
    return resource;
  } catch (e) { }
}

export async function getGeoCheckins(collectionAddress) {
  try {
    const collectionData = await aptos.getCollectionDataByCollectionId({
      collectionId: collectionAddress,
    })
    console.log(collectionData);
    return collectionData.total_minted_v2;
  } catch (e) {
    console.error(e);
  }
}

const formatGeo = (geo) => {
  console.log(geo);
  return {
    name: geo.name,
    startDate: new Date(geo.start_date * 1000),
    endDate: new Date(geo.end_date * 1000),
    radius: Number(geo.radius_miles) / 10 ** 8,
    latitude: geo.geo_coordinate.latitude_is_negative
      ? (-1 * Number(geo.geo_coordinate.latitude)) / 10 ** 6
      : Number(geo.geo_coordinate.latitude) / 10 ** 6,
    longitude: geo.geo_coordinate.longitude_is_negative
      ? (-1 * Number(geo.geo_coordinate.longitude)) / 10 ** 6
      : Number(geo.geo_coordinate.longitude) / 10 ** 6,
    tokenUri: geo.uri,
    address: geo.mutator_ref?.self,
  };
};
