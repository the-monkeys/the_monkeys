#!/bin/bash

set -x

# Generate a private key for the client:
openssl genrsa -out client.key 2048

# Generate a certificate signing request (CSR) for the client:
openssl req -new -key client.key -out client.csr

# Generate a self-signed certificate for the client:
openssl x509 -req -days 365 -in client.csr -signkey client.key -out client.crt
