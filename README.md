
# Mail Server

This project is a self-hosted mail server designed to simplify sending emails from your applications. It acts as a centralized service that interfaces with various SMTP providers (like Gmail, Yahoo, etc.), allowing you to send emails via a simple API call.

## Problem Solved

Many applications require email functionality for features like contact forms, user registration, and notifications. While client-side libraries like `email.js` exist, they often come with limitations:

- **Rate Limits:** Free or low-tier plans often have strict limits on the number of emails you can send.
- **Security:** Exposing API keys or credentials on the client-side is a security risk.
- **Complexity:** Managing email sending across multiple projects can be cumbersome.

This mail server provides a robust backend solution to these problems. By managing multiple SMTP accounts, you can significantly increase your email sending capacity and keep your credentials secure on the server.

## Features

- **Centralized Emailing:** A single API endpoint for all your email needs.
- **Multiple SMTP Providers:** Configure and use multiple SMTP accounts from any provider (e.g., Gmail, Outlook, SendGrid).
- **Dynamic Templates:** Use Handlebars for powerful and dynamic HTML email emails.
- **Secure:** Credentials are kept secure on the server, never exposed to the client.
- **Scalable:** Distribute your email load across multiple SMTP accounts.
- **Easy to Use:** Send complex, templated emails with a simple JSON payload.

## Tech Stack

- **Node.js:** A fast and scalable JavaScript runtime.
- **Express.js:** A minimal and flexible Node.js web application framework.
- **TypeScript:** For type safety and improved developer experience.
- **Nodemailer:** The de-facto standard for sending emails in Node.js.
- **Handlebars:** For powerful and dynamic email templating.

## Architecture Diagram

```
+--------------+      +----------------+      +-------------+      +-----------------+      +-----------+
| Your Client  |----->|  API Request   |----->| Mail Server |----->|  SMTP Provider  |----->| Recipient |
| (e.g., Web)  |      | (POST /send)   |      | (This App)  |      | (e.g., Gmail)   |      |           |
+--------------+      +----------------+      +-------------+      +-----------------+      +-----------+
```

## Folder Structure

```
/mail-server
├───.gitattributes
├───.gitignore
├───package.json
├───tsconfig.json
├───src/
│   ├───app.ts
│   ├───config/
│   │   └───smtp.json
│   ├───middleware/
│   │   └───basicAuth.ts
│   ├───services/
│   │   └───mailService.ts
│   └───templates/
│       ├───account_created.html
│       └───welcome.html
└─── ...
```

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/roshankushwaha/mail-server.git
    cd mail-server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure SMTP providers:**

    - Rename `src/config/smtp.json.example` to `src/config/smtp.json`.
    - Edit `src/config/smtp.json` with your SMTP credentials. See the [Configuration](#configuration) section for details.

4.  **Set up environment variables:**

    - Create a `.env` file in the root of the project.
    - Add your basic authentication credentials:

      ```
      PORT=3000
      API_USER= admin
      API_PASSWORD = password
      ```

5.  **Run the server:**

    ```bash
    npm start
    ```

The server will be running on `http://localhost:3000`.

## Configuration

To send emails, you need to configure at least one SMTP provider in `src/config/smtp.json`. The key for each provider object is its `serviceId`, which you will use in your API calls.

**`src/config/smtp.json`:**

```json
{
  "gmail_personal": {
    "host": "smtp.gmail.com",
    "port": 587,
    "user": "your-email@gmail.com",
    "pass": "your-gmail-app-password"
  },
  "yahoo_business": {
    "host": "smtp.mail.yahoo.com",
    "port": 587,
    "user": "your-email@yahoo.com",
    "pass": "your-yahoo-app-password"
  }
}
```

## API Usage

Send an email by making a `POST` request to the `/send-mail/v1` endpoint.

- **Endpoint:** `POST /send-mail/v1`
- **Authentication:** `Basic Auth`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Basic <base64_encoded_credentials>`

**Request Body:**

```json
{
  "serviceId": "gmail_personal",
  "to": "recipient@example.com",
  "subject": "Welcome to Our Service!",
  "template": "welcome",
  "data": {
    "name": "John Doe",
    "loginUrl": "https://example.com/login"
  }
}
```

- `serviceId`: The key from your `smtp.json` corresponding to the SMTP account you want to use.
- `to`: The recipient's email address.
- `subject`: The email subject line.
- `template`: The name of the HTML template file (without the `.html` extension) from the `src/templates` directory.
- `data`: An object containing data to be injected into the Handlebars template.

### Example cURL Request

```bash
curl -X POST http://localhost:3000/send-mail/v1 \
-H "Content-Type: application/json" \
-H "Authorization: Basic $(echo -n 'your_username:your_password' | base64)" \
-d '{
  "serviceId": "gmail_personal",
  "to": "recipient@example.com",
  "subject": "Test Email",
  "template": "welcome",
  "data": {
    "name": "John Doe",
    "loginUrl": "https://example.com/login"
  }
}'
```

## Creating Email Templates

To create a new email template, simply add a new `.html` file to the `src/templates` directory. You can use Handlebars syntax for dynamic content.

**Example `src/templates/welcome.html`:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome!</title>
</head>
<body>
    <h1>Hi {{name}},</h1>
    <p>Welcome to our platform! We are excited to have you.</p>
    <p>You can log in to your account here:</p>
    <a href="{{loginUrl}}">Login Now</a>
</body>
</html>
```
