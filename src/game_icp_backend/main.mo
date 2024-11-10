import Nat "mo:base/Nat";
import Random "mo:base/Random";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import ManagementCanister "ic:aaaaa-aa";


actor {
  var random_history = Buffer.Buffer<Nat>(0);
  public func random_number() : async Text {

    let randomBlob = await ManagementCanister.raw_rand();

    let finite = Random.Finite(randomBlob);

    let maybeNullrandomNumber = finite.range(4);

    switch (maybeNullrandomNumber) {
      case null return "";
      case (?randomNumber) {
        let rdn:Nat = (randomNumber % 6) + 1;
        random_history.add(rdn);
        return debug_show (rdn);
      };

    };
  };

  public query func get_random_history(): async [Nat]{
    Buffer.toArray(random_history);
  };
};
