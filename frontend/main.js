angular.module("vigenereApp", [])
  .controller("vigenereController", ["$scope", function($scope) {
    $scope.encodeInput = "";
    $scope.encodeKey = "key";
    $scope.encodeOutput = "";

    $scope.$watch("encodeKey", () => {
      $scope.encodeKey = $scope.encodeKey.replaceAll(/[^a-zA-Z]/g, "");
    });

    $scope.$watch("[encodeInput, encodeKey]", () => {
      $scope.encodeOutput = encode($scope.encodeInput ?? "", $scope.encodeKey ?? "");
    });
  }]);

/*String*/ function cleanse(in_str) {
  console.log(in_str);
  let out_str = in_str.toUpperCase();
  return out_str;
}

/*String*/ function encode(in_str, in_key) {
  const VALID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // dprint-ignore
  const TOLET = { 0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F", 6: "G", 7: "H", 8: "I", 9: "J", 10: "K", 11: "L", 12: "M", 13: "N", 14: "O", 15: "P", 16: "Q", 17: "R", 18: "S", 19: "T", 20: "U", 21: "V", 22: "W", 23: "X", 24: "Y", 25: "Z" };
  // dprint-ignore
  const TONUM = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25 };
  let key_i = 0;
  let out_str = "";
  in_str = cleanse(in_str);
  in_key = cleanse(in_key);

  if ([in_str, in_key].some((v) => v.length == 0)) {
    return "";
  }

  for (let i = 0; i < in_str.length; i++) {
    if (!VALID_CHARS.includes(in_str[i])) {
      out_str += in_str[i];
      continue;
    }

    out_str += TOLET[
      (TONUM[in_str[i]] + TONUM[in_key[key_i]] + 1) % 26
    ];

    key_i = (key_i + 1) % in_key.length;
  }

  return out_str;
}
