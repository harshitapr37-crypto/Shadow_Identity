from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulated fraudulent account database
fraudulent_db = {
    "johndoe123@example.com": {
        "full_name": "John Doe",
        "username": "johndoe123",
        "social_media": "Instagram"
    }
}

def scan_for_impersonation(full_name, email):
    print(f"Scanning for: Name='{full_name}', Email='{email}'")
    
    if email in fraudulent_db:
        return {
            "is_fraud_detected": True,
            "fraudulent_account": fraudulent_db[email]
        }
    return {
        "is_fraud_detected": False,
        "fraudulent_account": None
    }

@app.route('/api/scan', methods=['POST'])
def scan():
    data = request.json
    full_name = data.get('fullName')
    email = data.get('emailAddress')

    if not full_name or not email:
        return jsonify({"error": "Missing full name or email address"}), 400

    result = scan_for_impersonation(full_name, email)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
