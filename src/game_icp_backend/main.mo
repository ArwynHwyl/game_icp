import Nat "mo:base/Nat";
import Random "mo:base/Random";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import ManagementCanister "ic:aaaaa-aa";

actor {
    // Store dice roll history per user
    private var userHistory = HashMap.HashMap<Principal, Buffer.Buffer<Nat>>(0, Principal.equal, Principal.hash);

    public shared(msg) func random_number() : async Text {
        let caller = msg.caller;

        // Create history buffer for new users
        switch (userHistory.get(caller)) {
            case null {
                userHistory.put(caller, Buffer.Buffer<Nat>(0));
            };
            case _ {};
        };

        let randomBlob = await ManagementCanister.raw_rand();
        let finite = Random.Finite(randomBlob);

        switch (finite.range(4)) {
            case null return "";
            case (?randomNumber) {
                let rdn: Nat = (randomNumber % 6) + 1;

                // Add to user's history
                switch (userHistory.get(caller)) {
                    case (?buffer) {
                        buffer.add(rdn);
                        userHistory.put(caller, buffer);
                    };
                    case null {};
                };

                return debug_show(rdn);
            };
        };
    };

    public shared query(msg) func get_user_history(): async [Nat] {
        let caller = msg.caller;
        switch (userHistory.get(caller)) {
            case (?buffer) {
                Buffer.toArray(buffer);
            };
            case null {
                [];
            };
        };
    };
};