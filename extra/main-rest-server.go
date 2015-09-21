package main

import (
	"database/sql"
	"encoding/json"
	"encoding/xml"
	"log"
	"net/http"
	"regexp"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

const (
	ERROR500 = "<Error>internal server error</Error>"
)

type Encoder interface {
	Encode(interface{}) error
}

type Decoder interface {
	Decode(interface{}) error
}

func NewContentNegocationEncoder(r *http.Request, w http.ResponseWriter) Encoder {
	accept := r.Header.Get("Accept")
	match, err := regexp.MatchString("xml", accept)
	if err == nil && match == true {
		w.Header().Add("Content-Type", "text/xml")
		return xml.NewEncoder(w)
	}
	w.Header().Add("Content-Type", "application/json")
	return json.NewEncoder(w)
}

func NewContentNegocationDecoder(r *http.Request) Decoder {
	accept := r.Header.Get("Content-Type")
	if accept == "" {
		return json.NewDecoder(r.Body)
	}
	match, err := regexp.MatchString("xml", accept)
	if err != nil {
		return json.NewDecoder(r.Body)
	}
	if match == true {
		return xml.NewDecoder(r.Body)
	}
	return json.NewDecoder(r.Body)
}

type (
	AddressList struct {
		Address Addresses `json:"Addresses"`
	}
	Addresses []Address
	Address   struct {
		Id      int64
		Country string
		City    string
	}
	AddressRepository struct {
		connection *sql.DB
	}
)

func (ar AddressRepository) Insert(address *Address) error {
	result, err := ar.connection.Exec("INSERT INTO addresses(city,country) values(?,?)", address.City, address.Country)
	if err != nil {
		return err
	}
	lastId, err := result.LastInsertId()
	if err != nil {
		return err
	}
	address.Id = lastId
	return nil
}
func (ar AddressRepository) GetAll(addresses *Addresses) error {
	rows, err := ar.connection.Query("SELECT * FROM addresses")
	if err != nil {
		return err
	}
	err = sqlx.StructScan(rows, addresses)
	if err != nil {
		return err
	}
	return nil
}

func GetDBConnection() (*sql.DB, error) {
	connection, err := sql.Open("sqlite3", "./addresses.sqlite3")
	if err != nil {
		return nil, err
	}
	return connection, nil
}

func Error500(rw http.ResponseWriter, err error) {
	log.Print("ERROR : ", err)
	http.Error(rw, ERROR500, http.StatusInternalServerError)
}

func main() {
	addr := "127.0.0.1:9000"
	mux := http.NewServeMux()
	mux.HandleFunc("/addresses", func(rw http.ResponseWriter, r *http.Request) {
		var (
			connection *sql.DB
			err        error
		)
		// CORS
		rw.Header().Add("Access-Control-Allow-Origin", "*")
		// Debug
		log.Print("DEBUG : ", r.Method, r.URL.String())
		if r.Method == "POST" {
			address := &Address{}
			err = NewContentNegocationDecoder(r).Decode(address)
			defer r.Body.Close()
			if err != nil {
				Error500(rw, err)
				return
			}
			connection, err = GetDBConnection()
			defer connection.Close()
			if err != nil {
				Error500(rw, err)
				return
			}
			addressRepository := AddressRepository{connection}
			err := addressRepository.Insert(address)
			if err != nil {
				Error500(rw, err)
				return
			}
			rw.WriteHeader(http.StatusCreated)
			err = xml.NewEncoder(rw).Encode(address)
			if err != nil {
				Error500(rw, err)
			}
		} else if r.Method == "GET" {
			addresses := Addresses{}
			connection, err = GetDBConnection()
			defer connection.Close()
			if err != nil {
				Error500(rw, err)
				return
			}
			addressRepository := &AddressRepository{connection}
			err = addressRepository.GetAll(&addresses)
			if err != nil {
				Error500(rw, err)
			}
			err = NewContentNegocationEncoder(r, rw).Encode(AddressList{addresses})
			if err != nil {
				Error500(rw, err)
			}
		} else {
			http.NotFound(rw, r)

		}

	})
	log.Print("Listening on : ", addr)
	err := http.ListenAndServe(addr, mux)
	if err != nil {
		log.Fatal(err)
	}
}
