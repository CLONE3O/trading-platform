from flask import Flask, send_from_directory, jsonify

app = Flask(__name__, static_folder="../frontend", static_url_path="")

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

@app.route("/api/market-data")
def market_data():
    # Dummy data example
    return jsonify({
        "BTCUSD": {"price": 67000, "change": "+1.2%"},
        "ETHUSD": {"price": 3500, "change": "-0.5%"}
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")