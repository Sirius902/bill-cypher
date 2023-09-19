package main

import "testing"

func TestDecodeCipher(t *testing.T) {
	const expected = "HELLO WORLD"
	decoded := DecodeCipher("HFLMO XOSLE", "AB")
	if decoded != expected {
		t.Fatalf(`Expected "%s", got "%s"`, expected, decoded)
	}
}
