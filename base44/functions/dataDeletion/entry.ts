Deno.serve(async (req) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Data Deletion - Cone Finder</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; color: #1a1a2e; line-height: 1.7; }
    h1 { color: #0ea5e9; font-size: 2rem; margin-bottom: 8px; }
    h2 { color: #0284c7; font-size: 1.2rem; margin-top: 32px; }
    a { color: #0ea5e9; }
    .step { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px 16px; margin: 8px 0; border-radius: 4px; }
    .note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>🍦 Data Deletion - Cone Finder</h1>
  <p>We respect your privacy. You can request deletion of your personal data at any time using the methods below.</p>

  <h2>Option 1: Delete Your Data In-App</h2>
  <p>You can delete your van profile and associated data directly within the app:</p>
  <div class="step">1. Open the Cone Finder app</div>
  <div class="step">2. Tap the ⚙️ Settings icon on the home screen</div>
  <div class="step">3. Scroll down and tap <strong>Delete My Data</strong></div>
  <div class="step">4. Confirm deletion — this immediately removes your van profile, location history, and messages</div>

  <h2>Option 2: Request Full Account Deletion</h2>
  <p>To request complete account deletion, contact us via:</p>
  <ul>
    <li>In-app: Settings → Contact Us</li>
    <li>Email: <a href="mailto:support@conefinder.app">support@conefinder.app</a></li>
  </ul>
  <p>Include "Account Deletion Request" in the subject line. We will process your request within 30 days.</p>

  <h2>What Gets Deleted</h2>
  <ul>
    <li>Van profile (name, photo, pricing, specialties)</li>
    <li>Location data and sighting history</li>
    <li>Messages and reviews associated with your account</li>
    <li>Account credentials and personal identifiers</li>
  </ul>

  <div class="note">
    <strong>Note:</strong> Some anonymised, aggregated data may be retained for up to 90 days for security and fraud prevention purposes, after which it is permanently deleted.
  </div>

  <p style="margin-top: 40px; font-size: 0.85rem; color: #666;">
    Last updated: June 2026 · <a href="/">Back to Cone Finder</a> · <a href="/privacy">Privacy Policy</a>
  </p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
});