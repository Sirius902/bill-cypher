angular.module("vigenereApp", [])
  .controller("vigenereController", ["$scope", function($scope) {
    $scope.encodeInput = "";
    $scope.encodeKey = "key";
    $scope.encodeOutput = "";
    $scope.encodeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    $scope.encodePreserveChars = true;

    $scope.$watch("encodeKey", () => {
      $scope.encodeKey = $scope.encodeKey.replaceAll(/[^a-zA-Z]/g, "");
    });

    $scope.$watch("[encodeInput, encodeKey, encodeAlphabet, encodePreserveChars]", () => {
      $scope.encodeOutput = encode($scope.encodeInput ?? "", $scope.encodeKey ?? "", $scope.encodeAlphabet ?? "", $scope.encodePreserveChars ?? true);
    });

    $scope.copyEncodeOutput = () => {
      const elemTextarea = document.getElementsByClassName("encodeTextarea")[0]
      elemTextarea.select();
      elemTextarea.setSelectionRange(0, 99999); 
      navigator.clipboard.writeText(elemTextarea.value);

      const ANIMATION_MS = 500;
      const elemAlert = document.getElementsByClassName("encodeTextareaCopyAlert")[0]
      elemAlert.classList.add('animate');
      setTimeout(() => {elemAlert.classList.remove('animate')}, ANIMATION_MS )
    }

    $scope.encodeMoreOptions = false;


  }]);

/*String*/ function cleanse(in_str) {
  let out_str = in_str.toUpperCase();
  return out_str;
}

/*String*/ function encode(in_str, in_key, in_alphabet, cond_preserve_chars) {
  const VALID_CHARS = in_alphabet;
  const TOLET = {};
  const TONUM = {};
  for (let i = 0; i < VALID_CHARS.length; i++) {
    TOLET[i] = VALID_CHARS[i];
    TONUM[VALID_CHARS[i]] = i
  }
  
  let key_i = 0;
  let out_str = "";
  in_str = cleanse(in_str);
  in_key = cleanse(in_key);

  if ([in_str, in_key].some((v) => v.length == 0)) {
    return "";
  }

  for (let i = 0; i < in_str.length; i++) {
    if (!VALID_CHARS.includes(in_str[i])) {
      if(cond_preserve_chars || in_str[i] === " ") {out_str += in_str[i]};
      continue;
    }

    out_str += TOLET[
      (TONUM[in_str[i]] + TONUM[in_key[key_i]]) % 26
    ];

    key_i = (key_i + 1) % in_key.length;
  }

  return out_str;
}
