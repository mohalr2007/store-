/**
 * Utility to sync data to Google Sheets via an Apps Script Webhook.
 */

export async function syncToGoogleSheets(action: "create" | "update", data: any) {
  // SECURITY: never use NEXT_PUBLIC_ prefix for webhook — that exposes the URL in the browser bundle
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  
  if (!webhookUrl) {
    return { success: false, error: "Not configured" };
  }

  try {
    const payload = {
      action,
      timestamp: new Date().toISOString(),
      data
    };

    const isServer = typeof window === "undefined";
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      mode: isServer ? "cors" : "no-cors", 
    });

    if (isServer && !response.ok) {
       return { success: false, error: response.statusText };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
