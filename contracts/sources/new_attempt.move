module my_management_addr::on_chain_geo_v1 {
    use std::string::{Self, String};
    use aptos_framework::object::{Self, Object};
    use std::option::{Self};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_framework::timestamp; 
    use std::signer;
    use std::error;


    #[test_only]
    use aptos_std::debug::print;

    struct GeoCoordinate has store, copy, drop {
        latitude: u128,
        latitude_is_negative: bool,
        longitude: u128,
        longitude_is_negative: bool 
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct AdminConfig has key {
        admin: address,
    }

    const EMPTY_STRING: vector<u8> = b"";

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct GeoFence has key {
        name: String,
        start_date: u64,
        end_date: u64,
        geo_coordinate: GeoCoordinate,
        radius_miles: u128,               // Fixed-point with 8 decimals
        mutator_ref: collection::MutatorRef,
        uri: String,
    }

    struct GeoFenceTicket has key {
        ticket_id: String,
        receiver: address,
        geofence: Object<GeoFence>,
        current_time: u64,
        geo_coordinate: GeoCoordinate,
    }



    const E_NOT_AUTHORIZED: u64 = 1;

      fun init_module(sender: &signer) {

        let on_chain_config = AdminConfig {
            admin: signer::address_of(sender),
        };
        move_to(sender, on_chain_config);
    }

    public entry fun create_geofence(
        account: &signer, 
        name: String, 
        start_date: u64, 
        end_date: u64, 
        longitude_value: u128, // Absolute value with 8 decimals
        longitude_is_negative: bool, // Sign bit
        latitude_value: u128,  // Absolute value with 8 decimals
        latitude_is_negative: bool,  // Sign bit
        radius_miles: u128,          // Fixed-point with 8 decimals
        uri: String
    )  {
        let geo_coordinate = GeoCoordinate { 
            longitude: longitude_value, 
            longitude_is_negative, 
            latitude: latitude_value, 
            latitude_is_negative 
        };

        let collection_constructor_ref = collection::create_unlimited_collection(
            account,
            string::utf8(EMPTY_STRING),
            name,
            option::none(),
            uri,
        );
        let object_signer = object::generate_signer(&collection_constructor_ref);
        let mutator_ref = collection::generate_mutator_ref(&collection_constructor_ref);
        
        let new_geofence = GeoFence {
            name,
            start_date,
            end_date,
            geo_coordinate,
            radius_miles,
            mutator_ref,
            uri,
        };

        move_to(&object_signer, new_geofence);
    }

    public entry fun is_within_geo(
        admin: &signer, 
        geofence: Object<GeoFence>, 
        longitude_value: u128, // Absolute value with 8 decimals
        longitude_is_negative: bool, // Sign bit
        latitude_value: u128,  // Absolute value with 8 decimals
        latitude_is_negative: bool,  // Sign bit
        ticket_id: String,
        receiver: address
    ) acquires GeoFence, AdminConfig {
        is_admin(admin);

        let geo_coordinate = GeoCoordinate { 
            longitude: longitude_value, 
            longitude_is_negative, 
            latitude: latitude_value, 
            latitude_is_negative 
        };

        let geofence_obj = borrow_global<GeoFence>(object::object_address(&geofence));

        let current_time = timestamp::now_seconds();

        if (current_time >= geofence_obj.start_date && current_time <= geofence_obj.end_date) {
            // Mint a token to the signer
            let token_constructor_ref = token::create_named_token(admin, geofence_obj.name, string::utf8(EMPTY_STRING), ticket_id, option::none(), geofence_obj.uri);
            let object_signer = object::generate_signer(&token_constructor_ref);
            let transfer_ref = object::generate_transfer_ref(&token_constructor_ref);
            object::disable_ungated_transfer(&transfer_ref);
            let linear_transfer_ref = object::generate_linear_transfer_ref(&transfer_ref);
            object::transfer_with_ref(linear_transfer_ref, receiver);

            let ticket = GeoFenceTicket {
                ticket_id,
                receiver,
                geofence,
                current_time,
                geo_coordinate,
                // transfer_events: object::new_event_handle(&object_signer),
            };

            move_to(&object_signer, ticket);
        }
    }

     inline fun is_admin(admin: &signer): &AdminConfig {
        let admin_addr = signer::address_of(admin);
        let nyc_config_obj = borrow_global<AdminConfig>(admin_addr);
        assert!(nyc_config_obj.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));

        nyc_config_obj
    }
}