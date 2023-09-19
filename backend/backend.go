package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
)

func main() {
	const port = 8000
	fmt.Printf("Starting server at http://localhost:%d\n", port)

	http.HandleFunc("/decode", decodeHandler)

	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatal(err)
	}
}

type decodeRequest struct {
	Value string `json:"value"`
	Key   string `json:"key"`
}

func decodeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Expected POST method", http.StatusMethodNotAllowed)
		return
	}

	if r.Header.Get("Content-Type") != "application/json" {
		http.Error(w, "Expected Content-Type to be application/json", http.StatusUnsupportedMediaType)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1048576)

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	var decodeReq decodeRequest
	if err := dec.Decode(&decodeReq); err != nil {
		if err.Error() == "http: request body too large" {
			http.Error(w, "Request body must not be larger than 1MB", http.StatusRequestEntityTooLarge)
		} else {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		}
		return
	}

	if err := dec.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
	}

	fmt.Fprintf(w, "%s", DecodeCipher(decodeReq.Value, decodeReq.Key))
}
