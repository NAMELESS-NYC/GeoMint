import { aptos } from "../../configs/aptos";

//Function to get all Geo Fences created by the contract

export const getGeoFence = async (address) => {
  const object = await aptos.getObjectDataByObjectAddress({
    objectAddress: address,
  });
  const details = await getGeoFenceObjectDetails(object.object_address);
  const geo = formatGeo(details);
  console.log(geo);
  return geo;
};

export async function getGeoFenceObjectDetails(objectAddr) {
  const resourceType = `${process.env.REACT_APP_GEO_CONTRACT_ADDRESS}::on_chain_geo_v1::GeoFence`;
  try {
    const resource = await aptos.getAccountResource({
      accountAddress: objectAddr,
      resourceType: resourceType,
    });
    return resource;
  } catch (e) {}
}

export async function getOwnedCheckins(address) {
  //get account owned tokens
  const tokens = await aptos.getAccountOwnedTokens({
    accountAddress: address,
  });
  // console.log(tokens);
  let checkIns = [];
  //Find the tokens that are check ins
  for (const token of tokens) {
    if (
      token.current_token_data?.current_collection?.creator_address ===
      process.env.REACT_APP_GEO_CONTRACT_ADDRESS
    ) {
      checkIns.push(token);
    }
  }
  console.log(checkIns);
  return checkIns;
}

const formatGeo = (geo) => {
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
  };
};
