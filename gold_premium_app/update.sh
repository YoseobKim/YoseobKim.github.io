#!/bin/bash
curl -X GET https://goldkimp.com/wp-content/uploads/json/gold_premium_series.json > json/gold_premium_series.json
curl -X GET https://goldkimp.com/wp-json/gk/gold/v1?tf=15m > json/gold_tf_15m.json
curl -X GET https://goldkimp.com/wp-json/gk/gold/v1?tf=30m > json/gold_tf_30m.json
curl -X GET https://goldkimp.com/wp-json/gk/gold/v1?tf=1h > json/gold_tf_1h.json
