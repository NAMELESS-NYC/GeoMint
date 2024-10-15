import {
  Aptos,
  AptosConfig,
  Network,
  AccountAddressInput,
} from "@aptos-labs/ts-sdk";

async function getGeofences(accountAddress: AccountAddressInput) {
  const aptosConfig = new AptosConfig({
    network: Network.TESTNET,
  });
  const aptos = new Aptos(aptosConfig);
  const resources = await aptos.getAccountOwnedObjects({
    accountAddress,
  });
  return resources;
}

async function getGeoFenceObjectDetails(objectAddr: string) {
  const aptosConfig = new AptosConfig({
    network: Network.TESTNET,
  });
  const aptos = new Aptos(aptosConfig);
  const resourceType: `${string}::${string}::${string}` =
    "0x4085614bac67f35aaa8843566633d3b05e182e53af02bad646e42cf734e68afd::on_chain_geo_v1::GeoFence";
  const resource = await aptos.getAccountResource({
    accountAddress: objectAddr,
    resourceType: resourceType,
  });
  console.log(resource);
}

// const accountAddress =
//   "0x4085614bac67f35aaa8843566633d3b05e182e53af02bad646e42cf734e68afd"; // Replace with the account address used in create_geofence.js
// getGeofences(accountAddress).catch(console.error);

const accountAddress =
  "0x05af8855fdb6584a2c77d815b7105f5cb4a358504cbe43e7a6844aa31195e9ce"; // Replace with the account address used in create_geofence.js
getGeoFenceObjectDetails(accountAddress).catch(console.error);
