#!/bin/bash

echo "🔍 Testing BHV360 Domain Configuration"
echo "====================================="

domains=("bhv360.nl" "www.bhv360.nl" "bhv360.com" "www.bhv360.com")

for domain in "${domains[@]}"; do
    echo ""
    echo "Testing: $domain"
    echo "----------------"
    
    # DNS lookup
    echo "DNS A Record:"
    nslookup $domain | grep "Address:" | tail -1
    
    # HTTP test
    echo "HTTP Response:"
    curl -I -s -w "%{http_code} %{redirect_url}\n" https://$domain | head -1
    
    echo "---"
done

echo ""
echo "✅ Domain test complete!"
echo "Expected results:"
echo "- bhv360.nl: 200 (main site)"
echo "- www.bhv360.nl: 301 redirect to bhv360.nl"
echo "- bhv360.com: 301 redirect to bhv360.nl (if configured)"
echo "- www.bhv360.com: 301 redirect to bhv360.nl (if configured)"
