package main

import (
	"net/http"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	e.POST("/decode", decodeHandler)
	e.Logger.Fatal(e.Start(":8000"))
}

type DecodeRequest struct {
	Value string `json:"value" validate:"required"`
	Key   string `json:"key" validate:"required"`
}

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return nil
}

func decodeHandler(c echo.Context) error {
	var req DecodeRequest
	if err := c.Bind(&req); err != nil {
		return err
	}
	if err := c.Validate(&req); err != nil {
		return err
	}

	return c.String(http.StatusOK, DecodeCipher(req.Value, req.Key))
}
