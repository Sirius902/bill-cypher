package main

import "strings"

// TODO: validate key and make impl not bad
func DecodeCipher(value string, key string) string {
	value = strings.ToUpper(value)

	var res strings.Builder
	cipherIndex := 0
	for _, r := range value {
		if isInAlphabet(r) {
			rr := (r - 'A') - (rune(key[cipherIndex%len(key)]) - 'A') + 'A'
			res.WriteRune(rr)
			cipherIndex++
		} else {
			res.WriteRune(r)
		}
	}
	return res.String()
}

func isInAlphabet(r rune) bool {
	return 'A' <= r && r <= 'Z'
}
