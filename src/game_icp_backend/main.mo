import Nat "mo:base/Nat";
import Random "mo:base/Random";
import Text "mo:base/Text";
import ManagementCanister "ic:aaaaa-aa";

actor {

  public func random_number() : async Text {

    let randomBlob = await ManagementCanister.raw_rand();

    let finite = Random.Finite(randomBlob);

    let maybeNullrandomNumber = finite.range(4);

    switch(maybeNullrandomNumber) {
      case null return "";
      case (?randomNumber) {

        return debug_show( (randomNumber % 6) + 1);
        }


  };
};
};