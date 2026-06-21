# Yasminaai Rust Library

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2FYasminaAI%2Fmotor-rust-sdk)
[![crates.io shield](https://img.shields.io/crates/v/yasminaai_api)](https://crates.io/crates/yasminaai_api)

The Yasminaai Rust library provides convenient access to the Yasminaai APIs from Rust.

## Table of Contents

- [Installation](#installation)
- [Reference](#reference)
- [Usage](#usage)
- [Environments](#environments)
- [Errors](#errors)
- [Request Types](#request-types)
- [Advanced](#advanced)
  - [Retries](#retries)
  - [Timeouts](#timeouts)
  - [Additional Headers](#additional-headers)
  - [Additional Query String Parameters](#additional-query-string-parameters)
- [Contributing](#contributing)

## Installation

Add this to your `Cargo.toml`:

```toml
[dependencies]
yasminaai_api = "0.1.0"
```

Or install via cargo:

```sh
cargo add yasminaai_api
```

## Reference

A full reference for this library is available [here](https://github.com/YasminaAI/motor-rust-sdk/blob/HEAD/./reference.md).

## Usage

Instantiate and use the client with the following:

```rust
use yasminaai_api::prelude::*;

#[tokio::main]
async fn main() {
    let config = ClientConfig {
        token: Some("<token>".to_string()),
        ..Default::default()
    };
    let client = ApiClient::new(config).expect("Failed to build client");
    client
        .quotes
        .request_quotes(
            &PostQuoteRequestsRequest {
                otp: "123456".to_string(),
                owner_id: "owner_id".to_string(),
                phone: "phone".to_string(),
                birthdate: NaiveDate::parse_from_str("2023-01-15", "%Y-%m-%d").unwrap(),
                car_estimated_cost: 1.1,
                email: None,
                car_sequence_number: None,
                custom_number: None,
                is_ownership_transfer: None,
                current_car_owner_id: None,
                car_model_year: None,
                start_date: None,
                drivers: None,
            },
            None,
        )
        .await;
}
```

## Environments

This SDK allows you to configure different environments for API requests.

```rust
use yasminaai_api::prelude::{*};

let config = ClientConfig {
    base_url: Environment::Sandbox.url().to_string(),
    ..Default::default()
};
let client = Client::new(config).expect("Failed to build client");
```

## Errors

When the API returns a non-success status code (4xx or 5xx response), an error will be returned.

```rust
match client.quotes.request_quotes(None)?.await {
    Ok(response) => {
        println!("Success: {:?}", response);
    },
    Err(ApiError::HTTP { status, message }) => {
        println!("API Error {}: {:?}", status, message);
    },
    Err(e) => {
        println!("Other error: {:?}", e);
    }
}
```

## Request Types

The SDK exports all request types as Rust structs. Simply import them from the crate to access them:

```rust
use yasminaai_api::prelude::{*};

let request = PostQuoteRequestsRequest {
    ...
};
```

## Advanced

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long
as the request is deemed retryable and the number of retry attempts has not grown larger than the configured
retry limit (default: 2).

A request is deemed retryable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses) (Internal Server Error)

The `retryStatusCodes` configuration controls which [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses) status codes are retried:

- `legacy` (default): Retries `408`, `429`, and all `>= 500`
- `recommended`: Retries `408`, `429`, `502`, `503`, `504` only (excludes `500 Internal Server Error` to avoid retrying non-idempotent failures)

Use the `max_retries` method to configure this behavior.

```rust
let response = client.quotes.request_quotes(
    Some(RequestOptions::new().max_retries(3))
)?.await;
```

### Timeouts

The SDK defaults to a 30 second timeout. Use the `timeout` method to configure this behavior.

```rust
let response = client.quotes.request_quotes(
    Some(RequestOptions::new().timeout_seconds(30))
)?.await;
```

### Additional Headers

You can add custom headers to requests using `RequestOptions`.

```rust
let response = client.quotes.request_quotes(
    Some(
        RequestOptions::new()
            .additional_header("X-Custom-Header", "custom-value")
            .additional_header("X-Another-Header", "another-value")
    )
)?
.await;
```

### Additional Query String Parameters

You can add custom query parameters to requests using `RequestOptions`.

```rust
let response = client.quotes.request_quotes(
    Some(
        RequestOptions::new()
            .additional_query_param("filter", "active")
            .additional_query_param("sort", "desc")
    )
)?
.await;
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
