"use client"

import Head from "next/head"
import { useState } from "react"
import { Shield, Bell, Users } from "lucide-react"

export default function ApiDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("auth")

  const endpoints = {
    auth: {
      icon: <Shield className="h-5 w-5" />,
      title: "Authentication",
      description: "User authentication and authorization",
      methods: [
        {
          method: "POST",
          path: "/api/auth/login",
          description: "Login user with email and password",
          body: { email: "string", password: "string" },
          response: { token: "string", user: "object" },
        },
        {
          method: "POST",
          path: "/api/auth/logout",
          description: "Logout current user",
          response: { success: "boolean" },
        },
        {
          method: "GET",
          path: "/api/auth/status",
          description: "Get current user status",
          response: { authenticated: "boolean", user: "object" },
        },
      ],
    },
    users: {
      icon: <Users className="h-5 w-5" />,
      title: "Users",
      description: "User management and profiles",
      methods: [
        {
          method: "GET",
          path: "/api/users",
          description: "Get all users",
          response: { users: "array" },
        },
        {
          method: "POST",
          path: "/api/users",
          description: "Create new user",
          body: { name: "string", email: "string", role: "string" },
          response: { user: "object" },
        },
        {
          method: "PUT",
          path: "/api/users/:id",
          description: "Update user",
          body: { name: "string", email: "string" },
          response: { user: "object" },
        },
      ],
    },
    notifications: {
      icon: <Bell className="h-5 w-5" />,
      title: "Notifications",
      description: "Push notifications and alerts",
      methods: [
        {
          method: "POST",
          path: "/api/notifications/send",
          description: "Send notification",
          body: { title: "string", message: "string", channels: "array" },
          response: { success: "boolean", sent: "number" },
        },
        {
          method: "POST",
          path: "/api/notifications/bulk",
          description: "Send bulk notifications",
          body: { notifications: "array" },
          response: { success: "boolean", results: "array" },
        },
      ],
    },
  }

  return (
    <>
      <Head>
        <title>API Reference - BHV360 Documentation</title>
        <meta name="description" content="Complete API reference voor BHV360" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">API Reference</h1>
            <p className="text-xl text-gray-600">Complete documentatie van alle BHV360 API endpoints</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h3>
                <nav className="space-y-2">
                  {Object.entries(endpoints).map(([key, endpoint]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedEndpoint(key)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedEndpoint === key ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {endpoint.icon}
                      <span className="ml-3">{endpoint.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center mb-2">
                    {endpoints[selectedEndpoint].icon}
                    <h2 className="text-2xl font-bold text-gray-900 ml-3">{endpoints[selectedEndpoint].title}</h2>
                  </div>
                  <p className="text-gray-600">{endpoints[selectedEndpoint].description}</p>
                </div>

                <div className="p-6">
                  <div className="space-y-8">
                    {endpoints[selectedEndpoint].methods.map((method, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              method.method === "GET"
                                ? "bg-green-100 text-green-800"
                                : method.method === "POST"
                                  ? "bg-blue-100 text-blue-800"
                                  : method.method === "PUT"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {method.method}
                          </span>
                          <code className="ml-3 text-lg font-mono text-gray-900">{method.path}</code>
                        </div>

                        <p className="text-gray-600 mb-4">{method.description}</p>

                        {method.body && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body:</h4>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code>{JSON.stringify(method.body, null, 2)}</code>
                            </pre>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Response:</h4>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <code>{JSON.stringify(method.response, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
