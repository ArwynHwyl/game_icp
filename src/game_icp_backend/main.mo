import Nat "mo:base/Nat";
import Random "mo:base/Random";
import ManagementCanister "ic:aaaaa-aa";

actor {

  public func guess_number() : async Nat {

    let randomBlob = await ManagementCanister.raw_rand();

    let finite = Random.Finite(randomBlob);

    let maybeNullrandomNumber = finite.range(4);

    switch(maybeNullrandomNumber) {
      case null return 1;
      case (?randomNumber) {

        return (randomNumber % 6) + 1;}


  };
};
};