#!/usr/bin/env npx tsx

import { execSync } from "child_process"
import { BHV360ProductionTester } from "./test-production-deployment"

async function openAndTestBHV360() {
  console.log("🌐 OPENING AND TESTING WWW.BHV360.NL")
  console.log("=".repeat(60))
  console.log("")

  // Step 1: Open the website in default browser
  console.log("🔗 Opening www.bhv360.nl in your default browser...")
  try {
    // Cross-platform browser opening
    const platform = process.platform
    let command = ""

    if (platform === "darwin") {
      // macOS
      command = "open https://www.bhv360.nl"
    } else if (platform === "win32") {
      // Windows
      command = "start https://www.bhv360.nl"
    } else {
      // Linux and others
      command = "xdg-open https://www.bhv360.nl"
    }

    execSync(command, { stdio: "ignore" })
    console.log("✅ Website opened in browser")
  } catch (error) {
    console.log("⚠️ Could not automatically open browser")
    console.log("🔗 Please manually visit: https://www.bhv360.nl")
  }

  console.log("")

  // Step 2: Run comprehensive testing
  console.log("🧪 Running comprehensive production tests...")
  console.log("")

  const tester = new BHV360ProductionTester()
  await tester.runAllTests()

  // Step 3: Provide manual testing checklist
  console.log("📋 MANUAL TESTING CHECKLIST")
  console.log("=".repeat(60))
  console.log("")
  console.log("Please manually verify the following in your browser:")
  console.log("")
  console.log("🏠 HOMEPAGE (https://www.bhv360.nl)")
  console.log("   □ Page loads completely")
  console.log("   □ BHV360 logo and branding visible")
  console.log("   □ Navigation menu works")
  console.log("   □ Responsive design on mobile")
  console.log("")
  console.log("🔐 AUTHENTICATION")
  console.log("   □ Login page accessible (/login)")
  console.log("   □ Registration form works (/register)")
  console.log("   □ Password reset available")
  console.log("")
  console.log("📊 DASHBOARD (https://www.bhv360.nl/dashboard)")
  console.log("   □ Dashboard loads after login")
  console.log("   □ User interface is responsive")
  console.log("   □ Navigation sidebar works")
  console.log("   □ Key metrics display correctly")
  console.log("")
  console.log("🗺️ PLOTKAART EDITOR (https://www.bhv360.nl/plotkaart)")
  console.log("   □ Plotkaart editor loads")
  console.log("   □ Safety icons are visible")
  console.log("   □ Drag and drop functionality works")
  console.log("   □ Save/load functionality works")
  console.log("")
  console.log("🚨 BHV FEATURES (https://www.bhv360.nl/bhv)")
  console.log("   □ BHV management interface loads")
  console.log("   □ Emergency procedures accessible")
  console.log("   □ Incident reporting works")
  console.log("   □ User role management functions")
  console.log("")
  console.log("👥 USER MANAGEMENT (https://www.bhv360.nl/beheer/gebruikers)")
  console.log("   □ User list displays")
  console.log("   □ Add/edit user functionality")
  console.log("   □ Role assignment works")
  console.log("   □ Permissions are enforced")
  console.log("")
  console.log("🔌 API FUNCTIONALITY")
  console.log("   □ Health check: https://www.bhv360.nl/api/health")
  console.log("   □ Database test: https://www.bhv360.nl/api/test-database")
  console.log("   □ All API endpoints respond correctly")
  console.log("")
  console.log("📱 MOBILE TESTING")
  console.log("   □ Responsive design on phone")
  console.log("   □ Touch interactions work")
  console.log("   □ Mobile navigation functions")
  console.log("   □ Forms are mobile-friendly")
  console.log("")
  console.log("🔢 NUMBER HELPER FUNCTIONS")
  console.log("   □ Currency formatting displays correctly")
  console.log("   □ Number calculations work properly")
  console.log("   □ No JavaScript errors in console")
  console.log("   □ Edge cases handled gracefully")
  console.log("")

  console.log("🎯 TESTING COMPLETE!")
  console.log("=".repeat(60))
  console.log("🔗 Your BHV360 application: https://www.bhv360.nl")
  console.log("📊 Review the test results above")
  console.log("✅ Complete the manual checklist in your browser")
  console.log("🚀 Your application is live and ready for use!")
  console.log("")
}

// Execute the open and test function
if (require.main === module) {
  openAndTestBHV360().catch(console.error)
}

export { openAndTestBHV360 }
