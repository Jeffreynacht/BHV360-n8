#!/bin/bash

# Performance Testing Script voor BHV360
# Voert verschillende performance tests uit

echo "🚀 Starting BHV360 Performance Tests"

# Configuratie
BASE_URL=${1:-"http://localhost:3000"}
CONCURRENT_USERS=${2:-50}
TEST_DURATION=${3:-300}

echo "📊 Configuration:"
echo "  Base URL: $BASE_URL"
echo "  Concurrent Users: $CONCURRENT_USERS"
echo "  Test Duration: ${TEST_DURATION}s"
echo ""

# Check if server is running
echo "🔍 Checking server availability..."
if ! curl -s "$BASE_URL" > /dev/null; then
    echo "❌ Server is not responding at $BASE_URL"
    exit 1
fi
echo "✅ Server is responding"

# Run load test via API
echo "🏃 Starting load test..."
curl -X POST "$BASE_URL/api/performance/load-test" \
  -H "Content-Type: application/json" \
  -d "{
    \"concurrentUsers\": $CONCURRENT_USERS,
    \"testDuration\": $TEST_DURATION,
    \"rampUpTime\": 60
  }" \
  -o load-test-results.json

if [ $? -eq 0 ]; then
    echo "✅ Load test completed successfully"
    echo "📄 Results saved to load-test-results.json"
else
    echo "❌ Load test failed"
    exit 1
fi

# Display summary
echo ""
echo "📊 Test Summary:"
if command -v jq &> /dev/null; then
    cat load-test-results.json | jq '.report.summary'
else
    echo "Install 'jq' to see formatted results, or check load-test-results.json manually"
    cat load-test-results.json
fi

echo ""
echo "🎉 Performance testing completed!"
