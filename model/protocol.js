function Protocol(eventType, timestamp, payload) {
    this.eventType = eventType;
    this.timestamp = timestamp;
    this.payload = payload;
}

module.exports = Protocol;