import * as React from "react";

interface BaseEmailProps {
  title: string;
  previewText?: string;
  children: React.ReactNode;
}

export function BaseEmail({ title, previewText, children }: BaseEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </head>
      <body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: "#f5f5f5",
          margin: 0,
          padding: 0,
        }}
      >
        {previewText && (
          <div
            style={{
              display: "none",
              fontSize: "1px",
              lineHeight: "1px",
              maxHeight: 0,
              maxWidth: 0,
              opacity: 0,
              overflow: "hidden",
            }}
          >
            {previewText}
          </div>
        )}

        <table
          role="presentation"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#f5f5f5",
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "40px 20px" }}>
                {/* Main container */}
                <table
                  role="presentation"
                  style={{
                    maxWidth: "600px",
                    margin: "0 auto",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          padding: "32px 40px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e5e5",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#2563eb",
                            margin: 0,
                          }}
                        >
                          🐾 Waggle
                        </h1>
                      </td>
                    </tr>

                    {/* Content */}
                    <tr>
                      <td style={{ padding: "40px" }}>{children}</td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          padding: "32px 40px",
                          textAlign: "center",
                          borderTop: "1px solid #e5e5e5",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666666",
                            margin: "0 0 12px 0",
                          }}
                        >
                          <a
                            href={siteUrl}
                            style={{
                              color: "#2563eb",
                              textDecoration: "none",
                              fontWeight: "500",
                            }}
                          >
                            Επίσκεψη Waggle
                          </a>
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#999999",
                            margin: 0,
                          }}
                        >
                          © 2025 Waggle. Η πλατφόρμα για pet sitting.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
